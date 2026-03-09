/* =====================================================
   GLOBAL VARIABLES
   ===================================================== */

// Maximum number of photos allowed
const maxPhotos = 20;

// Current photo counter
let photoCount = 0;

// Stores base64 image data
let photos = [];

/* =====================================================
   WEBCAM FUNCTIONS
   ===================================================== */

/*
  Starts the webcam stream and shows
  the Capture Photo button
*/
async function setupWebcam() {
  const video = document.getElementById("webcam");

  video.srcObject = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480 },
  });

  video.onloadedmetadata = () => video.play();

  document.getElementById("capturePhoto").style.display = "inline-block";
}

/*
  Stops the webcam and hides
  the Capture Photo button
*/
function stopWebcam() {
  const video = document.getElementById("webcam");

  const stream = video.srcObject;

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  video.srcObject = null;

  document.getElementById("capturePhoto").style.display = "none";
}

/* =====================================================
   PHOTO CAPTURE
   ===================================================== */

/*
  Captures an image from the webcam
  and creates a thumbnail preview
*/
function capturePhoto() {
  if (photoCount >= maxPhotos) {
    alert("Maximum photo limit reached (20)");
    return;
  }

  const video = document.getElementById("webcam");

  const canvas = document.createElement("canvas");

  canvas.width = 1280;
  canvas.height = 720;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL("image/png");

  photos.push(dataURL);

  photoCount++;

  createThumbnail(canvas, dataURL);
}

/* =====================================================
   CREATE PHOTO THUMBNAIL
   ===================================================== */

function createThumbnail(canvas, dataURL) {
  const wrapper = document.createElement("div");
  wrapper.className = "photo-wrapper";

  const preview = document.createElement("canvas");

  preview.width = 290;
  preview.height = 200;

  const ctx2 = preview.getContext("2d");

  ctx2.drawImage(canvas, 0, 0, 290, 200);

  const options = document.createElement("div");
  options.className = "photo-options";

  options.innerHTML = `

  <button onclick="viewPhoto('${dataURL}')">
  <i class="fa-solid fa-eye"></i>
  </button>

  <button onclick="downloadPhoto('${dataURL}')">
  <i class="fa-solid fa-download"></i>
  </button>
  `;

  wrapper.appendChild(preview);
  wrapper.appendChild(options);

  if (document.getElementById("links").children.length < 2)
    document.getElementById("links").appendChild(wrapper);
  else if (document.getElementById("rechts").children.length < 2)
    document.getElementById("rechts").appendChild(wrapper);
  else document.getElementById("unten").appendChild(wrapper);

  if (photoCount > 1) {
    document.getElementById("downloadAll").style.display = "inline-block";
  }
}

/* =====================================================
   POPUP VIEWER
   ===================================================== */

function viewPhoto(url) {
  document.getElementById("popupImg").src = url;

  document.getElementById("photoPopup").style.display = "flex";
}

function closePopup() {
  document.getElementById("photoPopup").style.display = "none";
}

/* =====================================================
   DOWNLOAD FUNCTIONS
   ===================================================== */

function downloadPhoto(url) {
  const link = document.createElement("a");

  link.href = url;
  link.download = "photo.png";

  link.click();
}

async function downloadAllPhotos() {
  if (photos.length === 0) return;

  const zip = new JSZip();

  photos.forEach((dataURL, i) => {
    const base64 = dataURL.split(",")[1];

    zip.file(`photo${i + 1}.png`, base64, { base64: true });
  });

  const content = await zip.generateAsync({ type: "blob" });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(content);

  link.download = "photos.zip";

  link.click();
}
