document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("corin_users")) {
        const demoUsers = [
            {
                id: "U001",
                email: "pembeli@corin.com",
                password: "Password123#",
                role: "Pembeli",
                nama: "MAS-MAS GANTENG ASELI PPC",
                peran: "Mahasiswa",
                gambar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150"
            },
            {
                id: "U002",
                email: "penjual@corin.com",
                password: "Password123#",
                role: "Penjual",
                nama: "IBU TINI",
                peran: "Bisnis Owner",
                gambar: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=150&h=150",
                kantin: {
                    namaKantin: "Kantin Bu Tini",
                    deskripsi: "Menyediakan masakan rumahan khas Jawa dengan bumbu rempah pilihan.",
                    lokasi: "Gedung A Lantai 1, Blok B",
                    jam: "08:00 - 17:00",
                    hari: "Senin - Jumat",
                    gambar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400&h=200"
                }
            }
        ];
        localStorage.setItem("corin_users", JSON.stringify(demoUsers));
    }

    const loginForm = document.getElementById("loginForm");
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");
    
    const btnRolePembeli = document.getElementById("btnRolePembeli");
    const btnRolePenjual = document.getElementById("btnRolePenjual");
    const roleSlider = document.getElementById("roleSlider");
    const loginTitle = document.getElementById("loginTitle");
    let selectedRole = "pembeli";

    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const modalIcon = document.getElementById("modalIcon");
    const modalBtnOk = document.getElementById("modalBtnOk");

    const notFoundModal = document.getElementById("notFoundModal");
    const btnNotFoundCancel = document.getElementById("btnNotFoundCancel");

    const playBeep = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {
            console.log("Audio playback not supported");
        }
    };

    const showModal = (title, message, icon = "⚠️", isError = false) => {
        modalTitle.innerText = title;
        modalMessage.innerText = message;
        modalIcon.innerText = icon;
        
        if (isError) {
            modalBtnOk.style.backgroundColor = "var(--red-primary)";
            modalBtnOk.style.color = "white";
        } else {
            modalBtnOk.style.backgroundColor = "var(--green-primary)";
            modalBtnOk.style.color = "var(--dark-bg)";
        }

        modalOverlay.classList.add("active");
        playBeep();
    };

    const closeModal = () => modalOverlay.classList.remove("active");
    modalBtnOk.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    const closeNotFoundModal = () => notFoundModal.classList.remove("active");
    btnNotFoundCancel.addEventListener("click", closeNotFoundModal);
    notFoundModal.addEventListener("click", (e) => {
        if (e.target === notFoundModal) closeNotFoundModal();
    });

    btnRolePembeli.addEventListener("click", () => {
        if (selectedRole === "pembeli") return;
        selectedRole = "pembeli";
        
        btnRolePembeli.classList.add("active");
        btnRolePenjual.classList.remove("active");
        roleSlider.classList.remove("right");
        
        loginTitle.innerText = "MASUK SEBAGAI PEMBELI";
    });

    btnRolePenjual.addEventListener("click", () => {
        if (selectedRole === "penjual") return;
        selectedRole = "penjual";
        
        btnRolePenjual.classList.add("active");
        btnRolePembeli.classList.remove("active");
        roleSlider.classList.add("right");
        
        loginTitle.innerText = "MASUK SEBAGAI PENJUAL";
    });

    togglePassword.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            passwordInput.type = "password";
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    });

        loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const email = document.getElementById("email").value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showModal("Peringatan", "Email dan password wajib diisi!", "⚠️", true);
            return;
        }

        const users = JSON.parse(localStorage.getItem("corin_users")) || [];
        
        // Cari user berdasarkan email DAN password
        const validUser = users.find(u => u.email === email && u.password === password);

        // 1. Jika email/password salah ATAU role tidak cocok, anggap "Tidak Ditemukan"
        if (!validUser) {
            notFoundModal.classList.add("active");
            playBeep();
            return;
        }

        if (selectedRole === "pembeli" && validUser.role !== "Pembeli") {
            notFoundModal.classList.add("active");
            playBeep();
            return;
        }

        if (selectedRole === "penjual" && validUser.role !== "Penjual") {
            notFoundModal.classList.add("active");
            playBeep();
            return;
        }

        // 2. Login Sukses
        showModal("Berhasil!", `Login ${validUser.role} Berhasil! Mengalihkan...`, "✅", false);
        
        localStorage.setItem("corin_active_session", JSON.stringify(validUser));

        const btn = document.querySelector('.btn-login');
        btn.innerText = "MEMPROSES...";
        btn.disabled = true;

        setTimeout(() => {
            if (validUser.role === "Penjual") {
                window.location.href = "../../html/halaman_penjual/dashboard.html";
            } else {
                window.location.href = "../../html/halaman_pembeli/katalog_menu.html";
            }
        }, 2000);
    });

    document.getElementById("btnBack").addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
});