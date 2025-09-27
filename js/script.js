// script.js
document.addEventListener('DOMContentLoaded', function () {
  // set year in footer
  const y = new Date().getFullYear();
  const yearEls = document.querySelectorAll('#year, #year2');
  yearEls.forEach(e => e.textContent = y);

  // greeting logic: use localStorage to store name once prompted
  const greetingEl = document.getElementById('greeting');
  const storedName = localStorage.getItem('visitorName');
  if (greetingEl) {
    if (storedName) {
      greetingEl.textContent = `Hai ${storedName}, Welcome To Website`;
    } else {
      // ask once for the name; if user cancels, keep generic greeting
      const name = prompt('Masukkan nama Anda (untuk menampilkan ucapan di beranda):', '');
      if (name && name.trim().length > 0) {
        localStorage.setItem('visitorName', name.trim());
        greetingEl.textContent = `Hai ${name.trim()}, Welcome To Website`;
      } else {
        greetingEl.textContent = `Hai, Welcome To Website`;
      }
    }
  }

  // Contact form validation + preview
  const form = document.getElementById('contactForm');
  const previewBox = document.getElementById('previewBox');
  const errorsEl = document.getElementById('formErrors');

  function validateEmail(email) {
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validatePhone(phone) {
    // allow + and digits, min 6 digits
    return /^[+\d][\d\s-]{5,}$/.test(phone);
  }

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      errorsEl.textContent = '';
      previewBox.innerHTML = '';

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const message = form.message.value.trim();

      const errors = [];
      if (!name) errors.push('Nama wajib diisi.');
      if (!email) errors.push('Email wajib diisi.');
      else if (!validateEmail(email)) errors.push('Format email tidak valid.');
      if (!phone) errors.push('Nomor telepon wajib diisi.');
      else if (!validatePhone(phone)) errors.push('Format nomor telepon tidak valid.');
      if (!message) errors.push('Pesan wajib diisi.');
      else if (message.length < 10) errors.push('Pesan terlalu singkat (min 10 karakter).');

      if (errors.length) {
        // show errors
        errorsEl.innerHTML = errors.map(e => `<div>• ${e}</div>`).join('');
        // focus the first invalid field
        if (!name) form.name.focus();
        else if (!email || !validateEmail(email)) form.email.focus();
        else if (!phone || !validatePhone(phone)) form.phone.focus();
        else form.message.focus();
        return;
      }

      // if valid: show preview
      const now = new Date();
      const html = `
        <div><strong>Waktu Pengiriman:</strong> ${now.toLocaleString()}</div>
        <hr/>
        <div><strong>Nama:</strong> ${escapeHtml(name)}</div>
        <div><strong>Email:</strong> ${escapeHtml(email)}</div>
        <div><strong>Telepon:</strong> ${escapeHtml(phone)}</div>
        <div style="margin-top:8px;"><strong>Pesan:</strong><div style="margin-top:6px;padding:8px;background:#fff;border-radius:6px;border:1px solid #eee">${escapeHtml(message)}</div></div>
      `;
      previewBox.innerHTML = html;

      // Optionally clear form or keep values; here we keep values
      errorsEl.textContent = '';

      // also store name for greeting across pages
      localStorage.setItem('visitorName', name);
      // update greeting on page if exists
      if (greetingEl) greetingEl.textContent = `Hai ${name}, Welcome To Website`;
    });
  }

  // small helper to escape HTML
  function escapeHtml(str) {
    return str.replace(/[&<>"'`=\/]/g, function (s) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      })[s];
    });
  }
});
