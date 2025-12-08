/* Collaboration & Feedback forms
   - Save entries to localStorage
   - Export JSON for owner view
*/
function saveLocal(key, obj){
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr.push({ ...obj, ts: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(arr));
}

function exportLocal(key, filename){
  const blob = new Blob([localStorage.getItem(key) || '[]'], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

window.addEventListener('DOMContentLoaded', () => {
  // Collab form
  const collab = document.getElementById('collabForm');
  const cmsg = document.getElementById('collabMsg');
  const exportC = document.getElementById('exportCollab');
  if (collab){
    collab.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(collab).entries());
      saveLocal('evodoc_collab', data);
      collab.reset();
      cmsg.textContent = "Thanks! Your interest is saved locally. You can export and email it.";
      setTimeout(()=> cmsg.textContent='', 5000);
    });
    exportC?.addEventListener('click', () => exportLocal('evodoc_collab', 'evodoc-collab.json'));
  }

  // Feedback form
  const fb = document.getElementById('feedbackForm');
  const fmsg = document.getElementById('fbMsg');
  const exportF = document.getElementById('exportFeedback');
  if (fb){
    fb.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(fb).entries());
      saveLocal('evodoc_feedback', data);
      fb.reset();
      fmsg.textContent = "Appreciate it — saved privately on this device. Export to share.";
      setTimeout(()=> fmsg.textContent='', 5000);
    });
    exportF?.addEventListener('click', () => exportLocal('evodoc_feedback', 'evodoc-feedback.json'));
  }
});
