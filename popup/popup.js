import { sendImageToAPI } from './sendImage.js';  // Import sendImageToAPI function from another module

const imageInput = document.getElementById("image-input");
const resultContainer = document.getElementById("result-container");
const checkButton = document.getElementById("check-button");
const dropZone = document.getElementById("drop-zone");

// Function to handle drag over effect
dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");
});

// Remove the dragover effect when user leaves the zone
dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

// Handle dropped image
dropZone.addEventListener("drop", async (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover");

    const file = event.dataTransfer.files[0];
    if (file) {
        const base64Image = await convertImageToBase64(file);
        const result = await sendImageToAPI(base64Image);
        displayResult(result);
    }
});

// Handle paste event for copying an image
document.addEventListener("paste", async (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.includes("image")) {
            const file = items[i].getAsFile();
            if (file) {
                const base64Image = await convertImageToBase64(file);
                const result = await sendImageToAPI(base64Image);
                displayResult(result);
            }
        }
    }
});

// Handle file selection via the input field
checkButton.addEventListener("click", async () => {
    const file = imageInput.files[0];
    if (!file) {
        resultContainer.innerText = "Please select an image.";
        return;
    }

    resultContainer.innerHTML = '';  // Clear previous results

    const base64Image = await convertImageToBase64(file);
    const result = await sendImageToAPI(base64Image);
    displayResult(result);
});

// Function to convert image to base64 format
async function convertImageToBase64(file) {
    const reader = new FileReader();
    return new Promise((resolve) => {
        reader.onloadend = function () {
            resolve(reader.result.split(",")[1]);  // Remove the data URL prefix
        };
        reader.readAsDataURL(file);
    });
}

// Function to display results
function displayResult(result) {
    if (result.message === "deepfake") {
        resultContainer.innerHTML = `<p style="color: red; font-weight: bold;">This is a Deepfake!</p>`;
    } else if (result.message === "real") {
        resultContainer.innerHTML = `<p style="color: green; font-weight: bold;">This is a Real image!</p>`;
    } else {
        resultContainer.innerHTML = `<p style="color: orange; font-weight: bold;">Error processing the image.</p>`;
    }
}

