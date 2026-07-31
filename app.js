const webcam = document.getElementById('webcam');
const preview = document.getElementById('preview');
const startCamBtn = document.getElementById('startCamBtn');
const captureBtn = document.getElementById('captureBtn');
const fileInput = document.getElementById('fileInput');
const loading = document.getElementById('loading');
const resultOutput = document.getElementById('resultOutput');
const canvas = document.getElementById('canvas');

let stream = null;

// Database of waste types for intelligent recognition simulation
const wasteDatabase = [
  {
    name: "Paper / Cardboard Box",
    bin: "recycle",
    binLabel: "RECYCLE BIN",
    prep: "Flatten the box and ensure it is dry and clean from grease or food residue.",
    co2: "0.12 kg CO2 offset"
  },
  {
    name: "Glass Bottle / Jar",
    bin: "recycle",
    binLabel: "RECYCLE BIN",
    prep: "Rinse out liquids, remove metal/plastic caps, and place gently in glass recycling.",
    co2: "0.15 kg CO2 offset"
  },
  {
    name: "Food Scraps / Banana Peel",
    bin: "compost",
    binLabel: "COMPOST BIN",
    prep: "Place directly in green organic/compost waste. Avoid plastic wrapping.",
    co2: "0.20 kg CO2 offset"
  },
  {
    name: "Plastic Water Bottle",
    bin: "recycle",
    binLabel: "RECYCLE BIN",
    prep: "Empty any remaining liquid, crush the bottle, and replace cap before binning.",
    co2: "0.08 kg CO2 offset"
  },
  {
    name: "Electronic Waste / Battery",
    bin: "trash",
    binLabel: "HAZARDOUS / E-WASTE",
    prep: "Do not put in household bin. Drop off at a designated e-waste recycling point.",
    co2: "0.45 kg CO2 offset"
  },
  {
    name: "Soiled Food Wrapper / Trash",
    bin: "trash",
    binLabel: "LANDFILL TRASH",
    prep: "Non-recyclable due to food contamination. Dispose in general landfill bin.",
    co2: "0.00 kg CO2 offset"
  }
];

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

// 2. Capture Photo from Webcam
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

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  analyzeImage();
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
      analyzeImage();
    };
    reader.readAsDataURL(file);
  }
});

// 4. Dynamic Waste Classification Engine
function analyzeImage() {
  loading.style.display = 'block';
  resultOutput.innerHTML = '';

  setTimeout(() => {
    loading.style.display = 'none';

    // Selects a random waste item category from the database
    const detectedItem = wasteDatabase[Math.floor(Math.random() * wasteDatabase.length)];

    resultOutput.innerHTML = `
      <h3>Item Identified: ${detectedItem.name}</h3>
      <p><span class="bin-tag ${detectedItem.bin}">${detectedItem.binLabel}</span></p>
      <p><strong>Preparation:</strong> ${detectedItem.prep}</p>
      <p><strong>Environmental Impact:</strong> ~${detectedItem.co2} per processed item!</p>
    `;
  }, 1200);
}
