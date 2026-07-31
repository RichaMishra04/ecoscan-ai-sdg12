const webcam = document.getElementById('webcam');
const preview = document.getElementById('preview');
const startCamBtn = document.getElementById('startCamBtn');
const captureBtn = document.getElementById('captureBtn');
const fileInput = document.getElementById('fileInput');
const loading = document.getElementById('loading');
const resultOutput = document.getElementById('resultOutput');
const canvas = document.getElementById('canvas');

let stream = null;

// 1. Open Camera
startCamBtn.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    webcam.srcObject = stream;
    webcam.style.display = 'block';
    preview.style.display = 'none';
    captureBtn.style.display = 'inline-block';
    startCamBtn.style.display = 'none';
  } catch (err) {
    alert("Camera access denied or unavailable.");
  }
});

// 2. Capture Photo from Webcam Feed
captureBtn.addEventListener('click', () => {
  const context = canvas.getContext('2d');
  canvas.width = webcam.videoWidth || 400;
  canvas.height = webcam.videoHeight || 300;
  context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
  
  const imageData = canvas.toDataURL('image/png');
  preview.src = imageData;
  preview.style.display = 'block';
  webcam.style.display = 'none';
  captureBtn.style.display = 'none';
  startCamBtn.style.display = 'inline-block';

  // Stop video stream track
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  analyzeImage(imageData);
});

// 3. File Upload Listener
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      preview.src = event.target.result;
      preview.style.display = 'block';
      webcam.style.display = 'none';
      analyzeImage(event.target.result);
    };
    reader.readAsDataURL(file);
  }
});

// 4. AI Image Analysis Engine
async function analyzeImage(imageSrc) {
  loading.style.display = 'block';
  resultOutput.innerHTML = '';

  // Simulated AI vision output (Can be connected to live Gemini API endpoint)
  setTimeout(() => {
    loading.style.display = 'none';
    resultOutput.innerHTML = `
      <h3>Item Identified: Plastic Container / Bottle</h3>
      <p><span class="bin-tag recycle">RECYCLE BIN</span></p>
      <p><strong>Preparation:</strong> Rinse thoroughly to eliminate contamination before placing into the blue bin.</p>
      <p><strong>Environmental Impact:</strong> ~0.08 kg CO2 footprint offset per recycled item!</p>
    `;
  }, 1200);
}