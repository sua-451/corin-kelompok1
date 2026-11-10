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
        document.getElementById("hdrNama").innerText = activeSession.nama;
        document.getElementById("hdrPeran").innerText = activeSession.peran;
        if (activeSession.gambar) {
            document.getElementById("hdrFoto").src = activeSession.gambar;
        }

        if (activeSession.role === "Penjual" && activeSession.kantin) {
            const kantinBanner = document.getElementById("kantinBanner");
            kantinBanner.style.display = "flex";
            
            document.getElementById("bannerImg").src = activeSession.kantin.gambar;
            document.getElementById("bannerNamaKantin").innerText = activeSession.kantin.namaKantin;
            document.getElementById("bannerDeskripsi").innerText = activeSession.kantin.deskripsi;
            document.getElementById("bannerLokasiText").innerText = activeSession.kantin.lokasi;
            document.getElementById("bannerJamText").innerText = `${activeSession.kantin.hari}, ${activeSession.kantin.jam}`;
        }
    }

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
    };

    const getTransactions = () => JSON.parse(localStorage.getItem("corin_transactions")) || [];
    const getMenus = () => JSON.parse(localStorage.getItem("corin_menus")) || [];

    const transactions = getTransactions();
    const menus = getMenus();

    let totalOmset = 0;
    let pesananSelesai = 0;
    let pesananPending = 0;

    transactions.forEach(trx => {
        let trxTotal = 0;
        trx.items.forEach(item => trxTotal += (item.harga * item.qty));
        
        if (trx.status === "selesai") {
            totalOmset += trxTotal;
            pesananSelesai++;
        } else if (trx.status === "pending") {
            pesananPending++;
        }
    });

    document.getElementById("statOmset").innerText = formatRupiah(totalOmset);
    document.getElementById("statSelesai").innerText = pesananSelesai;
    document.getElementById("statPending").innerText = pesananPending;
    document.getElementById("statMenu").innerText = menus.length;

    const recentOrdersBody = document.getElementById("recentOrdersBody");
    const recentTrx = transactions.slice(0, 5);

    if (recentTrx.length === 0) {
        recentOrdersBody.innerHTML = `<tr><td colspan="3" style="text-align: center;">Belum ada pesanan.</td></tr>`;
    } else {
        recentTrx.forEach(trx => {
            let total = 0;
            trx.items.forEach(item => total += (item.harga * item.qty));
            
            const badgeClass = trx.status === "selesai" ? "badge-selesai" : "badge-pending";
            
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${trx.id.split('-')[1] || trx.id}</td>
                <td>${formatRupiah(total + 2000)}</td>
                <td><span class="badge ${badgeClass}">${trx.status.toUpperCase()}</span></td>
            `;
            recentOrdersBody.appendChild(row);
        });
    }

    const statCards = document.querySelectorAll(".stat-card");
    const infoModal = document.getElementById("infoModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const btnCloseModal = document.getElementById("btnCloseModal");

    statCards.forEach(card => {
        card.addEventListener("click", () => {
            const info = card.getAttribute("data-info");
            const label = card.querySelector(".stat-label").innerText;
            
            modalTitle.innerText = label;
            modalMessage.innerText = info;
            infoModal.classList.add("active");
        });
    });

    btnCloseModal.addEventListener("click", () => infoModal.classList.remove("active"));
    infoModal.addEventListener("click", (e) => {
        if (e.target === infoModal) infoModal.classList.remove("active");
    });

    const canvas = document.getElementById("salesChart");
    const ctx = canvas.getContext("2d");
    const tooltip = document.getElementById("chartTooltip");

    let currentFilter = "hari";
    let chartData = [];
    let chartLabels = [];
    let points = [];

    const generateData = (filter) => {
        points = [];
        if (filter === "hari") {
            chartData = [50000, 120000, 80000, 150000, 200000, 250000, 180000];
            chartLabels = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
        } else if (filter === "minggu") {
            chartData = [150000, 220000, 180000, 300000, 250000, 400000, 350000];
            chartLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
        } else if (filter === "bulan") {
            chartData = [1200000, 1500000, 1800000, 1100000];
            chartLabels = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"];
        } else if (filter === "tahun") {
            chartData = [5000000, 6500000, 7000000, 8000000, 7500000, 9000000, 8500000, 9500000, 8800000, 10000000, 11000000, 12000000];
            chartLabels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
        }
    };

    const drawChart = () => {
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;

        ctx.clearRect(0, 0, width, height);

        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        const maxVal = Math.max(...chartData);
        const stepX = chartWidth / (chartData.length - 1);

        ctx.strokeStyle = "#E2E2E2";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
        gradient.addColorStop(0, "rgba(158, 204, 59, 0.4)");
        gradient.addColorStop(1, "rgba(158, 204, 59, 0.0)");

        ctx.beginPath();
        chartData.forEach((val, i) => {
            const x = padding + (i * stepX);
            const y = height - padding - ((val / maxVal) * chartHeight);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.lineTo(width - padding, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = "#9ECC3B";
        ctx.lineWidth = 3;
        ctx.beginPath();
        chartData.forEach((val, i) => {
            const x = padding + (i * stepX);
            const y = height - padding - ((val / maxVal) * chartHeight);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        chartData.forEach((val, i) => {
            const x = padding + (i * stepX);
            const y = height - padding - ((val / maxVal) * chartHeight);

            points.push({ x, y, value: val, label: chartLabels[i] });

            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#2B2D31";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#8D9499";
            ctx.font = "10px Poppins";
            ctx.textAlign = "center";
            ctx.fillText(chartLabels[i], x, height - 15);
        });
    };

    generateData(currentFilter);
    drawChart();

    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let hoveredPoint = null;

        points.forEach(p => {
            const dist = Math.sqrt(Math.pow(mouseX - p.x, 2) + Math.pow(mouseY - p.y, 2));
            if (dist < 20) hoveredPoint = p;
        });

        if (hoveredPoint) {
            tooltip.classList.add("show");
            tooltip.style.left = `${hoveredPoint.x}px`;
            tooltip.style.top = `${hoveredPoint.y}px`;
            tooltip.innerText = `${hoveredPoint.label}: ${formatRupiah(hoveredPoint.value)}`;
        } else {
            tooltip.classList.remove("show");
        }
    });

    canvas.addEventListener("mouseleave", () => tooltip.classList.remove("show"));

    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterBtns.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            currentFilter = e.target.getAttribute("data-filter");
            generateData(currentFilter);
            drawChart();
            tooltip.classList.remove("show");
        });
    });

    const pieCanvas = document.getElementById("pieChart");
    const pieCtx = pieCanvas.getContext("2d");
    const pieTooltip = document.getElementById("pieTooltip");

    const pieData = [
        { label: "Makanan", value: 65, color: "#9ECC3B" },
        { label: "Minuman", value: 35, color: "#2B2D31" }
    ];

    const drawPieChart = () => {
        const width = pieCanvas.width = pieCanvas.offsetWidth;
        const height = pieCanvas.height = pieCanvas.offsetHeight;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 10;

        let startAngle = 0;
        pieCtx.clearRect(0, 0, width, height);

        pieData.forEach(slice => {
            const sliceAngle = (slice.value / 100) * 2 * Math.PI;
            
            pieCtx.beginPath();
            pieCtx.moveTo(centerX, centerY);
            pieCtx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            pieCtx.closePath();
            
            pieCtx.fillStyle = slice.color;
            pieCtx.fill();
            pieCtx.strokeStyle = "#2B2D31";
            pieCtx.lineWidth = 2;
            pieCtx.stroke();

            startAngle += sliceAngle;
        });
    };

    drawPieChart();

    pieCanvas.addEventListener("mousemove", (e) => {
        const rect = pieCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const centerX = pieCanvas.width / 2;
        const centerY = pieCanvas.height / 2;
        const radius = Math.min(pieCanvas.width, pieCanvas.height) / 2 - 10;

        const distFromCenter = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));

        if (distFromCenter <= radius) {
            const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
            const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
            
            const angleFood = (65 / 100) * 2 * Math.PI;
            
            let hoveredSlice = null;
            if (normalizedAngle < angleFood) {
                hoveredSlice = pieData[0];
            } else {
                hoveredSlice = pieData[1];
            }

            pieTooltip.classList.add("show");
            pieTooltip.style.left = `${mouseX + 20}px`;
            pieTooltip.style.top = `${mouseY - 20}px`;
            pieTooltip.innerText = `${hoveredSlice.label}: ${hoveredSlice.value}%`;
        } else {
            pieTooltip.classList.remove("show");
        }
    });

    pieCanvas.addEventListener("mouseleave", () => pieTooltip.classList.remove("show"));

    window.addEventListener("resize", () => {
        drawChart();
        drawPieChart();
    });
});