// src/utils/validation.js

export const validateEmailAndPassword = (email, password) => {
    // Validasi email tidak boleh kosong dan memiliki format yang benar
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) {
      return { valid: false, error: 'Email tidak boleh kosong' };
    }
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Format email tidak valid' };
    }
  
    // Validasi password tidak boleh kosong dan harus memenuhi kriteria
    if (!password || !password.trim()) {
      return { valid: false, error: 'Password tidak boleh kosong' };
    }
    if (password.length < 8) {
      return { valid: false, error: 'Password harus memiliki minimal 8 karakter' };
    }
    // Memastikan password mengandung huruf besar dan angka
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      return { valid: false, error: 'Password harus mengandung setidaknya satu huruf besar dan satu angka' };
    }
  
    return { valid: true };
  };
  