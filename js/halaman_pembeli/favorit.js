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

    const favoritGrid = document.getElementById("favoritGrid");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const modalIcon = document.getElementById("modalIcon");
    const modalBtnOk = document.getElementById("modalBtnOk");

    const detailModalOverlay = document.getElementById("detailModalOverlay");
    const btnCloseDetailModal = document.getElementById("btnCloseDetailModal");
    const btnAddFromDetail = document.getElementById("btnAddFromDetail");
    
    let currentSelectedMenu = null;

    const getMenus = () => JSON.parse(localStorage.getItem("corin_menus")) || [];
    const getFavorites = () => JSON.parse(localStorage.getItem("corin_favorites")) || [];
    const saveFavorites = (favs) => localStorage.setItem("corin_favorites", JSON.stringify(favs));

    const kantinData = {
        "Kantin Bu Tini": {
            pemilik: "Ibu Tini (Bisnis Owner)",
            lokasi: "Gedung A Lantai 1, Blok B",
            jam: "08:00 - 17:00",
            hari: "Senin - Jumat"
        },
        "Kantin Ambatukam": {
            pemilik: "Bapak Ambatukam (Bisnis Owner)",
            lokasi: "Gedung B Lantai 2, Blok C",
            jam: "09:00 - 20:00",
            hari: "Setiap Hari"
        },
        "Kantin Pak Budi": {
            pemilik: "Pak Budi (Bisnis Owner)",
            lokasi: "Gedung C Lantai 1, Dekat Lift",
            jam: "07:00 - 15:00",
            hari: "Senin - Sabtu"
        }
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
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
    };

    const closeModal = () => {
        modalOverlay.classList.remove("active");
    };

    modalBtnOk.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    const renderFavorit = () => {
        favoritGrid.innerHTML = "";
        const allMenus = getMenus();
        const favoriteIds = getFavorites();
        
        const favoriteMenus = allMenus.filter(menu => favoriteIds.includes(menu.id));

        if (favoriteMenus.length === 0) {
            favoritGrid.innerHTML = `
                <div class="empty-favorit">
                    <div class="empty-favorit-icon">💔</div>
                    <h3>Belum ada menu favorit</h3>
                    <p>Silakan jelajahi katalog dan tekan tombol ❤️ pada menu yang Anda sukai.</p>
                </div>
            `;
            return;
        }

        favoriteMenus.forEach(menu => {
            const isHabis = menu.stok <= 0;
            const stockText = isHabis ? "HABIS" : `Sisa ${menu.stok}`;
            const namaKantin = menu.kantin ? menu.kantin : "Kantin Tidak Diketahui";
            const labelKategori = menu.kategori ? menu.kategori : "Menu";
            
            const card = document.createElement("article");
            card.className = "menu-card";
            card.setAttribute("data-id", menu.id);
            
            card.innerHTML = `
                <button class="btn-love active" data-id="${menu.id}">❤️</button>
                <span class="badge-kategori">${labelKategori}</span>
                <img src="${menu.gambar}" alt="${menu.nama}" class="menu-img" loading="lazy">
                <div class="menu-content">
                    <h3 class="menu-name">${menu.nama}</h3>
                    <p class="menu-desc">${menu.deskripsi}</p>
                    <span class="kantin-label">${namaKantin}</span>
                    <div class="menu-rating">
                        ⭐ ${menu.rating} <span>(${menu.ulasan} ulasan)</span>
                    </div>
                    <div class="menu-bottom">
                        <span class="menu-price">${formatRupiah(menu.harga)}</span>
                        <span class="menu-stock" style="${isHabis ? 'background-color: var(--red-primary); color: white; border-color: var(--dark-bg);' : ''}">${stockText}</span>
                    </div>
                    <button class="btn-add-cart ${isHabis ? 'disabled' : ''}" data-id="${menu.id}" data-nama="${menu.nama}" ${isHabis ? 'disabled' : ''}>
                        ${isHabis ? 'Stok Habis' : '+ Keranjang'}
                    </button>
                </div>
            `;
            
            card.addEventListener("click", (e) => {
                if (e.target.classList.contains("btn-add-cart") || e.target.classList.contains("btn-love")) return;
                openDetailModal(menu);
            });

            favoritGrid.appendChild(card);
        });

        document.querySelectorAll(".btn-love").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = e.target.getAttribute("data-id");
                let favorites = getFavorites();
                favorites = favorites.filter(favId => favId !== id);
                saveFavorites(favorites);
                renderFavorit();
            });
        });

        const addButtons = document.querySelectorAll(".btn-add-cart:not(.disabled)");
        addButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const menuId = e.currentTarget.getAttribute("data-id");
                const menuData = getMenus().find(m => m.id === menuId);
                
                if (menuData) {
                    let cart = JSON.parse(localStorage.getItem("corin_cart")) || [];
                    const existingItem = cart.find(item => item.id === menuId);
                    
                    if (existingItem) {
                        existingItem.qty += 1;
                    } else {
                        cart.push({ ...menuData, qty: 1 }); 
                    }
                    
                    localStorage.setItem("corin_cart", JSON.stringify(cart));
                    showModal("Berhasil!", `"${menuData.nama}" telah ditambahkan ke keranjang belanja Anda.`, "✅");
                }
            });
        });
    };

    const openDetailModal = (menu) => {
        currentSelectedMenu = menu;
        
        document.getElementById("detailImg").src = menu.gambar;
        document.getElementById("detailMenuName").innerText = menu.nama;
        document.getElementById("detailKantinName").innerText = menu.kantin;
        
        const labelKategori = menu.kategori ? menu.kategori : "Menu";
        document.getElementById("detailKategori").innerText = labelKategori;
        
        document.getElementById("detailRating").innerText = menu.rating;
        document.getElementById("detailReviews").innerText = `(${menu.ulasan} ulasan)`;
        document.getElementById("detailDesc").innerText = menu.deskripsi;
        document.getElementById("detailPrice").innerText = formatRupiah(menu.harga);
        
        const isHabis = menu.stok <= 0;
        const stockEl = document.getElementById("detailStock");
        stockEl.innerText = isHabis ? "HABIS" : `Sisa ${menu.stok}`;
        stockEl.style.backgroundColor = isHabis ? "var(--red-primary)" : "var(--gray-input)";
        stockEl.style.color = isHabis ? "white" : "var(--dark-bg)";

        if (isHabis) {
            btnAddFromDetail.disabled = true;
            btnAddFromDetail.style.opacity = "0.5";
            btnAddFromDetail.style.cursor = "not-allowed";
            btnAddFromDetail.innerText = "Stok Habis";
        } else {
            btnAddFromDetail.disabled = false;
            btnAddFromDetail.style.opacity = "1";
            btnAddFromDetail.style.cursor = "pointer";
            btnAddFromDetail.innerText = "+ Keranjang";
        }

        const infoKantin = kantinData[menu.kantin];
        if (infoKantin) {
            document.getElementById("detailOwner").innerText = infoKantin.pemilik;
            document.getElementById("detailLocation").innerText = infoKantin.lokasi;
            document.getElementById("detailHours").innerText = infoKantin.jam;
            document.getElementById("detailDays").innerText = infoKantin.hari;
        } else {
            document.getElementById("detailOwner").innerText = "Tidak diketahui";
            document.getElementById("detailLocation").innerText = "-";
            document.getElementById("detailHours").innerText = "-";
            document.getElementById("detailDays").innerText = "-";
        }

        detailModalOverlay.classList.add("active");
    };

    const closeDetailModal = () => {
        detailModalOverlay.classList.remove("active");
    };

    btnCloseDetailModal.addEventListener("click", closeDetailModal);
    detailModalOverlay.addEventListener("click", (e) => {
        if (e.target === detailModalOverlay) {
            closeDetailModal();
        }
    });

    btnAddFromDetail.addEventListener("click", () => {
        if (currentSelectedMenu) {
            let cart = JSON.parse(localStorage.getItem("corin_cart")) || [];
            const existingItem = cart.find(item => item.id === currentSelectedMenu.id);
            
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ ...currentSelectedMenu, qty: 1 }); 
            }
            
            localStorage.setItem("corin_cart", JSON.stringify(cart));
            showModal("Berhasil!", `"${currentSelectedMenu.nama}" telah ditambahkan ke keranjang belanja Anda.`, "✅");
            closeDetailModal();
        }
    });

    renderFavorit();
});