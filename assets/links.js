/* Concept D v4: toast, copy-link buttons and placeholder links. Deep links are handled by modal.js. */
(function () {
  'use strict';
  var AB = window.AB, BASE = 'https://arjunbhadra.com/#';
  var toast = document.getElementById('toast'), toastT = null;
  AB.say = function (msg) {
    if (!toast) return;
    toast.textContent = msg; toast.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('on'); }, 2200);
  };
  document.addEventListener('click', function (e) {
    var todo = e.target.closest('a[data-todo]');
    if (todo) { e.preventDefault(); AB.say(todo.dataset.todo); return; }
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    var url = BASE + b.dataset.copy;
    var fallback = function () {
      var f = b.parentNode.querySelector('.copy-field');
      if (!f) { f = document.createElement('input'); f.type = 'text'; f.readOnly = true; f.className = 'copy-field'; f.setAttribute('aria-label', 'Link to this project'); b.parentNode.appendChild(f); }
      f.value = url; f.focus(); f.select(); AB.say('Copy the link from the field');
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { AB.say('Link copied'); }, fallback);
      else fallback();
    } catch (err) { fallback(); }
  });
})();
