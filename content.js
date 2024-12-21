

//STILL NEED TO FIX INJECTING CONTENT.JS MULTIPLE TIMES ISSUE
//display content to popup
var curQuestion = "";
console.log(window.getSelection().toString().trim());
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);
    const selectedText = window.getSelection().toString().trim();
    if (message.action === "displayQuestion") {
        (async () => {
            
            chrome.runtime.sendMessage({action: "fetchKey"}, async (apiKey) => {
              
           
               
                try {
                    const response = await fetch("https://api.openai.com/v1/chat/completions", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: "gpt-4o",
                            messages: [
                                { 
                                    role: "system", 
                                    content: "You are a helpful assistant that generates one question similar to, but with a slightly DIFFERENT essential meaning, a provided question."
                                },
                                {
                                    role: "user",
                                    content: `Create a question based on the following text:\n\n"${selectedText}"`
                                }
                            ],
                            temperature: 1.0
                              
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const question = data.choices[0].message.content.trim();
                        curQuestion = question;
                        console.log("Sending response...");
                        sendResponse(question);
                    } else {
                        console.error("Error:", response.statusText);
                        sendResponse(null);
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                    sendResponse(null);
                }
                
            });
        })();
        return true;
    } else if (message.action === "generateAnswer") {
        (async () => {
            
            chrome.runtime.sendMessage({action: "fetchKey"}, async (apiKey) => {
              
           
               
                try {
                    const response = await fetch("https://api.openai.com/v1/chat/completions", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: "gpt-4o",
                            messages: [
                                { 
                                    role: "system", 
                                    content: "You are a helpful assistant that generates an answer based on a provided question."
                                },
                                {
                                    role: "user",
                                    content: `Generate an answer based on the following question:\n\n"${curQuestion}"`
                                }
                            ],
                            temperature: 0.7
                              
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const answer = data.choices[0].message.content.trim();
                        console.log("Sending answer response...");
                        sendResponse(answer);
                    } else {
                        console.error("Error:", response.statusText);
                        sendResponse(null);
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                    sendResponse(null);
                }
                
            });
        })();
        return true;
    }
    console.log("Sending response4...");
    console.error("Unknown action received:", message.action);
    sendResponse(null);
    return true;
});