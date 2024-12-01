//display content to popup
console.log(window.getSelection().toString());
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "displayQuestion") {
        sendResponse(window.getSelection().toString());
    }
});