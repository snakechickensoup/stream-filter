const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');

const startWebcam = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    videoElement.play();
  } catch (error) {
    console.error('Error accessing webcam:', error);
  }
};

startWebcam();

const renderFrame = () => {
  const context = canvasElement.getContext('2d');
  context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  requestAnimationFrame(renderFrame);
};

videoElement.onloadedmetadata = () => {
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  renderFrame();
};
