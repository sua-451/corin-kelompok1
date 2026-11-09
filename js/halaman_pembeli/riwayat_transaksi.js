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

    const riwayatList = document.getElementById("riwayatList");

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
    };

    const getRiwayat = () => JSON.parse(localStorage.getItem("corin_transactions")) || [];

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
                    <div class="empty-riwayat-icon">🧾</div>
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