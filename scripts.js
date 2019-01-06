// Vue button components
Vue.component('record-button', {
    props: ['seconds','recording'],
    computed: {
        time: function () {
            if (!this.recording)
                return '';
            else
                return 'ing... ' + this.seconds;
        }
    },
    template: `<div class="record"><i class="fas fa-microphone"></i>Record{{time}}</div>`,
});
Vue.component('listen-button', {
    template: '<div class="listen"><i class="fas fa-play"></i>Listen</div>'
});
Vue.component('download-button', {
    template: '<div class="download"><i class="fas fa-file-download"></i>Download</div>'
});


// Main Vue Application
var app = new Vue({
    el: '#app',
    data: {
        title: 'MP3 Voice Recorder',
        recording: false,
        timer: null,
        recorder: null,
        seconds: 0,
        lastRecording: null,
    },
    methods: {
        record: function () {
            //clear timer
            app.seconds = 0;
            window.clearInterval(this.timer);
            
            if (!this.recording) {
                // alert('recording has started');
                this.recorder = new MP3Recorder({ bitRate: 128 });
                this.recorder.start(function () {
                    //update button text to show time recording
                    console.log('started recording');
                }, function () {
                    alert('We could not make use of your microphone at the moment');
                });
                //start timer for recording visual cue
                // window.clearInterval(this.timer);
                this.timer = window.setInterval(function () {
                    app.seconds++;
                    console.log(app.seconds);
                }, 1000);
            }
            else {
                console.log('recording has stopped');
                this.recorder.stop();
                this.recorder.getMp3Blob(function (blob) {
                    blobToDataURL(blob, function (url) {
                        app.lastRecording = url;
                    });
                });
            }
            this.recording = !this.recording;
        },
        listen: function () {
            if (app.lastRecording == null) {
                alert('Please record something first.');
            } else {
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
    }
});



function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function (e) {
        callback(e.target.result);
    }
    a.readAsDataURL(blob);
}