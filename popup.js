document.getElementById("generate-question").addEventListener("click", () => {
    console.log("button clicked");

    //check if page valid:
    
   

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        console.log('got to chrome.tabs.query');
        const thisTabId = tabs[0].id;
         // Check if the URL is a valid page
        if (tabs[0].url.startsWith('chrome://') || tabs[0].url.startsWith('about:')) {
            console.error('Cannot access a chrome:// or about: URL');
            alert('This extension does not work on chrome:// or about: pages.');
            return;
        }
        //run content.js
        chrome.scripting.executeScript(
            {
                target: {tabId: thisTabId},
                files: ["content.js"]
            },
            () => {
                console.log("Sending message to content.js...");
                chrome.tabs.sendMessage(thisTabId, { action: "displayQuestion" }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("MY Error:", chrome.runtime.lastError.message);
                        document.getElementById("output").textContent = "Error: Unable to generate question.";
                        return;
                    }
                    if (response) {
                        document.getElementById("output").textContent = response;
                    } else {
                        document.getElementById("output").textContent = "Failed to generate question.";
                    }
                });                
            }

        );
        
    })
});