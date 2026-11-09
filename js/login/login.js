document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");
    
    const btnRolePembeli = document.getElementById("btnRolePembeli");
    const btnRolePenjual = document.getElementById("btnRolePenjual");
    const roleSlider = document.getElementById("roleSlider");
    const loginTitle = document.getElementById("loginTitle");
    let selectedRole = "pembeli";

    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toastMsg");
    let toastTimeout;

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

    const showToast = (msg, type = "error") => {
        clearTimeout(toastTimeout);
        toastMsg.innerText = msg;
        
        if (type === "success") {
            toast.classList.add("success");
        } else {
            toast.classList.remove("success");
        }

        toast.classList.add("show");
        playBeep();
        
        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 3500);
    };

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
            showToast("Email dan password wajib diisi!");
            return;
        }

        if (password.length < 8) {
            showToast("Password minimal 8 karakter!");
            return;
        }

        showToast(`Login ${selectedRole === "pembeli" ? "Pembeli" : "Penjual"} Berhasil! Mengalihkan...`, "success");
        
        const btn = document.querySelector('.btn-login');
        btn.innerText = "MEMPROSES...";
        btn.disabled = true;

        setTimeout(() => {
            if (selectedRole === "penjual") {
                window.location.href = "../halaman_penjual/dashboard.html"; 
            } else {
                window.location.href = "../halaman_pembeli/katalog_menu.html"; 
            }
        }, 2000);
    });
});