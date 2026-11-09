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

    const activeProfile = JSON.parse(localStorage.getItem("corin_user_profile"));
    if (activeProfile) {
        const headerName = document.querySelector(".profile-name");
        if (headerName) headerName.innerText = activeProfile.nama;

        const headerRole = document.querySelector(".profile-role");
        if (headerRole) headerRole.innerText = activeProfile.peran;

        const headerAvatar = document.querySelector(".profile-avatar img");
        if (headerAvatar && activeProfile.gambar) headerAvatar.src = activeProfile.gambar;
    }

    const bannerGreeting = document.getElementById("bannerGreeting");
    
    let userName = "mas mas ganteng";
    if (activeProfile && activeProfile.nama) {
        userName = activeProfile.nama;
    }

    const sapaanAcak = [
        `Hai <span>${userName}</span>,<br>Hari ini mau pesan apa?`,
        `Siang <span>${userName}</span>,<br>Apakah Anda lapar?`,
        `Halo <span>${userName}</span>,<br>Yuk cek menu favoritmu!`,
        `Selamat datang <span>${userName}</span>,<br>Mau makan enak hari ini?`,
        `Pagi <span>${userName}</span>,<br>Jangan lupa sarapan ya!`,
        `Hai <span>${userName}</span>,<br>Menu baru sudah menunggumu lho.`,
        `Sore <span>${userName}</span>,<br>Waktunya ngemil santai!`,
        `Malam <span>${userName}</span>,<br>Mau pesan makanan hangat?`,
        `Kangen makanan kantin <span>${userName}</span>?<br>Yuk pesan sekarang!`,
        `<span>${userName}</span>, perut keroncongan?<br>Cek menu terbaik kami!`
    ];

    if (bannerGreeting) {
        const randomIndex = Math.floor(Math.random() * sapaanAcak.length);
        bannerGreeting.innerHTML = sapaanAcak[randomIndex];
    }

    const defaultMenus = [
        {
            id: "M001",
            nama: "Nasi Ayam Geprek",
            kantin: "Kantin Bu Tini",
            kategori: "makanan",
            deskripsi: "Ayam crispy digeprek dengan sambal bawang pedas mantap, disajikan dengan nasi hangat dan lalapan.",
            rating: 4.8,
            ulasan: 45,
            harga: 15000,
            stok: 20,
            gambar: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400&h=300"
        },
        {
            id: "M002",
            nama: "Mie Ayam Bakso",
            kantin: "Kantin Ambatukam",
            kategori: "makanan",
            deskripsi: "Mie kenyal dengan topping ayam kecap, sawi hijau, dan bakso sapi asli. Kuah gurih kaldu ayam.",
            rating: 4.6,
            ulasan: 32,
            harga: 12000,
            stok: 15,
            gambar: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400&h=300"
        },
        {
            id: "M003",
            nama: "Es Teh Manis Jumbo",
            kantin: "Kantin Ambatukam",
            kategori: "minuman",
            deskripsi: "Es teh manis dengan ukuran jumbo, menyegarkan dahaga setelah makan.",
            rating: 4.9,
            ulasan: 120,
            harga: 5000,
            stok: 50,
            gambar: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400&h=300"
        },
        {
            id: "M004",
            nama: "Sate Ayam Madura",
            kantin: "Kantin Pak Budi",
            kategori: "makanan",
            deskripsi: "Tusuk sate ayam empuk dengan bumbu kacang kental manis gurih. Isi 10 tusuk + lontong.",
            rating: 4.7,
            ulasan: 60,
            harga: 20000,
            stok: 0, 
            gambar: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400&h=300"
        }
    ];

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

    const dataVersion = "v12"; 
    if (localStorage.getItem("corin_version") !== dataVersion) {
        localStorage.setItem("corin_menus", JSON.stringify(defaultMenus));
        localStorage.setItem("corin_version", dataVersion);
    }

    const getMenus = () => JSON.parse(localStorage.getItem("corin_menus")) || [];
    const getFavorites = () => JSON.parse(localStorage.getItem("corin_favorites")) || [];
    const saveFavorites = (favs) => localStorage.setItem("corin_favorites", JSON.stringify(favs));
    const getReviews = () => JSON.parse(localStorage.getItem("corin_reviews")) || {};
    
    const menuGrid = document.getElementById("menuGrid");
    const searchInput = document.getElementById("searchInput");
    const filterUrutan = document.getElementById("filterUrutan");
    
    const pillButtons = document.querySelectorAll(".pill-btn");
    let activeKategori = "semua"; 

    pillButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            pillButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeKategori = btn.getAttribute("data-kategori");
            renderMenus();
        });
    });

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
    };

    const calculateAverageRating = (menuId, defaultRating, defaultCount) => {
        const reviews = getReviews();
        const menuReviews = reviews[menuId] || [];
        
        if (menuReviews.length === 0) {
            return { avg: defaultRating, count: defaultCount };
        }

        let total = defaultRating * defaultCount;
        menuReviews.forEach(r => total += r.rating);

        const newCount = defaultCount + menuReviews.length;
        const newAvg = (total / newCount).toFixed(1);
        
        return { avg: parseFloat(newAvg), count: newCount };
    };

    const renderMenus = () => {
        menuGrid.innerHTML = "";
        let menus = getMenus();
        let favorites = getFavorites();
        
        const keyword = searchInput.value.toLowerCase();
        const urutan = filterUrutan.value;

        menus = menus.filter(menu => {
            const safeNama = menu.nama ? menu.nama.toLowerCase() : "";
            const safeKantin = menu.kantin ? menu.kantin.toLowerCase() : "";
            const safeDesk = menu.deskripsi ? menu.deskripsi.toLowerCase() : "";
            return safeNama.includes(keyword) || safeKantin.includes(keyword) || safeDesk.includes(keyword);
        });

        if (activeKategori !== "semua") {
            menus = menus.filter(menu => menu.kategori === activeKategori);
        }

        if (urutan === "rating") {
            menus.sort((a, b) => {
                const statA = calculateAverageRating(a.id, a.rating, a.ulasan);
                const statB = calculateAverageRating(b.id, b.rating, b.ulasan);
                return statB.avg - statA.avg;
            });
        } else if (urutan === "murah") {
            menus.sort((a, b) => a.harga - b.harga);
        } else if (urutan === "mahal") {
            menus.sort((a, b) => b.harga - a.harga);
        }

        if (menus.length === 0) {
            menuGrid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray-text); font-weight: 600;">Menu tidak ditemukan.</div>`;
            return;
        }

        menus.forEach(menu => {
            const isHabis = menu.stok <= 0;
            const stockText = isHabis ? "HABIS" : `Sisa ${menu.stok}`;
            const namaKantin = menu.kantin ? menu.kantin : "Kantin Tidak Diketahui";
            const labelKategori = menu.kategori ? menu.kategori : "Menu";
            const isFavorited = favorites.includes(menu.id);
            const stats = calculateAverageRating(menu.id, menu.rating, menu.ulasan);
            
            const card = document.createElement("article");
            card.className = "menu-card";
            card.setAttribute("data-id", menu.id);
            
            card.innerHTML = `
                <button class="btn-love ${isFavorited ? 'active' : ''}" data-id="${menu.id}">❤️</button>
                <span class="badge-kategori">${labelKategori}</span>
                <img src="${menu.gambar}" alt="${menu.nama}" class="menu-img" loading="lazy">
                <div class="menu-content">
                    <h3 class="menu-name">${menu.nama}</h3>
                    <p class="menu-desc">${menu.deskripsi}</p>
                    <span class="kantin-label">${namaKantin}</span>
                    <div class="menu-rating">
                        ⭐ ${stats.avg} <span>(${stats.count} ulasan)</span>
                    </div>
                    <button class="btn-lihat-ulasan" data-id="${menu.id}">💬 Lihat Ulasan</button>
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
                if (e.target.classList.contains("btn-add-cart") || 
                    e.target.classList.contains("btn-love") || 
                    e.target.classList.contains("btn-lihat-ulasan")) return;
                openDetailModal(menu);
            });

            menuGrid.appendChild(card);
        });

        document.querySelectorAll(".btn-love").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = e.target.getAttribute("data-id");
                let favorites = getFavorites();
                
                if (favorites.includes(id)) {
                    favorites = favorites.filter(favId => favId !== id);
                    e.target.classList.remove("active");
                } else {
                    favorites.push(id);
                    e.target.classList.add("active");
                }
                saveFavorites(favorites);
            });
        });

        document.querySelectorAll(".btn-lihat-ulasan").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const menuId = e.currentTarget.getAttribute("data-id");
                const menu = getMenus().find(m => m.id === menuId);
                openUlasanModal(menu);
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

    renderMenus();

    searchInput.addEventListener("input", renderMenus);
    filterUrutan.addEventListener("change", renderMenus);

    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const modalIcon = document.getElementById("modalIcon");
    const modalBtnOk = document.getElementById("modalBtnOk");

    const showModal = (title, message, icon = "⚠️", isError = false) => {
        modalTitle.innerText = title;
        modalMessage.innerHTML = message;
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

    const openUlasanModal = (menu) => {
        const reviews = getReviews();
        const menuReviews = reviews[menu.id] || [];

        modalTitle.innerText = `Ulasan: ${menu.nama}`;
        
        let ulasanHTML = "";
        if (menuReviews.length === 0) {
            ulasanHTML = `<p style="text-align: center; font-size: 12px; color: var(--gray-text); padding: 20px 0;">Belum ada ulasan untuk menu ini.</p>`;
        } else {
            menuReviews.forEach(rev => {
                ulasanHTML += `
                    <div class="ulasan-item">
                        <img src="${rev.avatar}" class="ulasan-avatar">
                        <div class="ulasan-content">
                            <div class="ulasan-header">
                                <span class="ulasan-nama">${rev.namaUser}</span>
                                <span class="ulasan-bintang">${'⭐'.repeat(rev.rating)}</span>
                            </div>
                            <p class="ulasan-text">"${rev.komentar}"</p>
                            <span style="font-size: 9px; color: #ccc;">${rev.tanggal}</span>
                        </div>
                    </div>
                `;
            });
        }

        modalMessage.innerHTML = `
            <div class="list-ulasan-container">
                ${ulasanHTML}
            </div>
        `;
        
        modalBtnOk.innerText = "Tutup Ulasan";
        modalOverlay.classList.add("active");
    };

    const detailModalOverlay = document.getElementById("detailModalOverlay");
    const btnCloseDetailModal = document.getElementById("btnCloseDetailModal");
    const btnAddFromDetail = document.getElementById("btnAddFromDetail");
    let currentSelectedMenu = null;

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
});