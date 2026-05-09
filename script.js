/* ===================================================
   KidsPlay Sports Club - script.js
   Interaksi: alert, validasi form, navigasi, filter
=================================================== */

'use strict';

// =========================================================
// 1. MOBILE NAV HAMBURGER
// =========================================================
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.nav-mobile');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Tutup saat klik link
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// =========================================================
// 2. ACTIVE NAV LINK (highlight halaman aktif)
// =========================================================
function setActiveNav() {
  const links = document.querySelectorAll('.nav-links a, .nav-mobile a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
setActiveNav();

// =========================================================
// 3. TOAST NOTIFICATION SYSTEM
// =========================================================
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);

  // Auto remove setelah 4 detik
  setTimeout(() => toast.remove(), 4000);
}

// =========================================================
// 4. MODAL / DIALOG SYSTEM
// =========================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modal saat klik backdrop
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal(backdrop.id);
    }
  });
});

// Close buttons
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    const modalBackdrop = btn.closest('.modal-backdrop');
    if (modalBackdrop) closeModal(modalBackdrop.id);
  });
});

// ESC key closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => {
      closeModal(m.id);
    });
  }
});

// Expose globally
window.openModal = openModal;
window.closeModal = closeModal;

// =========================================================
// 5. FORM VALIDASI - PENDAFTARAN
// =========================================================
const registrationForm = document.getElementById('registration-form');

if (registrationForm) {
  // Helper: tampilkan error pada field
  function showFieldError(field, message) {
    field.classList.add('error');
    let errMsg = field.parentElement.querySelector('.form-error-msg');
    if (!errMsg) {
      errMsg = document.createElement('span');
      errMsg.className = 'form-error-msg';
      field.parentElement.appendChild(errMsg);
    }
    errMsg.textContent = message;
    errMsg.classList.add('visible');
  }

  // Helper: hapus error dari field
  function clearFieldError(field) {
    field.classList.remove('error');
    const errMsg = field.parentElement.querySelector('.form-error-msg');
    if (errMsg) errMsg.classList.remove('visible');
  }

  // Real-time validasi saat user mengetik
  registrationForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => clearFieldError(field));
    field.addEventListener('blur',  () => validateField(field));
  });

  // Validasi satu field
  function validateField(field) {
    const val = field.value.trim();
    const name = field.name;

    if (field.hasAttribute('required') && !val) {
      showFieldError(field, 'Field ini wajib diisi.');
      return false;
    }

    if (name === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        showFieldError(field, 'Format email tidak valid. Contoh: nama@email.com');
        return false;
      }
    }

    if (name === 'phone' && val) {
      const phoneRegex = /^(\+62|08)[0-9]{8,12}$/;
      if (!phoneRegex.test(val)) {
        showFieldError(field, 'Format nomor HP tidak valid. Contoh: 0812345678');
        return false;
      }
    }

    if (name === 'child_age' && val) {
      const age = parseInt(val);
      if (isNaN(age) || age < 4 || age > 17) {
        showFieldError(field, 'Usia anak harus antara 4 - 17 tahun.');
        return false;
      }
    }

    if (name === 'child_name' && val) {
      if (val.length < 3) {
        showFieldError(field, 'Nama anak minimal 3 karakter.');
        return false;
      }
      if (!/^[a-zA-Z\s'-]+$/.test(val)) {
        showFieldError(field, 'Nama hanya boleh berisi huruf dan spasi.');
        return false;
      }
    }

    clearFieldError(field);
    return true;
  }

  // Update progress bar
  function updateProgress() {
    const fields = registrationForm.querySelectorAll('input[required], select[required]');
    const filled  = Array.from(fields).filter(f => f.value.trim() !== '').length;
    const pct     = Math.round((filled / fields.length) * 100);
    const bar     = document.querySelector('.progress-fill');
    if (bar) bar.style.width = pct + '%';
  }

  registrationForm.querySelectorAll('input, select').forEach(f => {
    f.addEventListener('input', updateProgress);
    f.addEventListener('change', updateProgress);
  });

  // Submit handler
  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = registrationForm.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid  = true;

    fields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      // Alert interaktif untuk error validasi
      alert('⚠️ Harap lengkapi semua field yang wajib diisi dengan benar sebelum mendaftar.');
      showToast('Ada field yang belum diisi dengan benar!', 'error');

      // Scroll ke error pertama
      const firstError = registrationForm.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Simulasi pengiriman form
    const submitBtn = registrationForm.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Mendaftar...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      // Alert sukses
      alert('🎉 Pendaftaran berhasil!\n\nTerima kasih telah mendaftarkan putra/putri Anda ke KidsPlay Sports Club.\n\nTim kami akan menghubungi Anda dalam 1-2 hari kerja untuk konfirmasi jadwal.');

      showToast('Pendaftaran berhasil! Kami akan segera menghubungi Anda.', 'success');
      registrationForm.reset();
      updateProgress();

      // Buka modal sukses jika ada
      if (document.getElementById('success-modal')) {
        openModal('success-modal');
      }
    }, 1800);
  });
}

