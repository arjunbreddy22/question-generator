
document.getElementById("generate-question").addEventListener("click", () => {
    

    //check if page valid:
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
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
                func: injectContentScript
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
                        document.getElementById("generate-question").style = "display:none";
                        document.getElementById("get-answer").style = "display:block";
                    } else {
                        document.getElementById("output").textContent = "Failed to generate question.";
                    }
                });                
            }
        );
        function injectContentScript() {
            if (!window.injectContentScriptFlag) {
                window.injectContentScriptFlag = true;
                chrome.scripting.executeScript(
                    {
                        target: {tabId: thisTabId},
                        files: ["content.js"]
                    }
                );
            } 
        }
        
    })
});

document.getElementById("get-answer").addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const myTab = tabs[0].id;
        chrome.tabs.sendMessage(myTab, { action: "generateAnswer" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("MY Error:", chrome.runtime.lastError.message);
                document.getElementById("output").textContent = "Error: Unable to generate answer.";
                return;
            }
            if (response) {
                document.getElementById("answer").textContent = response;
            } else {
                document.getElementById("output").textContent = "Failed to generate answer.";
            }
        });
    });
    
})