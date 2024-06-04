const joystickHandle = document.getElementById('joystick-handle');
const joystickBase = document.getElementById('joystick-base');
const maxDistance = joystickBase.clientWidth / 2 - joystickHandle.clientWidth / 2;
const notificationImage = document.getElementById('notification-image');
const notification = document.getElementById('notificatio-n');
const notificationSound = document.getElementById('notification-sound');
const body = document.getElementById('body');
var a =1;

let dragging = false;
let startX, startY;
const codeSequence = ['下', '右边', '下', '右边','上'];
let inputSequence = [];
let firstTouch = false;

joystickHandle.addEventListener('mousedown', startDrag);
document.addEventListener('mouseup', stopDrag);
document.addEventListener('mousemove', drag);

function startDrag(event) {
    dragging = true;
    const rect = joystickBase.getBoundingClientRect();
    startX = rect.left + rect.width / 2;
    startY = rect.top + rect.height / 2;
	if (!firstTouch) {
        firstTouch = true;
		startRecording();
        setTimeout(showNotificationImage, 5000);
    }
}

function stopDrag(event) {
    dragging = false;
    joystickHandle.style.transform = 'translate(-50%, -50%)'; // Reset position to center
    checkDirection(event);
}

function drag(event) {
    if (!dragging) return;

    const rect = joystickBase.getBoundingClientRect();
    const baseX = rect.left + rect.width / 2;
    const baseY = rect.top + rect.height / 2;
    
    const dx = event.clientX - baseX;
    const dy = event.clientY - baseY;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);

    const angle = Math.atan2(dy, dx);

    const x = distance * Math.cos(angle);
    const y = distance * Math.sin(angle);

    joystickHandle.style.transform = `translate(${x - 50}%, ${y - 50}%)`;
}

function checkDirection(event) {
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    let direction;
    if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? '右边' : '左边';
    } else {
        direction = dy > 0 ? '下' : '上';
    }

    inputSequence.push(direction);

    if (inputSequence.length === codeSequence.length) {
        if (inputSequence.every((val, index) => val === codeSequence[index])) {
			a=0;
			notification.style.display = 'block';
			
        } else {
            alert('Incorrect sequence, try again.');
        }
        inputSequence = [];
    }
}
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function showNotificationImage() {
    notificationImage.style.display = 'block';
	document.body.classList.add('show-notification');
	notificationSound.play();
	setTimeout(() => {
		notificationImage.style.display = 'none';
		document.body.classList.remove('show-notification');
    }, 1500); // Hide the image after 5 seconds
	if (a==1){
		let b = getRandomNumber(100000, 10000000);
		console.log(b);
		setTimeout(() => {
			showNotificationImage()
	}, b); }
}

    let mediaRecorder;
    let recordedChunks = [];
    let recordingStarted = false;

    // Access the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // Initialize MediaRecorder
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function(event) {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = function() {
          let blob = new Blob(recordedChunks, { type: 'video/webm' });
          recordedChunks = [];
          let videoURL = URL.createObjectURL(blob);

          // Create a download link and automatically click it
          let downloadLink = document.createElement('a');
          downloadLink.href = videoURL;
          downloadLink.download = 'recorded_video.webm';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          // Stop the webcam stream
          stream.getTracks().forEach(track => track.stop());
        };
      })
      .catch(err => {
        console.error("Error accessing webcam: " + err);
      });

    // Start recording on first touch or click
    function startRecording() {
      if (!recordingStarted) {
        recordingStarted = true;
        mediaRecorder.start();
        console.log('Recording started');

        // Stop recording after 10 seconds
        setTimeout(() => {
          mediaRecorder.stop();
          console.log('Recording stopped');
        }, 12000);
      }
    }
