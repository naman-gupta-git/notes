import { refresh } from "../app.js";
import { closeDialogBox } from "./dialogBox.js";

export let notes = JSON.parse(localStorage.getItem("notes")) || [];

export function renderNotes(container, notes) {
  if (notes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
      <h2>
        No Notes
      </h2>
      <p>
        Add Your first note..!!
      </p>
      <div class="add-note-btn js-add-note">
        +
      </div>
    </div>
    `;
    return;
  }
  let HTML = ``;

  // this is the edit note button which is not added yet..
  //<div class="edit-btn js-edit-btn" data-id="${note.id}">
  //   <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="edit-icon"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
  // </div>

  notes.forEach((note) => {
    HTML += `
      <div class="note-card">
      <div class="note-actions">
        <div class="delete-btn js-delete-btn" data-id="${note.id}">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="delete-icon"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
        </div>
      </div>
      <h2 class="note-title">
        ${note.title}
      </h2>
      <p class="note-content">${note.content}</p>
    </div>
    `;
  });
  container.innerHTML = HTML;
  return;
}

//this function adds, saves and renders the note on the page
export function saveNote(event) {
  event.preventDefault();
  const id = String(Date.now());
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;
  notes.unshift({
    id,
    title,
    content,
  });
  localStorage.setItem("notes", JSON.stringify(notes));
  closeDialogBox();
  refresh();
  return;
}


//This function deletes a note 
export function deleteNote(id) {
  notes = notes.filter(note => note.id !== id)
  localStorage.setItem('notes', JSON.stringify(notes));
  refresh();
  return;
}

export function displayNotesCount(notes) {
  const container = document.querySelector(".notes_count");
  container.innerText = notes.length;
  return;
}