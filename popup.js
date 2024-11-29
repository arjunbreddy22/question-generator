document.getElementById("generate-question").addEventListener("click", () => {
    console.log("button clicked");
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        console.log('got to chrome.tabs.query');
        const thisTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: {tabId: thisTabId},
            files: ["content.js"]

        })
        
    })
});