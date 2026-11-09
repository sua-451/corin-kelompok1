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

    const ratingGrid = document.getElementById("ratingGrid");
    const searchInput = document.getElementById("searchInput");
    
    const reviewModalOverlay = document.getElementById("reviewModalOverlay");
    const btnCloseReviewModal = document.getElementById("btnCloseReviewModal");
    const formReview = document.getElementById("formReview");
    
    const stars = document.querySelectorAll("#starRating span");
    let selectedRating = 0;
    let selectedMenu = null;

    const getMenus = () => JSON.parse(localStorage.getItem("corin_menus")) || [];
    
    const getReviews = () => JSON.parse(localStorage.getItem("corin_reviews")) || {};
    const saveReviews = (data) => localStorage.setItem("corin_reviews", JSON.stringify(data));

    const calculateAverageRating = (menuId, defaultRating, defaultCount) => {
        const reviews = getReviews();
        const menuReviews = reviews[menuId] || [];
        
        if (menuReviews.length === 0) {
            return { avg: defaultRating, count: defaultCount };
        }

        let total = defaultRating * defaultCount; // Menggabungkan rating bawaan dengan rating baru
        menuReviews.forEach(r => total += r.rating);

        const newCount = defaultCount + menuReviews.length;
        const newAvg = (total / newCount).toFixed(1);
        
        return { avg: parseFloat(newAvg), count: newCount };
    };

    const renderMenus = (keyword = "") => {
        ratingGrid.innerHTML = "";
        let menus = getMenus();

        menus = menus.filter(menu => 
            menu.nama.toLowerCase().includes(keyword.toLowerCase()) || 
            menu.kantin.toLowerCase().includes(keyword.toLowerCase())
        );

        if (menus.length === 0) {
            ratingGrid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray-text); font-weight: 600;">Menu tidak ditemukan.</div>`;
            return;
        }

        menus.forEach(menu => {
            const namaKantin = menu.kantin ? menu.kantin : "Kantin Tidak Diketahui";
            const stats = calculateAverageRating(menu.id, menu.rating, menu.ulasan);
            
            const card = document.createElement("article");
            card.className = "menu-card";
            
            card.innerHTML = `
                <img src="${menu.gambar}" alt="${menu.nama}" class="menu-img" loading="lazy">
                <div class="menu-content">
                    <h3 class="menu-name">${menu.nama}</h3>
                    <span class="kantin-label">${namaKantin}</span>
                    <div class="menu-rating">
                        ⭐ ${stats.avg} <span>(${stats.count} ulasan)</span>
                    </div>
                    <button class="btn-beri-rating" data-id="${menu.id}">⭐ Beri Rating & Ulasan</button>
                </div>
            `;
            
            card.querySelector(".btn-beri-rating").addEventListener("click", () => openReviewModal(menu));
            ratingGrid.appendChild(card);
        });
    };

    const openReviewModal = (menu) => {
        selectedMenu = menu;
        selectedRating = 0;
        
        document.getElementById("reviewImg").src = menu.gambar;
        document.getElementById("reviewMenuName").innerText = menu.nama;
        document.getElementById("reviewKantinName").innerText = menu.kantin;
        document.getElementById("komentar").value = "";
        
        stars.forEach(star => star.classList.remove("active"));
        
        reviewModalOverlay.classList.add("active");
    };

    const closeReviewModal = () => {
        reviewModalOverlay.classList.remove("active");
        selectedMenu = null;
    };

    btnCloseReviewModal.addEventListener("click", closeReviewModal);
    reviewModalOverlay.addEventListener("click", (e) => {
        if (e.target === reviewModalOverlay) closeReviewModal();
    });

    stars.forEach(star => {
        star.addEventListener("click", (e) => {
            selectedRating = parseInt(e.target.getAttribute("data-value"));
            stars.forEach(s => {
                if (parseInt(s.getAttribute("data-value")) <= selectedRating) {
                    s.classList.add("active");
                } else {
                    s.classList.remove("active");
                }
            });
        });
    });

    formReview.addEventListener("submit", (e) => {
        e.preventDefault();
        const komentar = document.getElementById("komentar").value.trim();

        if (selectedRating === 0) {
            showModal("Peringatan", "Silakan pilih bintang rating terlebih dahulu!", "⚠️");
            return;
        }
        if (!komentar) {
            showModal("Peringatan", "Silakan isi kolom komentar!", "⚠️");
            return;
        }

        if (selectedMenu) {
            const reviews = getReviews();
            if (!reviews[selectedMenu.id]) {
                reviews[selectedMenu.id] = [];
            }

            reviews[selectedMenu.id].push({
                namaUser: "MAS-MAS GANTENG", // Bisa diganti dengan username dinamis
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100",
                rating: selectedRating,
                komentar: komentar,
                tanggal: new Date().toLocaleDateString('id-ID')
            });

            saveReviews(reviews);
            closeReviewModal();
            showModal("Berhasil!", "Terima kasih, ulasan Anda telah dikirim.", "✅");
            renderMenus(searchInput.value);
        }
    });

    searchInput.addEventListener("input", (e) => renderMenus(e.target.value));

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

    modalBtnOk.addEventListener("click", () => modalOverlay.classList.remove("active"));
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove("active");
    });

    renderMenus();
});