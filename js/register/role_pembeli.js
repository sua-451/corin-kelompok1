document.addEventListener("DOMContentLoaded", () => {
    let currentStep = 1;
    const totalSteps = 4;
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    let globalOTP = "";

    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toastMsg");
    let toastTimeout;

    const uploadBox = document.getElementById("uploadBox");
    const fileInput = document.getElementById("fileInput");
    const imgPreview = document.getElementById("imgPreview");
    const uploadPlaceholder = document.getElementById("uploadPlaceholder");
    let profileImageURL = "";

    uploadBox.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showToast("Ukuran foto maksimal 2MB!");
                fileInput.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImageURL = e.target.result;
                imgPreview.src = profileImageURL;
                imgPreview.style.display = "block";
                uploadPlaceholder.style.display = "none";
            };
            reader.readAsDataURL(file);
        }
    });

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
        }, 5000);
    };

    const updateStepper = () => {
        for (let i = 1; i <= 3; i++) {
            const ind = document.getElementById(`step${i}Ind`);
            if (ind) {
                ind.classList.remove("active", "completed");
                
                if (i < currentStep) {
                    ind.classList.add("completed");
                    ind.querySelector(".step-circle").innerHTML = "✓";
                } else if (i === currentStep) {
                    ind.classList.add("active");
                    ind.querySelector(".step-circle").innerHTML = i;
                } else {
                    ind.querySelector(".step-circle").innerHTML = i;
                }
            }
        }
    };

    const goToStep = (step) => {
        document.querySelectorAll(".step-content").forEach(el => el.classList.remove("active"));
        document.getElementById(`step${step}`).classList.add("active");
        currentStep = step;
        
        if (step === 4) {
            document.querySelector(".stepper").style.display = "none";
        } else {
            document.querySelector(".stepper").style.display = "flex";
            updateStepper();
        }

        const hdrProfile = document.getElementById("headerProfileBadge");
        const btnBack = document.getElementById("btnBack");

        if (step === 3 || step === 4) {
            hdrProfile.style.display = "flex";
            btnBack.style.display = "none";

            if(step === 3) {
                document.getElementById("hdrNama").innerText = document.getElementById("nama").value;
                document.getElementById("hdrPeran").innerText = document.getElementById("peranPembeli").value;
                document.getElementById("hdrFoto").src = profileImageURL || "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";
            }
        } else {
            hdrProfile.style.display = "none";
            btnBack.style.display = "flex";
        }

        if (step === 2) {
            globalOTP = Math.floor(100000 + Math.random() * 900000).toString();
            showToast(`[DEMO OTP] Kode OTP Anda adalah: ${globalOTP}`, "success");
            
            const rawHp = document.getElementById("noHp").value.trim();
            const rawEmail = document.getElementById("email").value.trim();
            
            document.getElementById("otpTargetHp").innerText = rawHp;
            document.getElementById("otpTargetEmail").innerText = rawEmail;
        }
    };

    const reqNumber = document.getElementById("req-number");
    const reqUpper = document.getElementById("req-upper");
    const reqSymbol = document.getElementById("req-symbol");
    const reqLength = document.getElementById("req-length");

    passwordInput.addEventListener("input", () => {
        const val = passwordInput.value;
        
        const isValidNumber = /[0-9]/.test(val);
        const isValidUpper = /[a-z]/.test(val) && /[A-Z]/.test(val);
        const isValidSymbol = /[^A-Za-z0-9]/.test(val);
        const isValidLength = val.length >= 8;

        const toggleClass = (el, isValid) => {
            if (isValid) {
                el.classList.add("valid");
                el.querySelector(".icon").innerHTML = "✓";
            } else {
                el.classList.remove("valid");
                el.querySelector(".icon").innerHTML = "○";
            }
        };

        toggleClass(reqNumber, isValidNumber);
        toggleClass(reqUpper, isValidUpper);
        toggleClass(reqSymbol, isValidSymbol);
        toggleClass(reqLength, isValidLength);
    });

    document.getElementById("btnNext1").addEventListener("click", () => {
        const nama = document.getElementById("nama").value.trim();
        const hp = document.getElementById("noHp").value.trim();
        const email = document.getElementById("email").value.trim();
        const peran = document.getElementById("peranPembeli").value;
        const pass = passwordInput.value;
        const confirmPass = confirmPasswordInput.value;

        if (!nama || !hp || !email || !peran || !pass || !confirmPass) {
            showToast("Semua data wajib diisi!");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            showToast("Format email tidak valid!");
            return;
        }

        const hasNumber = /[0-9]/.test(pass);
        const hasUpper = /[a-z]/.test(pass) && /[A-Z]/.test(pass);
        const hasSymbol = /[^A-Za-z0-9]/.test(pass);
        const hasLength = pass.length >= 8;

        if (!hasNumber || !hasUpper || !hasSymbol || !hasLength) {
            showToast("Password belum memenuhi semua ketentuan!");
            return;
        }

        if (pass !== confirmPass) {
            showToast("Konfirmasi password tidak cocok!");
            return;
        }

        document.getElementById("valNama").innerText = nama;
        document.getElementById("valHp").innerText = hp;
        document.getElementById("valEmail").innerText = email;
        document.getElementById("valPeran").innerText = peran;
        document.getElementById("valRole").innerText = "Pembeli";

        document.getElementById("valProfileImg").src = profileImageURL || "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";
        document.getElementById("valProfileImg").style.display = "block";
        document.getElementById("valProfileSvg").style.display = "none";

        goToStep(2);
    });

    window.moveToNext = (current, index) => {
        if (current.value.length === 1 && index < 6) {
            const nextInput = document.querySelectorAll(".otp-box")[index];
            if (nextInput) nextInput.focus();
        }
    };

    let timeLeft = 59;
    let timerInterval;
    
    const startTimer = () => {
        clearInterval(timerInterval);
        timeLeft = 59;
        document.getElementById("otpTimer").innerText = "00:59";
        
        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                document.getElementById("otpTimer").innerText = "00:00";
                return;
            }
            timeLeft--;
            const sec = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
            document.getElementById("otpTimer").innerText = `00:${sec}`;
        }, 1000);
    };

    document.getElementById("resendOtp").addEventListener("click", (e) => {
        e.preventDefault();
        startTimer();
        globalOTP = Math.floor(100000 + Math.random() * 900000).toString();
        showToast(`[DEMO OTP] Kode OTP Baru: ${globalOTP}`, "success");
    });

    document.getElementById("btnNext2").addEventListener("click", () => {
        const otpBoxes = document.querySelectorAll(".otp-box");
        let otpCode = "";
        otpBoxes.forEach(box => otpCode += box.value);

        if (otpCode.length < 6) {
            showToast("Masukkan 6 digit kode OTP!");
            return;
        }

        if (otpCode !== globalOTP) {
            showToast("Kode OTP salah! Periksa kembali.");
            return;
        }

        goToStep(3);
    });

    document.getElementById("btnFinish").addEventListener("click", () => {
        const profileData = {
            nama: document.getElementById("nama").value.trim(),
            peran: document.getElementById("peranPembeli").value,
            noHp: document.getElementById("noHp").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: passwordInput.value,
            gambar: profileImageURL || "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
        };
        localStorage.setItem("corin_user_profile", JSON.stringify(profileData));
        
        goToStep(4);
    });

    const btnFinishRegister = document.getElementById("btnFinishRegister");
    if (btnFinishRegister) {
        btnFinishRegister.addEventListener("click", () => {
            window.location.href = "../pembeli/katalog_menu.html";
        });
    }

    document.getElementById("btnBack").addEventListener("click", () => {
        if (currentStep > 1 && currentStep < 4) {
            goToStep(currentStep - 1);
        } else if (currentStep === 1) {
            window.history.back();
        }
    });
});