


import { renderNotes } from "./listItem.js";

// ==========================
// DOM Elements
// ==========================

const titleInput = document.getElementById("note-title");
const bodyInput = document.getElementById("note-body");

const saveBtn = document.querySelector(".Savebtn");
const deleteBtn = document.getElementById("deleteBtn");

const searchInput = document.getElementById("search");

const listContainer = document.querySelector(".listItem");

const alertPara = document.querySelector(".alertPara");

const selectedText = document.querySelector(".selectedNote");

const copynotes = document.querySelector("#copyNote");

// ==========================
// Data
// ==========================

let notes = JSON.parse(localStorage.getItem("allNotes")) || [];

// null = creating a new note

let selectedIndex = null;

// ==========================
// Save LocalStorage
// ==========================

function saveLocalStorage() {

    localStorage.setItem(
        "allNotes",
        JSON.stringify(notes)
    );

}

// ==========================
// Refresh Sidebar
// ==========================

function refreshSidebar() {

    renderNotes(
        listContainer,
        notes,
        selectedIndex
    );

}

// ==========================
// Reset Inputs
// ==========================

function clearInputs() {

    titleInput.value = "";
    bodyInput.value = "";

    selectedIndex = null;

    selectedText.textContent =
        "No note selected";

}

// ==========================
// Initial Render
// ==========================

refreshSidebar();

// ==========================
// Save Button
// ==========================

saveBtn.addEventListener("click", () => {

    const title = titleInput.value.trim();

    const body = bodyInput.value.trim();

    if (title === "" || body === "") {

        alertPara.classList.remove("hidden");

        return;

    }

    alertPara.classList.add("hidden");

    const note = {

        title,
        body

    };

    // -------------------------
    // Create
    // -------------------------

    if (selectedIndex === null) {

        notes.unshift(note);

    }

    // -------------------------
    // Update
    // -------------------------

    else {

        notes[selectedIndex] = note;

    }

    saveLocalStorage();

    refreshSidebar();

    clearInputs();

});

// ==========================
// Click Note (Event Delegation)
// ==========================

listContainer.addEventListener("click", (e) => {

    const item = e.target.closest(".selectitem");

    if (!item) return;

    selectedIndex = Number(
        item.dataset.index
    );

    const note = notes[selectedIndex];

    titleInput.value = note.title;

    bodyInput.value = note.body;

    selectedText.textContent =
        `Editing : ${note.title}`;

    refreshSidebar();

});

// ==========================
// Delete
// ==========================

deleteBtn.addEventListener("click", () => {

    if (selectedIndex === null) return;

    notes.splice(selectedIndex, 1);

    saveLocalStorage();

    refreshSidebar();

    clearInputs();

});

// ==========================
// Search
// ==========================

searchInput.addEventListener("input", () => {

    const value =
        searchInput.value.toLowerCase();

    const filtered = notes.filter(note => {

        return note.title
            .toLowerCase()
            .includes(value);

    });

    renderNotes(
        listContainer,
        filtered,
        selectedIndex
    );

});




if (copynotes && bodyInput) {
  copynotes.addEventListener("click", () => {
    const textToCopy = bodyInput.value;

    // 1. Try modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => handleSuccess())
        .catch(err => console.error("Modern copy failed: ", err));
    } else {
      // 2. Fallback method for HTTP / older browsers
      try {
        bodyInput.select();
        bodyInput.setSelectionRange(0, 99999); // For mobile devices
        const successful = document.execCommand("copy");
        if (successful) {
          handleSuccess();
        } else {
          console.error("Fallback copy command failed");
        }
        window.getSelection().removeAllRanges(); // Deselect text
      } catch (err) {
        console.error("Fallback failed: ", err);
      }
    }
  });
}

// Helper function to manage UI changes
function handleSuccess() {
  copynotes.textContent = "copied!";
  setTimeout(() => {
    copynotes.textContent = "Copy";
  }, 2000);
}




