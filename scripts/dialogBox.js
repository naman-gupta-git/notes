export function openDialogBox() {
  document.getElementById("noteDialog").showModal();
  document.getElementById('noteTitle').focus();
  return;
}
export function closeDialogBox() {
  document.getElementById("noteDialog").close();
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
  document.getElementById('dialogTitle').innerHTML = 'Add New Note';
  document.querySelector('.js-save-btn').innerHTML = 'Save Note';
}