chrome.runtime.onInstalled.addListener(function() {
    chrome.action.onClicked.addListener(function() {
        chrome.tabs.create({url: chrome.runtime.getURL("popup.html")});
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'validateCSV') {
        handleCSVData(message.csvData, sendResponse);
    }
    return true; // Indicate that you wish to send a response asynchronously
});

function handleCSVData(csvData, sendResponse) {
    try {
        const parsedData = parseCSV(csvData);
        const validatedData = validateCSV(parsedData);
        const csvOutput = convertToCSV(validatedData);
        sendResponse({ result: csvOutput });
    } catch (error) {
        sendResponse({ error: error.message });
    }
}

function parseCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim().length > 0);
    const headers = lines[0].split(',').map(header => header.trim());
    const parsedData = [];
    lines.slice(1).forEach((line, index) => {
        const values = line.split(',').map(value => value.trim());
        if (values.length === headers.length) {
            parsedData.push(headers.reduce((acc, header, index) => {
                acc[header] = values[index];
                return acc;
            }, {}));
        } else {
            console.error(`Row ${index + 2} skipped due to mismatch in number of values:`, line);
        }
    });
    return parsedData;
}

function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const lines = data.map(row => headers.map(header => row[header]).join(','));
    return [headers.join(',')].concat(lines).join('\n');
}

function validateCSV(data) {
    return data.map(row => {
        row.phone1_valid = validatePhone(row.phone1);
        row.phone_valid = validatePhone(row.phone);
        row.email_valid = validateEmail(row.email);
        return row;
    });
}

function validatePhone(phoneNumber) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber) ? 'valid' : 'invalid';
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) ? 'valid' : 'invalid';
}

