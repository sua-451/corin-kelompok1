document.addEventListener("DOMContentLoaded", () => {
    let currentStep = 1;
    const totalSteps = 5;
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

    const uploadBoxKantin = document.getElementById("uploadBoxKantin");
    const fileInputKantin = document.getElementById("fileInputKantin");
    const imgPreviewKantin = document.getElementById("imgPreviewKantin");
    const uploadPlaceholderKantin = document.getElementById("uploadPlaceholderKantin");
    let imageKantinURL = "";

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

    uploadBoxKantin.addEventListener("click", () => {
        fileInputKantin.click();
    });

    fileInputKantin.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showToast("Ukuran foto maksimal 2MB!");
                fileInputKantin.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                imageKantinURL = e.target.result;
                imgPreviewKantin.src = imageKantinURL;
                imgPreviewKantin.style.display = "block";
                uploadPlaceholderKantin.style.display = "none";
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
        for (let i = 1; i <= 4; i++) {
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
        
        if (step === 5) {
            document.querySelector(".stepper").style.display = "none";
        } else {
            document.querySelector(".stepper").style.display = "flex";
            updateStepper();
        }

        const hdrProfile = document.getElementById("headerProfileBadge");
        const btnBack = document.getElementById("btnBack");

        if (step === 4 || step === 5) {
            hdrProfile.style.display = "flex";
            btnBack.style.display = "none";

            if(step === 4) {
                document.getElementById("hdrNama").innerText = document.getElementById("nama").value;
                document.getElementById("hdrPeran").innerText = document.getElementById("peranPenjual").value;
                document.getElementById("hdrFoto").src = profileImageURL || "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";
            }
        } else {
            hdrProfile.style.display = "none";
            btnBack.style.display = "flex";
        }

        if (step === 3) {
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
        const peran = document.getElementById("peranPenjual").value;
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

        document.getElementById("valProfileImg").src = profileImageURL || "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";
        document.getElementById("valProfileImg").style.display = "block";
        document.getElementById("valProfileSvg").style.display = "none";

        goToStep(2);
    });

    document.getElementById("btnNext2").addEventListener("click", () => {
        const namaKantin = document.getElementById("namaKantin").value.trim();
        const lokasi = document.getElementById("lokasiKantin").value.trim();
        const jamBuka = document.getElementById("jamBuka").value;
        const jamTutup = document.getElementById("jamTutup").value;
        const hari = document.getElementById("hariOperasional").value;
        const deskripsi = document.getElementById("deskripsiKantin").value.trim();

        if (!namaKantin || !lokasi || !jamBuka || !jamTutup || !hari || !deskripsi) {
            showToast("Semua data kantin wajib diisi!");
            return;
        }

        if (!imageKantinURL) {
            showToast("Silakan upload foto kantin Anda!");
            return;
        }

        document.getElementById("valNamaKantin").innerText = namaKantin;
        document.getElementById("valHari").innerText = hari;
        document.getElementById("valLokasi").innerText = lokasi;
        document.getElementById("valJam").innerText = `${jamBuka} - ${jamTutup}`;

        document.getElementById("valImgKantin").src = imageKantinURL;
        document.getElementById("valImgKantin").style.display = "block";

        goToStep(3);
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

    document.getElementById("btnNext3").addEventListener("click", () => {
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

        goToStep(4);
    });

    document.getElementById("tabDiriBtn").addEventListener("click", () => {
        document.getElementById("tabDiriBtn").classList.add("active");
        document.getElementById("tabKantinBtn").classList.remove("active");
        document.getElementById("tabDiri").classList.add("active");
        document.getElementById("tabKantin").classList.remove("active");
        
        document.getElementById("profileWrapperDiri").style.display = "flex";
        document.getElementById("profileWrapperKantin").style.display = "none";
    });

    document.getElementById("tabKantinBtn").addEventListener("click", () => {
        document.getElementById("tabKantinBtn").classList.add("active");
        document.getElementById("tabDiriBtn").classList.remove("active");
        document.getElementById("tabKantin").classList.add("active");
        document.getElementById("tabDiri").classList.remove("active");
        
        document.getElementById("profileWrapperDiri").style.display = "none";
        document.getElementById("profileWrapperKantin").style.display = "flex";
    });

    document.getElementById("btnFinish").addEventListener("click", () => {
        const profileData = {
            nama: document.getElementById("nama").value.trim(),
            peran: document.getElementById("peranPenjual").value,
            noHp: document.getElementById("noHp").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: passwordInput.value,
            gambar: profileImageURL || ""
        };
        localStorage.setItem("corin_user_profile", JSON.stringify(profileData));
        
        const kantinData = {
            namaKantin: document.getElementById("namaKantin").value.trim(),
            lokasi: document.getElementById("lokasiKantin").value.trim(),
            jamBuka: document.getElementById("jamBuka").value,
            jamTutup: document.getElementById("jamTutup").value,
            hari: document.getElementById("hariOperasional").value,
            deskripsi: document.getElementById("deskripsiKantin").value.trim(),
            gambar: imageKantinURL
        };
        localStorage.setItem("corin_kantin_profile", JSON.stringify(kantinData));
        
        goToStep(5);
    });

    const btnFinishRegister = document.getElementById("btnFinishRegister");
    if (btnFinishRegister) {
        btnFinishRegister.addEventListener("click", () => {
            window.location.href = "../penjual/dashboard.html";
        });
    }

    document.getElementById("btnBack").addEventListener("click", () => {
        if (currentStep > 1 && currentStep < 5) {
            goToStep(currentStep - 1);
        } else if (currentStep === 1) {
            window.history.back();
        }
    });
});