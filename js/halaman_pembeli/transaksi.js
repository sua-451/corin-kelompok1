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

    const transactionList = document.getElementById("transactionList");
    
    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const modalIcon = document.getElementById("modalIcon");
    const modalBtnOk = document.getElementById("modalBtnOk");

    const cancelModalOverlay = document.getElementById("cancelModalOverlay");
    const btnCancelNo = document.getElementById("btnCancelNo");
    const btnCancelYes = document.getElementById("btnCancelYes");
    
    let orderIdToCancel = null;

    const showModal = (title, message, icon = "⚠️") => {
        modalTitle.innerText = title;
        modalMessage.innerText = message;
        modalIcon.innerText = icon;
        modalOverlay.classList.add("active");
    };

    const closeModal = () => {
        modalOverlay.classList.remove("active");
    };

    const closeCancelModal = () => {
        cancelModalOverlay.classList.remove("active");
        orderIdToCancel = null;
    };

    modalBtnOk.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    btnCancelNo.addEventListener("click", closeCancelModal);
    cancelModalOverlay.addEventListener("click", (e) => {
        if (e.target === cancelModalOverlay) closeCancelModal();
    });

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
    };

    const getTransactions = () => JSON.parse(localStorage.getItem("corin_transactions")) || [];
    const saveTransactions = (data) => localStorage.setItem("corin_transactions", JSON.stringify(data));

    const getStatusClass = (status) => {
        switch(status) {
            case 'pending': return 'status-pending';
            case 'diproses': return 'status-diproses';
            case 'selesai': return 'status-selesai';
            case 'ditolak': return 'status-ditolak';
            default: return '';
        }
    };

    const renderTransactions = () => {
        transactionList.innerHTML = "";
        const transactions = getTransactions();

        if (transactions.length === 0) {
            transactionList.innerHTML = `
                <div class="empty-transaksi">
                    <div class="empty-transaksi-icon">📄</div>
                    <h3>Belum Ada Transaksi</h3>
                    <p>Anda belum melakukan pemesanan apapun.</p>
                    <a href="katalog_menu.html" class="btn-ke-katalog">Pesan Sekarang</a>
                </div>
            `;
            return;
        }

        transactions.forEach(trx => {
            let totalTrx = 0;
            
            const itemsHTML = trx.items.map(item => {
                totalTrx += (item.harga * item.qty);
                return `
                    <div class="trans-item">
                        <img src="${item.gambar}" alt="${item.nama}" class="trans-img">
                        <div class="trans-details">
                            <h4 class="trans-name">${item.nama}</h4>
                            <p class="trans-kantin">🏪 ${item.kantin}</p>
                        </div>
                        <div class="trans-qty-price">
                            <p class="trans-qty">${item.qty} x ${formatRupiah(item.harga)}</p>
                            <p class="trans-price">${formatRupiah(item.harga * item.qty)}</p>
                        </div>
                    </div>
                `;
            }).join('');

            const btnBatalHTML = trx.status === 'pending' 
                ? `<button class="btn-batal" data-id="${trx.id}">🛑 Batal Pesan</button>` 
                : '';

            const showQueue = trx.queueNumber && (trx.status === 'pending' || trx.status === 'diproses');
            const queueHTML = showQueue ? `
                <div class="queue-badge-container">
                    <span class="queue-label">NOMOR<br>ANTREAN</span>
                    <span class="queue-number">${trx.queueNumber}</span>
                </div>
            ` : '';

            const card = document.createElement("article");
            card.className = "transaction-card";
            card.innerHTML = `
                <div class="trans-header">
                    <div>
                        <span class="trans-id">${trx.id}</span><br>
                        <span class="trans-date">${trx.date}</span>
                    </div>
                    <span class="status-badge ${getStatusClass(trx.status)}">${trx.status}</span>
                </div>
                <div class="trans-body">
                    ${queueHTML}
                    ${itemsHTML}
                </div>
                <div class="trans-footer" style="flex-direction: column; align-items: flex-start; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                        <span class="trans-total-label">Total Belanja</span>
                        <span class="trans-total-price">${formatRupiah(totalTrx + 2000)}</span>
                    </div>
                    ${btnBatalHTML}
                </div>
            `;
            transactionList.appendChild(card);
        });

        document.querySelectorAll(".btn-batal").forEach(btn => {
            btn.addEventListener("click", (e) => {
                orderIdToCancel = e.currentTarget.getAttribute("data-id");
                cancelModalOverlay.classList.add("active");
            });
        });
    };

    btnCancelYes.addEventListener("click", () => {
        if (orderIdToCancel) {
            let transactions = getTransactions();
            
            transactions = transactions.filter(t => t.id !== orderIdToCancel);
            saveTransactions(transactions);

            closeCancelModal();
            renderTransactions();
            showModal("Dibatalkan", "Pesanan berhasil dibatalkan dan dihapus dari daftar.", "✅");
        }
    });

    renderTransactions();
});