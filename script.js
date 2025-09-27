console.log("✅ script.js berhasil dimuat");

// ✅ Fungsi toggle menu mobile
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");
  const isOpen = !menu.classList.contains("translate-x-full");

  if (isOpen) {
    menu.classList.add("translate-x-full");
    if (overlay) overlay.classList.add("hidden");
  } else {
    menu.classList.remove("translate-x-full");
    if (overlay) overlay.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // ✅ Redirect tombol BELI / JUAL
  const actionButtons = document.querySelectorAll("button[data-action]");
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;    // beli / jual
      const exchange = btn.dataset.exchange;
      const token = btn.dataset.token;
      const pair = btn.dataset.pair;
      const network = btn.dataset.network;

      // Build query param dinamis
      const params = new URLSearchParams();
      if (action) params.set("action", action);
      if (exchange) params.set("exchange", exchange);
      if (token) params.set("token", token);
      if (pair) params.set("pair", pair);
      if (network) params.set("network", network);

      const targetUrl = `${action}.html?${params.toString()}`;
      console.log(`➡️ ${action} | ${exchange || "-"} | ${token || "-"} | ${pair || "-"} | ${network || "-"}`);
      window.location.href = targetUrl;
    });
  });

  // ✅ Tambahin teks info di halaman form
  const params = new URLSearchParams(window.location.search);
  const action = params.get("action");
  const exchange = params.get("exchange");
  const token = params.get("token");
  const pair = params.get("pair");

  const formHeader = document.getElementById("formHeader");
  if (formHeader) {
    if (action && pair) {
      formHeader.textContent = `Kamu sedang ${action} ${pair}`;
    } else if (action && token && exchange) {
      formHeader.textContent = `Kamu sedang ${action} ${token} di ${exchange}`;
    }
  }

  // ✅ Form Pembelian
  const form = document.getElementById("form-beli");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const jumlah = form.jumlah.value;
      const jaringan = form.jaringan.value;
      const wallet = form.alamat.value;

      const text = `🚀 *PERMINTAAN PEMBELIAN*\n\n📊 Pair: ${pair || token}\n💰 Jumlah: ${jumlah}\n🔗 Jaringan: ${jaringan}\n👛 Wallet: ${wallet}`;
      kirimKeTelegram(text, form);
    });
  }

  // ✅ Form Penjualan
  const formJual = document.getElementById("form-jual");
  if (formJual) {
    formJual.addEventListener("submit", function (e) {
      e.preventDefault();
      const jumlah = formJual.jumlah.value;
      const jaringan = formJual.jaringan.value;
      const bank = formJual.bank.value;
      const norek = formJual.norek.value;
      const nama = formJual.nama.value;

      const text = `📤 *PERMINTAAN PENJUALAN*\n\n📊 Pair: ${pair || token}\n💸 Jumlah: ${jumlah}\n🔗 Jaringan: ${jaringan}\n🏦 Bank: ${bank}\n#️⃣ Rek: ${norek}\n👤 Nama: ${nama}`;
      kirimKeTelegram(text, formJual);
    });
  }
});



// ✅ Handle ganti teks header (khusus di halaman beli/jual)
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const action = params.get("action");   // beli / jual
  const exchange = params.get("exchange"); // contoh: INDODAX
  const token = params.get("token");     // contoh: USDT

  const headerIcon = document.getElementById("headerIcon");
  const headerText = document.getElementById("headerText");
  const headerDesc = document.getElementById("headerDesc");

  if (action && exchange && token) {
    // Judul utama
    headerText.textContent = 
      `${action === "beli" ? "Convert ke " + token : "Tukar " + token + " ke Rupiah"} (${exchange})`;

    // Deskripsi
headerDesc.textContent =
  action === "beli"
    ? `Kamu akan membeli ${token} melalui ${exchange}. 
Silakan masukkan UID ${exchange} kamu dengan benar, karena token akan langsung dikirim ke akun tersebut setelah pembayaran Rupiah berhasil.`
    : `Kamu akan menjual ${token} melalui ${exchange}. 
Silakan transfer ${token} ke UID TukerCrypto yang tertera, dan pastikan nomor rekening bank kamu benar untuk menerima pencairan Rupiah.`;
    
// Icon sesuai action
headerIcon.textContent = action === "beli" ? "📥🔑" : "📤🏦";
  } 
  
  else if (action && token) {
    headerText.textContent = 
      action === "beli" ? `Convert ke ${token}` : `Tukar ${token}`;
    headerDesc.textContent = 
      action === "beli"
        ? `Konversi saldo Rupiah kamu menjadi ${token}.`
        : `Tukar ${token} kamu menjadi Rupiah.`;
    headerIcon.textContent = action === "beli" ? "🔄💸" : "💱💰";
  } 
  
  else if (action) {
    headerText.textContent = action === "beli" ? "Convert Aset" : "Tukar Aset";
    headerDesc.textContent = `Isi formulir berikut untuk melakukan proses ${action}.`;
    headerIcon.textContent = action === "beli" ? "🔄" : "💱";
  } 
  
  else {
    headerText.textContent = "Form Transaksi";
    headerDesc.textContent = "Silakan isi data tukar/convert aset dengan benar.";
    headerIcon.textContent = "💰";
  }
});



// ✅ Fungsi kirim ke Telegram
function kirimKeTelegram(text, formElement) {
  const token = "TOKEN_BOT";
  const chat_id = "CHAT_ID";

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chat_id,
      text: text,
      parse_mode: "Markdown",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.ok) {
        alert("✅ Data berhasil dikirim!");
        formElement.reset();
      } else {
        alert("❌ Gagal mengirim ke Telegram.");
      }
    })
    .catch((err) => alert("Error: " + err.message));
}

// ✅ Loader hide
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});

// ✅ Popup Join
document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("joinPopup");
  const content = document.querySelector(".popup-content");
  const closeBtn = document.getElementById("closePopup");
  const dontShowBtn = document.getElementById("dontShowAgain");

  if (popup && content) {
    if (!localStorage.getItem("hideJoinPopup")) {
      popup.classList.remove("hidden");
      setTimeout(() => content.classList.add("show"), 50);
    }

    function hidePopup() {
      content.classList.remove("show");
      setTimeout(() => popup.classList.add("hidden"), 300);
    }

    closeBtn?.addEventListener("click", hidePopup);
    dontShowBtn?.addEventListener("click", () => {
      localStorage.setItem("hideJoinPopup", "true");
      hidePopup();
    });
  }
});
