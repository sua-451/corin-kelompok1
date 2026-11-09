document.addEventListener("DOMContentLoaded", () => {
    const btnMenuToggle = document.getElementById("btnMenuToggle");
    const btnCloseSidebar = document.getElementById("btnCloseSidebar");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const toggleSidebar = () => {
        sidebar.classList.toggle("open");
        sidebarOverlay.classList.toggle("active");
    };

    btnMenuToggle.addEventListener("click", toggleSidebar);
    btnCloseSidebar.addEventListener("click", toggleSidebar);
    sidebarOverlay.addEventListener("click", toggleSidebar);

    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const modalIcon = document.getElementById("modalIcon");
    const modalBtnOk = document.getElementById("modalBtnOk");

    const showModal = (title, message, icon = "⚠️") => {
        modalTitle.innerText = title;
        modalMessage.innerText = message;
        modalIcon.innerText = icon;
        modalOverlay.classList.add("active");
    };

    const closeModal = () => modalOverlay.classList.remove("active");
    modalBtnOk.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    const uploadBox = document.getElementById("uploadBox");
    const fileInput = document.getElementById("fileInput");
    const imgPreview = document.getElementById("imgPreview");
    const uploadPlaceholder = document.getElementById("uploadPlaceholder");
    let profileImageURL = "";

    const getProfile = () => JSON.parse(localStorage.getItem("corin_user_profile")) || {
        nama: "MAS-MAS GANTENG ASELI PPC",
        peran: "Mahasiswa",
        noHp: "08123456789",
        email: "user@gmail.com",
        password: "Password123#",
        gambar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150"
    };
    const saveProfile = (data) => localStorage.setItem("corin_user_profile", JSON.stringify(data));

    const updateHeader = () => {
        const profile = getProfile();
        
        const headerName = document.querySelector(".profile-name");
        if (headerName) headerName.innerText = profile.nama;

        const headerRole = document.querySelector(".profile-role");
        if (headerRole) headerRole.innerText = profile.peran;

        const headerAvatar = document.querySelector(".profile-avatar img");
        if (headerAvatar && profile.gambar) headerAvatar.src = profile.gambar;
    };

    const loadProfileData = () => {
        const profile = getProfile();
        
        document.getElementById("nama").value = profile.nama;
        document.getElementById("peran").value = profile.peran;
        document.getElementById("noHp").value = profile.noHp;
        document.getElementById("email").value = profile.email;

        if (profile.gambar && profile.gambar !== "") {
            profileImageURL = profile.gambar;
            imgPreview.src = profileImageURL;
            imgPreview.style.display = "block";
            uploadPlaceholder.style.display = "none";
        }
        
        updateHeader();
    };

    loadProfileData();

    uploadBox.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showModal("Peringatan", "Ukuran foto maksimal 2MB!", "⚠️");
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

    document.getElementById("formDataDiri").addEventListener("submit", (e) => {
        e.preventDefault();
        
        const profile = getProfile();
        
        profile.nama = document.getElementById("nama").value.trim();
        profile.peran = document.getElementById("peran").value;
        profile.noHp = document.getElementById("noHp").value.trim();
        profile.email = document.getElementById("email").value.trim();
        
        if (profileImageURL) {
            profile.gambar = profileImageURL;
        }

        saveProfile(profile);
        updateHeader();
        
        showModal("Berhasil!", "Data diri Anda berhasil diperbarui.", "✅");
    });

    const passwordInput = document.getElementById("newPassword");
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

    document.getElementById("formUbahPassword").addEventListener("submit", (e) => {
        e.preventDefault();

        const oldPass = document.getElementById("oldPassword").value;
        const newPass = document.getElementById("newPassword").value;
        const confirmPass = document.getElementById("confirmNewPassword").value;

        const profile = getProfile();

        if (oldPass !== profile.password) {
            showModal("Gagal!", "Password lama yang Anda masukkan salah.", "⚠️");
            return;
        }

        const hasNumber = /[0-9]/.test(newPass);
        const hasUpper = /[a-z]/.test(newPass) && /[A-Z]/.test(newPass);
        const hasSymbol = /[^A-Za-z0-9]/.test(newPass);
        const hasLength = newPass.length >= 8;

        if (!hasNumber || !hasUpper || !hasSymbol || !hasLength) {
            showModal("Gagal!", "Password baru belum memenuhi semua ketentuan.", "⚠️");
            return;
        }

        if (newPass !== confirmPass) {
            showModal("Gagal!", "Konfirmasi password baru tidak cocok.", "⚠️");
            return;
        }

        profile.password = newPass;
        saveProfile(profile);

        document.getElementById("formUbahPassword").reset();
        passwordInput.dispatchEvent(new Event('input'));

        showModal("Berhasil!", "Password Anda telah berhasil diubah.", "✅");
    });
});