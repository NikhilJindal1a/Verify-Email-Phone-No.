document.getElementById('validateButton').addEventListener('click', () => {
    const fileInput = document.getElementById('csvFileInput');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const csvData = event.target.result;
            chrome.runtime.sendMessage({ action: 'validateCSV', csvData: csvData }, (response) => {
                if (chrome.runtime.lastError) {
                    document.getElementById('output').innerText = 'Error: ' + chrome.runtime.lastError.message;
                } else if (response.error) {
                    document.getElementById('output').innerText = 'Error: ' + response.error;
                } else {
                    document.getElementById('output').innerText = 'Validation complete! Downloading...';
                    // Trigger download of the validated CSV
                    const blob = new Blob([response.result], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'validated_contacts.csv';
                    a.click();
                    URL.revokeObjectURL(url);
                }
            });
        };

        reader.onerror = function() {
            document.getElementById('output').innerText = 'Error reading file';
        };

        reader.readAsText(file);
    } else {
        document.getElementById('output').innerText = 'Please select a CSV file.';
    }
});

