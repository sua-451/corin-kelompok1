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

    const closeModal = () => {
        modalOverlay.classList.remove("active");
    };

    modalBtnOk.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const subtotalPriceEl = document.getElementById("subtotalPrice");
    const grandTotalPriceEl = document.getElementById("grandTotalPrice");
    const totalItemEl = document.getElementById("totalItem");
    const btnCheckout = document.getElementById("btnCheckout");

    const BIAYA_LAYANAN = 2000;

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
    };

    const getCart = () => JSON.parse(localStorage.getItem("corin_cart")) || [];
    const saveCart = (cart) => localStorage.setItem("corin_cart", JSON.stringify(cart));

    const renderCart = () => {
        let cart = getCart();
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Keranjang Anda Kosong</h3>
                    <p>Silakan pilih menu lezat di halaman katalog.</p>
                </div>
            `;
            subtotalPriceEl.innerText = "Rp 0";
            grandTotalPriceEl.innerText = "Rp 0";
            totalItemEl.innerText = "0";
            btnCheckout.disabled = true;
            btnCheckout.style.opacity = "0.5";
            btnCheckout.style.cursor = "not-allowed";
            return;
        }

        btnCheckout.disabled = false;
        btnCheckout.style.opacity = "1";
        btnCheckout.style.cursor = "pointer";

        let subtotal = 0;
        let totalQty = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.harga * item.qty;
            subtotal += itemTotal;
            totalQty += item.qty;

            const cartItemDiv = document.createElement("div");
            cartItemDiv.className = "cart-item";
            cartItemDiv.innerHTML = `
                <img src="${item.gambar}" alt="${item.nama}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.nama}</h4>
                    <p class="cart-item-kantin">🏪 ${item.kantin}</p>
                    <p class="cart-item-price">${formatRupiah(item.harga)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="qty-control">
                        <button class="btn-qty btn-minus" data-index="${index}">-</button>
                        <input type="text" class="qty-input" value="${item.qty}" readonly>
                        <button class="btn-qty btn-plus" data-index="${index}">+</button>
                    </div>
                    <button class="btn-remove" data-index="${index}">🗑️ Hapus</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });

        subtotalPriceEl.innerText = formatRupiah(subtotal);
        const grandTotal = subtotal + (totalQty > 0 ? BIAYA_LAYANAN : 0);
        grandTotalPriceEl.innerText = formatRupiah(grandTotal);
        totalItemEl.innerText = totalQty;

        document.querySelectorAll(".btn-plus").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                cart[index].qty += 1;
                saveCart(cart);
                renderCart();
            });
        });

        document.querySelectorAll(".btn-minus").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                if (cart[index].qty > 1) {
                    cart[index].qty -= 1;
                } else {
                    cart.splice(index, 1);
                }
                saveCart(cart);
                renderCart();
            });
        });

        document.querySelectorAll(".btn-remove").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.closest(".btn-remove").getAttribute("data-index");
                cart.splice(index, 1);
                saveCart(cart);
                renderCart();
            });
        });
    };

    renderCart();

            btnCheckout.addEventListener("click", () => {
        const cart = getCart();
        
        if (cart.length > 0) {
            const now = new Date();
            
            const dateStr = now.toLocaleString('id-ID', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            }).replace('.', ':');

            const trxId = "TRX-" + now.getTime();

            let allTransactions = JSON.parse(localStorage.getItem("corin_transactions")) || [];
            
            const todayStr = now.toLocaleDateString('id-ID');
            const todayTrx = allTransactions.filter(t => {
                return t.rawDate === todayStr; 
            });
            
            const queueNumber = todayTrx.length + 1;

            let newOrder = {
                id: trxId,
                date: dateStr,
                rawDate: todayStr,
                queueNumber: queueNumber,
                status: "pending",
                items: cart
            };
            
            allTransactions.unshift(newOrder); 
            localStorage.setItem("corin_transactions", JSON.stringify(allTransactions));
            
            localStorage.removeItem("corin_cart");
            
            showModal("Pesanan Dibuat!", `Nomor Antrean Anda: ${queueNumber}\nMohon tunggu konfirmasi kantin.`, "✅");
            
            setTimeout(() => {
                window.location.href = "transaksi.html";
            }, 2500);
        }
    });
});