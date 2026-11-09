document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelector(".btn-login");
    const backBtn = document.querySelector(".btn-back");
    const registerLink = document.querySelector(".register-link");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            alert("Membuka halaman Login...");
        });
    }

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.history.back();
        });
    }

    if (registerLink) {
        registerLink.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Membuka halaman Register...");
        });
    }
});