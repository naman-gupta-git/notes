import {
  renderNotes,
  notes,
  saveNote,
  deleteNote,
  displayNotesCount,
} from "./scripts/notes.js";
import { openDialogBox, closeDialogBox } from "./scripts/dialogBox.js";

const container = document.getElementById("notesContainer");
let addNoteBtns;
let deleteNoteBtn;
export function refresh() {
  renderNotes(container, notes);

  displayNotesCount(notes);
  addNoteBtns = document.querySelectorAll(".js-add-note");
  addNotefunc(addNoteBtns);
  deleteNoteBtn = document.querySelectorAll(".js-delete-btn");
  deleteFunc(deleteNoteBtn);
  return;
}

refresh();

//this function add event listener to add note buttons
function addNotefunc(addNoteBtns) {
  addNoteBtns.forEach((btn) => {
    btn.addEventListener("click", openDialogBox);
  });
}

//this function add event listener to close dialog box button
{
  document.querySelectorAll(".js-close-btn").forEach((btn) => {
    btn.addEventListener("click", closeDialogBox);
  });
}

{
  document.querySelector(".js-save-btn").addEventListener("click", saveNote);
}

//this function adds event listner to delete note button
function deleteFunc(deleteNoteBtn) {
  deleteNoteBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      deleteNote(id);
    });
  });
}
