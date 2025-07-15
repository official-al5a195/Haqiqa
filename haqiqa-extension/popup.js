document.addEventListener('DOMContentLoaded', function() {
    const verifyButton = document.getElementById('verify-button');
    const urlInput = document.getElementById('url-input');
    const resultsDiv = document.getElementById('results');

    verifyButton.addEventListener('click', function() {
        const url = urlInput.value;

        if (url) {
            console.log('Verifying URL:', url);
            resultsDiv.innerHTML = '<p>Analyzing link... Please wait.</p>';
            // In the next phase, we will send this URL to the background script
            // for processing.
        } else {
            resultsDiv.innerHTML = '<p style="color: red;">Please paste a URL first.</p>';
        }
    });
});