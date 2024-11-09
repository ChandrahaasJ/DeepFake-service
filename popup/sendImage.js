export async function sendImageToAPI(base64Image) {
    try {
        const response = await fetch("http://127.0.0.1:8000/process_image/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ base64_image: base64Image }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error sending image to API:", error);
        return { message: "error" };
    }
}