// =========================================================
// 6. JADWAL FILTER BUTTONS
// =========================================================
const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
const scheduleRows = document.querySelectorAll('[data-sport]');

if (filterBtns.length && scheduleRows.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      scheduleRows.forEach(row => {
        if (filter === 'all' || row.dataset.sport === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });

      const filterNames = { all: 'Semua Olahraga', soccer: 'Sepak Bola', basket: 'Bola Basket', tennis: 'Tenis', swim: 'Renang' };
      showToast(`Menampilkan: ${filterNames[filter] || filter}`, 'info');
    });
  });
}

// =========================================================
// 7. PROGRAM CARD "DAFTAR" BUTTON (quick enroll alert)
// =========================================================
document.querySelectorAll('.btn-enroll').forEach(btn => {
  btn.addEventListener('click', () => {
    const program = btn.dataset.program || 'program ini';
    const confirm = window.confirm(`🏅 Daftar ke "${program}"?\n\nAnda akan diarahkan ke halaman pendaftaran.`);
    if (confirm) {
      window.location.href = 'kontak.html';
    }
  });
});

// =========================================================
// 8. SMOOTH SCROLL untuk anchor links
// =========================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const headerOffset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// =========================================================
// 9. SCROLL ANIMATION (IntersectionObserver)
// =========================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.program-card, .gallery-item, .contact-item, .sport-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Saat elemen masuk viewport → tampilkan
const visibilityStyle = document.createElement('style');
visibilityStyle.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(visibilityStyle);

// =========================================================
// 10. NEWSLETTER SUBSCRIBE (form sederhana di footer)
// =========================================================
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('📧 Masukkan alamat email yang valid untuk berlangganan newsletter.');
      return;
    }

    alert(`✅ Terima kasih!\n\nEmail "${email}" berhasil didaftarkan untuk newsletter KidsPlay Sports Club.`);
    showToast('Berhasil berlangganan newsletter!', 'success');
    newsletterForm.reset();
  });
}

// =========================================================
// 11. GALLERY LIGHTBOX (klik gambar tampilkan modal)
// =========================================================
document.querySelectorAll('.gallery-item').forEach(item => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    const label  = item.querySelector('.gallery-overlay span')?.textContent || 'Galeri Kegiatan';
    const emoji  = item.querySelector('.gallery-emoji-bg')?.textContent?.trim() || '🏅';

    // Buat mini lightbox
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop open';
    backdrop.innerHTML = `
      <div class="modal" style="text-align:center; max-width:360px;">
        <div class="modal-header">
          <h3>${label}</h3>
          <button class="modal-close" onclick="this.closest('.modal-backdrop').remove(); document.body.style.overflow=''">✕</button>
        </div>
        <div style="font-size:120px; padding: 24px 0;">${emoji}</div>
        <p style="color:var(--on-surface-variant); font-size:14px; margin-bottom:20px;">Momen seru kegiatan KidsPlay Sports Club</p>
        <button class="btn btn-primary" style="width:100%" onclick="this.closest('.modal-backdrop').remove(); document.body.style.overflow=''">Tutup</button>
      </div>`;
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.remove();
        document.body.style.overflow = '';
      }
    });
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
  });
});

// =========================================================
// INIT LOG
// =========================================================
console.log('%c🏅 KidsPlay Sports Club', 'color:#0050cb;font-size:18px;font-weight:bold;');
console.log('%cScript loaded. Selamat bermain! ⚽🏀🎾🏊', 'color:#fb7800;font-size:13px;');
