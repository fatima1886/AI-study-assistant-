

// 1. Imports must always be at the top of the file
import { ForListItem } from "./listItem.js";

// 2. DOM Elements
const title = document.getElementById("note-title");
const body = document.getElementById("note-body");
const saveButton = document.querySelector(".Savebtn");
const listItems = document.querySelector(".listItem");
const alertPara = document.querySelector(".alertPara");

// 3. Logic Functions
function saveNote() {
    if (title.value === "" || body.value === "") {
        alertPara.classList.remove("hidden");
return;
    }
else{
    alertPara.classList.add("hidden");
    const noteCreated = {
        title: title.value,
        body: body.value
    };
    // Save JSON string to localStorage
    localStorage.setItem("noteCreated", JSON.stringify(noteCreated));
    parsedata();
    // Wipe inputs dry clean
    title.value = "";
    body.value = "";
}
}

function parsedata(){
    const checkSavedData = localStorage.getItem("noteCreated");
    if (checkSavedData) {
        const parsedData = JSON.parse(checkSavedData);
        
        // Pass both the DOM target element and the data object into your module function
        ForListItem(listItems, parsedData);
    }

}

// 4. Event Listeners
saveButton.addEventListener("click", () => {
    saveNote();
    
});




