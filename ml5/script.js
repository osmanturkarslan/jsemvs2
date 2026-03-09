
let handpose;
let poses = [];
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error('Error accessing webcam: ', err);
    });


    video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    };

async function preload() {
    handpose = await ml5.handPose({ runtime: 'mediapipe' });
    handpose.detectStart(video, gotHands);

}

function mousePressed() {
    console.log(hands);
}

function gotHands(results) {
    console.log(results);
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let hand of results) {
            if (hand.confidence > 0.1) {
                for (let i = 0; i < hand.keypoints.length; i++) {
                    let keypoint = hand.keypoints[i];
                    // ctx.beginPath();
                    // ctx.arc(keypoint.x, keypoint.y, 10, 0, 2 * Math.PI);
                    // ctx.fillStyle = 'red';
                    // ctx.fill();

                    if (Math.abs(hand.index_finger_tip.x - hand.thumb_tip.x) < 10 && Math.abs(hand.index_finger_tip.y - hand.thumb_tip.y) < 10) {
                        ctx.beginPath();
                        ctx.arc(hand.index_finger_tip.x, hand.index_finger_tip.y, 20, 0, 2 * Math.PI);
                        ctx.fillStyle = 'blue';
                        ctx.fill();
                        // ctx.
                    }
                }
            }
        }

}



preload();