// Vue button components
Vue.component('record-button', {
    template: `<button class="record">Record</button>`,
})
Vue.component('listen-button', {
    template: '<button class="listen">listen</button>'
})
Vue.component('download-button', {
    template: '<button class="download">download</button>'
})
Vue.component('send-button', {
    props: ['val'],
    template: '<button class="send">{{val}}</button>'
})

// Main Vue Application
var app = new Vue({
    el: '#app',
    data: {
        title: 'MP3 Voice Recorder',
        recording: false,
        formHidden: true,
        timer: null,
        seconds: 0,
        recorder: new MP3Recorder({ bitRate: 128 }),
        lastRecording: null,
    },
    methods: {
        record: function () {
            if (!this.recording) {
                // alert('recording has started');
                this.recorder.start(function(){
                    //update button text to show time recording
                    console.log('started recording');
                }, function(){
                    alert('We could not make use of your microphone at the moment');
                });
            }
            else {
                console.log('recording has stopped');
                this.recorder.stop();
                this.recorder.getMp3Blob(function(blob){
                    blobToDataURL(blob, function(url){
                        app.lastRecording = url;
                    });
                });
            }
            this.recording = !this.recording;
        },
        listen: function () {
            if(app.lastRecording == null){
                alert('Please record something first.');
            } else{
                //create an audio element, set source, and play it
                var a = document.createElement('audio');
                a.setAttribute('src', app.lastRecording);
                a.play();
            }
        },
        download: function () {
            // create an anchor tag, set the href and filename, and download it
            var link = document.createElement('a');
            link.setAttribute('href', app.lastRecording);
            link.download = 'recording.mp3';
            link.click();
        },
        send: function () {
            this.formHidden = !this.formHidden;
        },
    }
});



function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function (e) {
        callback(e.target.result);
    }
    a.readAsDataURL(blob);
}