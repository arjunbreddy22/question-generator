

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
                                    content: `You are a versatile AI assistant and tutor who:
                                    1. Generates a new problem in the same format as the original one:
                                        a) If the user’s question has multiple choices (A, B, C, D), create a similar multiple-choice question.
                                        b) If the user’s question is a short-answer math problem, create a similar short-answer math problem.
                                        c) If the user’s question is an open-ended explanation question, create a similarly open-ended question, etc.
                                    2. Re-use the same passage/context (i.e., do not invent an entirely new scenario) if a passage was provided.
                                        a) Only make slight modifications or ask a different question about the same information so that a potential student is still tested on the same core ideas or data.
                                    3. Ensure the newly generated question is similar but slightly different, so a student can still be challenged in the same way.
                                    4. If the original question references the passage to find the answer, then the new question must do the same.
                                    5. Do NOT create a new passage unless explicitly instructed to. Use the original passage as is. Make note that a passage may not be provided at all though.`
                                },
                                {
                                    role: "user",
                                    content: `Create a new problem based on the following text:\n\n"${selectedText}". Only return to me the problem with no other extra wording.`
                                }
                            ],
                            temperature: 0.7
                              
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
                                    content: `You are a helpful assistant that generates an answer based on a provided question. This provided question is based off of another, original question. Extract useful content from the original question if and only if there is any useful context at all. Here's the original question: \n\n"${selectedText}`
                                },
                                {
                                    role: "user",
                                    content: `First, explain any useful context you may have gotten from the original question (if any) then generate an answer based on the following question:\n\n"${curQuestion}"`
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