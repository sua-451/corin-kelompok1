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

    const riwayatList = document.getElementById("riwayatList");

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
    };

    const getRiwayat = () => {
        const session = JSON.parse(localStorage.getItem("corin_active_session"));
        const userId = session ? session.id : "GUEST";
        const storageKey = "corin_transactions_" + userId;
        return JSON.parse(localStorage.getItem(storageKey)) || [];
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

    const renderRiwayat = () => {
        riwayatList.innerHTML = "";
        const transactions = getRiwayat();

        if (transactions.length === 0) {
            riwayatList.innerHTML = `
                <div class="empty-riwayat">
                    <div class="empty-riwayat-icon">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#8D9499" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <h3>Belum Ada Riwayat Transaksi</h3>
                    <p>Anda belum pernah menyelesaikan pesanan apapun.</p>
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
                    <div class="riwayat-item">
                        <img src="${item.gambar}" alt="${item.nama}" class="riwayat-img">
                        <div class="riwayat-details">
                            <h4 class="riwayat-name">${item.nama}</h4>
                            <p class="riwayat-kantin">🏪 ${item.kantin}</p>
                        </div>
                        <div class="riwayat-qty-price">
                            <p class="riwayat-qty">${item.qty} x ${formatRupiah(item.harga)}</p>
                            <p class="riwayat-price">${formatRupiah(item.harga * item.qty)}</p>
                        </div>
                    </div>
                `;
            }).join('');

            const card = document.createElement("article");
            card.className = "riwayat-card";
            card.innerHTML = `
                <div class="riwayat-header">
                    <div>
                        <span class="riwayat-id">${trx.id}</span><br>
                        <span class="riwayat-date">${trx.date}</span>
                    </div>
                    <span class="status-badge ${getStatusClass(trx.status)}">${trx.status}</span>
                </div>
                <div class="riwayat-body">
                    ${itemsHTML}
                </div>
                <div class="riwayat-footer">
                    <span class="riwayat-total-label">Total Belanja</span>
                    <span class="riwayat-total-price">${formatRupiah(totalTrx + 2000)}</span>
                </div>
            `;
            riwayatList.appendChild(card);
        });
    };

    renderRiwayat();
});