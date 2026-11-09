document.addEventListener("DOMContentLoaded", () => {
    const activeProfile = JSON.parse(localStorage.getItem("corin_user_profile"));
    if (activeProfile) {
        const headerName = document.querySelector(".profile-name");
        if (headerName) headerName.innerText = activeProfile.nama;

        const headerRole = document.querySelector(".profile-role");
        if (headerRole) headerRole.innerText = activeProfile.peran;

        const headerAvatar = document.querySelector(".profile-avatar img");
        if (headerAvatar && activeProfile.gambar) headerAvatar.src = activeProfile.gambar;
    }
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

    const kantinList = document.getElementById("kantinList");
    const formKomplain = document.getElementById("formKomplain");
    const kantinNameDisplay = document.getElementById("kantinNameDisplay");
    const selectedKantinId = document.getElementById("selectedKantinId");
    const isiKomplain = document.getElementById("isiKomplain");
    
    const riwayatSayaList = document.getElementById("riwayatSayaList");
    const riwayatPublikList = document.getElementById("riwayatPublikList");

    const tabSayaBtn = document.getElementById("tabSayaBtn");
    const tabPublikBtn = document.getElementById("tabPublikBtn");
    const tabSaya = document.getElementById("tabSaya");
    const tabPublik = document.getElementById("tabPublik");

    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const modalIcon = document.getElementById("modalIcon");
    const modalBtnOk = document.getElementById("modalBtnOk");

    let komplainIdToDelete = null;

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

    tabSayaBtn.addEventListener("click", () => {
        tabSayaBtn.classList.add("active");
        tabPublikBtn.classList.remove("active");
        tabSaya.classList.add("active");
        tabPublik.classList.remove("active");
    });

    tabPublikBtn.addEventListener("click", () => {
        tabPublikBtn.classList.add("active");
        tabSayaBtn.classList.remove("active");
        tabPublik.classList.add("active");
        tabSaya.classList.remove("active");
    });

    const kantinData = [
        {
            id: "K001",
            nama: "Kantin Bu Tini",
            gambar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200&h=200",
            pemilik: "Ibu Tini",
            lokasi: "Gedung A Lantai 1, Blok B",
            jam: "08:00 - 17:00",
            hari: "Senin - Jumat"
        },
        {
            id: "K002",
            nama: "Kantin Ambatukam",
            gambar: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=200&h=200",
            pemilik: "Bapak Ambatukam",
            lokasi: "Gedung B Lantai 2, Blok C",
            jam: "09:00 - 20:00",
            hari: "Setiap Hari"
        },
        {
            id: "K003",
            nama: "Kantin Pak Budi",
            gambar: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=200&h=200",
            pemilik: "Pak Budi",
            lokasi: "Gedung C Lantai 1, Dekat Lift",
            jam: "07:00 - 15:00",
            hari: "Senin - Sabtu"
        }
    ];

    const dummyKomplainLain = [
        {
            id: "KMP-DUMMY-1",
            userId: "user-lain-1",
            namaUser: "Budi Santoso",
            avatarUser: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100",
            namaKantin: "Kantin Ambatukam",
            pesan: "Porsinya sedikit banget kemarin, padahal harganya lumayan. Tolong dievaluasi ya.",
            tanggal: "12 Nov 2026",
            status: "selesai",
            feedback: "Mohon maaf atas ketidaknyamanannya. Kami akan menambah porsi untuk pesanan selanjutnya. Terima kasih!"
        },
        {
            id: "KMP-DUMMY-2",
            userId: "user-lain-2",
            namaUser: "Siti Aminah",
            avatarUser: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
            namaKantin: "Kantin Bu Tini",
            pesan: "Sambalnya terlalu pedas, saya sampai keringetan. Lain kali tolong bisa request level pedas.",
            tanggal: "10 Nov 2026",
            status: "selesai",
            feedback: "Siap Kak Siti, ke depannya bisa request level pedas kok. Terima kasih masukannya!"
        }
    ];

    if (!localStorage.getItem("corin_komplains")) {
        localStorage.setItem("corin_komplains", JSON.stringify(dummyKomplainLain));
    }

    const getKomplains = () => JSON.parse(localStorage.getItem("corin_komplains")) || [];
    const saveKomplains = (data) => localStorage.setItem("corin_komplains", JSON.stringify(data));

    const CURRENT_USER_ID = "PB2612332101";

    const renderKantin = () => {
        kantinList.innerHTML = "";
        kantinData.forEach(kantin => {
            const card = document.createElement("div");
            card.className = "kantin-card";
            card.setAttribute("data-id", kantin.id);
            card.setAttribute("data-nama", kantin.nama);
            
            card.innerHTML = `
                <div class="kantin-card-header">
                    <img src="${kantin.gambar}" alt="${kantin.nama}" class="kantin-logo">
                    <div class="kantin-info">
                        <h4>${kantin.nama}</h4>
                        <p>👤 ${kantin.pemilik}</p>
                    </div>
                </div>
                <div class="kantin-meta">
                    <span>📍 ${kantin.lokasi}</span>
                    <span>🕒 ${kantin.hari}, ${kantin.jam}</span>
                </div>
            `;

            card.addEventListener("click", () => {
                document.querySelectorAll(".kantin-card").forEach(c => c.classList.remove("active"));
                card.classList.add("active");
                
                selectedKantinId.value = kantin.id;
                kantinNameDisplay.value = kantin.nama;
            });

            kantinList.appendChild(card);
        });
    };

    const renderRiwayat = () => {
        const komplains = getKomplains();
        
        const komplainSaya = komplains.filter(k => k.userId === CURRENT_USER_ID);
        const komplainPublik = komplains.filter(k => k.userId !== CURRENT_USER_ID);

        riwayatSayaList.innerHTML = "";
        if (komplainSaya.length === 0) {
            riwayatSayaList.innerHTML = `<div class="empty-komplain">Anda belum pernah mengirim komplain.</div>`;
        } else {
            komplainSaya.forEach(komplain => {
                riwayatSayaList.appendChild(createKomplainCard(komplain, false));
            });
        }

        riwayatPublikList.innerHTML = "";
        if (komplainPublik.length === 0) {
            riwayatPublikList.innerHTML = `<div class="empty-komplain">Belum ada komplain dari pengguna lain.</div>`;
        } else {
            komplainPublik.forEach(komplain => {
                riwayatPublikList.appendChild(createKomplainCard(komplain, true));
            });
        }
    };

    const createKomplainCard = (komplain, isPublic) => {
        const isSelesai = komplain.status === "selesai";
        const statusClass = isSelesai ? "status-selesai" : "status-pending";
        const statusText = isSelesai ? "DIBALAS PENJUAL" : "MENUNGGU BALASAN";

        const card = document.createElement("div");
        card.className = "riwayat-item";
        
        let userHeaderHTML = "";
        if (isPublic) {
            userHeaderHTML = `
                <div class="publik-user">
                    <img src="${komplain.avatarUser}" class="publik-avatar">
                    <span class="publik-name">${komplain.namaUser}</span>
                </div>
            `;
        }

        let btnHapusHTML = "";
        if (!isPublic) {
            btnHapusHTML = `<button class="btn-hapus" data-id="${komplain.id}">🗑️ Hapus Komplain</button>`;
        }

        card.innerHTML = `
            ${userHeaderHTML}
            <div class="riwayat-header">
                <span class="riwayat-kantin">${komplain.namaKantin}</span>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="riwayat-text">
                "${komplain.pesan}"
            </div>
            ${isSelesai ? `
            <div class="feedback-box">
                <p class="feedback-label">BALASAN PENJUAL:</p>
                <p class="feedback-text">"${komplain.feedback}"</p>
            </div>
            ` : ''}
            ${btnHapusHTML}
        `;

        if (!isPublic) {
            const btn = card.querySelector(".btn-hapus");
            if (btn) {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    komplainIdToDelete = e.target.getAttribute("data-id");
                    document.getElementById("confirmDeleteModal").classList.add("active");
                });
            }
        }

        return card;
    };

    formKomplain.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const kantinId = selectedKantinId.value;
        const namaKantin = kantinNameDisplay.value;
        const pesan = isiKomplain.value.trim();

        if (!kantinId || !pesan) {
            showModal("Peringatan", "Silakan pilih kantin dan tuliskan isi komplain Anda!", "⚠️");
            return;
        }

        const newKomplain = {
            id: "KMP-" + Date.now(),
            userId: CURRENT_USER_ID,
            namaUser: "MAS-MAS GANTENG",
            avatarUser: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100",
            namaKantin: namaKantin,
            pesan: pesan,
            tanggal: new Date().toLocaleDateString('id-ID'),
            status: "pending",
            feedback: ""
        };

        const komplains = getKomplains();
        komplains.unshift(newKomplain);
        saveKomplains(komplains);

        formKomplain.reset();
        selectedKantinId.value = "";
        kantinNameDisplay.value = "";
        document.querySelectorAll(".kantin-card").forEach(c => c.classList.remove("active"));

        showModal("Berhasil!", "Komplain Anda telah dikirim. Penjual akan segera memberikan balasan.", "✅");
        
        tabSayaBtn.click();
        renderRiwayat();
    });

    window.simulatePenjualBalas = function() {
        let komplains = getKomplains();
        let updated = false;
        
        komplains.forEach(k => {
            if (k.status === "pending") {
                k.status = "selesai";
                k.feedback = "Mohon maaf atas ketidaknyamanannya. Kami akan segera memperbaikinya. Terima kasih atas masukannya!";
                updated = true;
            }
        });

        if (updated) {
            saveKomplains(komplains);
            renderRiwayat();
            alert("Simulasi: Penjual telah membalas semua komplain pending!");
        } else {
            alert("Tidak ada komplain pending untuk dibalas.");
        }
    };

    const confirmDeleteModal = document.createElement("div");
    confirmDeleteModal.id = "confirmDeleteModal";
    confirmDeleteModal.className = "modal-overlay";
    confirmDeleteModal.innerHTML = `
        <div class="modal-box">
            <div class="modal-icon">🛑</div>
            <h3 class="modal-title">Hapus Komplain?</h3>
            <p class="modal-message">Apakah Anda yakin ingin menghapus komplain ini? Tindakan ini tidak dapat dikembalikan.</p>
            <div class="modal-actions modal-actions-split">
                <button class="btn-modal-secondary" id="btnCancelDelete">Batal</button>
                <button class="btn-modal-primary" id="btnConfirmDelete" style="background-color: var(--red-primary); color: white;">Ya, Hapus</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmDeleteModal);

    const btnCancelDelete = document.getElementById("btnCancelDelete");
    const btnConfirmDelete = document.getElementById("btnConfirmDelete");

    btnCancelDelete.addEventListener("click", () => {
        confirmDeleteModal.classList.remove("active");
        komplainIdToDelete = null;
    });

    btnConfirmDelete.addEventListener("click", () => {
        if (komplainIdToDelete) {
            let komplains = getKomplains();
            komplains = komplains.filter(k => k.id !== komplainIdToDelete);
            saveKomplains(komplains);
            
            confirmDeleteModal.classList.remove("active");
            komplainIdToDelete = null;
            
            showModal("Dihapus!", "Komplain Anda telah berhasil dihapus.", "✅");
            renderRiwayat();
        }
    });

    confirmDeleteModal.addEventListener("click", (e) => {
        if (e.target === confirmDeleteModal) {
            confirmDeleteModal.classList.remove("active");
            komplainIdToDelete = null;
        }
    });

    renderKantin();
    renderRiwayat();
});