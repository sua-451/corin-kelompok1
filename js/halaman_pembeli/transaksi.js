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

    const activeSession = JSON.parse(localStorage.getItem("corin_active_session"));
    if (activeSession) {
        const headerName = document.querySelector(".profile-name");
        if (headerName) headerName.innerText = activeSession.nama;

        const headerRole = document.querySelector(".profile-role");
        if (headerRole) headerRole.innerText = activeSession.peran;

        const headerAvatar = document.querySelector(".profile-avatar img");
        if (headerAvatar && activeSession.gambar) headerAvatar.src = activeSession.gambar;
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

    const getTransactions = () => {
        const session = JSON.parse(localStorage.getItem("corin_active_session"));
        const userId = session ? session.id : "GUEST";
        const storageKey = "corin_transactions_" + userId;
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    };

    const saveTransactions = (data) => {
        const session = JSON.parse(localStorage.getItem("corin_active_session"));
        const userId = session ? session.id : "GUEST";
        const storageKey = "corin_transactions_" + userId;
        localStorage.setItem(storageKey, JSON.stringify(data));
    };

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
                    <div class="empty-transaksi-icon">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#8D9499" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
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
                ? `<button class="btn-batal" data-id="${trx.id}">Batalkan Pesanan</button>` 
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