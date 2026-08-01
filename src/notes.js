// const title = document.getElementById("note-title");
// const body = document.getElementById("note-body");
// const showTitle = document.querySelector(".title");
// const showBody = document.querySelector(".body");
// const saveButton = document.querySelector(".Savebtn");
// const listItems = document.querySelector(".listItem");

// function saveNote() {
//     const noteCreated = {
//         title: title.value,
//         body: body.value
//     };
//     // Save JSON string to localStorage
//     localStorage.setItem("noteCreated", JSON.stringify(noteCreated));
//     // Wipe inputs dry clean
//     title.value = "";
//     body.value = "";
// }
// import { ForListItem } from "listItem.js";

// saveButton.addEventListener("click", () => {
//     saveNote();
//     const checkSavedData = localStorage.getItem("noteCreated");
//     if (checkSavedData) {
//         const parsedData = JSON.parse(checkSavedData);
//         ForListItem();
//     }
// });

// 1. Imports must always be at the top of the file
import { ForListItem } from "./listItem.js";

// 2. DOM Elements
const title = document.getElementById("note-title");
const body = document.getElementById("note-body");
const saveButton = document.querySelector(".Savebtn");
const listItems = document.querySelector(".listItem");

// 3. Logic Functions
function saveNote() {
    const noteCreated = {
        title: title.value,
        body: body.value
    };
    // Save JSON string to localStorage
    localStorage.setItem("noteCreated", JSON.stringify(noteCreated));
    
    // Wipe inputs dry clean
    title.value = "";
    body.value = "";
}

// 4. Event Listeners
saveButton.addEventListener("click", () => {
    saveNote();
    
    const checkSavedData = localStorage.getItem("noteCreated");
    if (checkSavedData) {
        const parsedData = JSON.parse(checkSavedData);
        
        // Pass both the DOM target element and the data object into your module function
        ForListItem(listItems, parsedData);
    }
});




