async function uploadAudio() {
    const file = document.getElementById('audioFile').files[0];
    const language = document.getElementById('language').value;
    const resultDiv = document.getElementById('result');
    
    if (!file) {
        alert('कृपया कोई ऑडियो फाइल चुनें');
        return;
    }

    resultDiv.innerText = 'प्रोसेसिंग...';

    try {
        const formData = new FormData();
        formData.append('audio', file);
        formData.append('language', language);

        const response = await fetch('YOUR_BACKEND_URL/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.text) {
            resultDiv.innerText = data.text;
        } else {
            resultDiv.innerText = 'टेक्स्ट कन्वर्ट नहीं हो पाया';
        }
    } catch (error) {
        resultDiv.innerText = 'त्रुटि: ' + error.message;
    }
}
