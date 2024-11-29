console.log("first");
//get html of highlighted text
chrome.action.onClicked.addListener(async (tab) => {
    console.log("testing question generator content");
    // console.log(window.getSelection().toString());    
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: changePageContent // This function will run in the context of the tab
    });
});
console.log("end");
//listen for user to press icon

    // on press, pass text into gpt to have it generate new questions
    //
function changePageContent() {
    document.body.style.backgroundColor = "lightblue";
    console.log("changed page content");
}