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
      `${action === "beli" ? "Convert ke " + token : "Tuker " + token + " ke Rupiah"} (${exchange})`;

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
      action === "beli" ? `Convert ke ${token}` : `Tuker ${token}`;
    headerDesc.textContent = 
      action === "beli"
        ? `Konversi saldo Rupiah kamu menjadi ${token}.`
        : `Tuker ${token} kamu menjadi Rupiah.`;
    headerIcon.textContent = action === "beli" ? "🔄💸" : "💱💰";
  } 
  
  else if (action) {
    headerText.textContent = action === "beli" ? "Convert Aset" : "Tuker Aset";
    headerDesc.textContent = `Isi formulir berikut untuk melakukan proses ${action}.`;
    headerIcon.textContent = action === "beli" ? "🔄" : "💱";
  } 
  
  else {
    headerText.textContent = "Form Transaksi";
    headerDesc.textContent = "Silakan isi data tukar/convert aset dengan benar.";
    headerIcon.textContent = "💰";
  }
});


// Ambil param dari URL
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    action: params.get("action")?.toLowerCase() || "jual",
    exchange: params.get("exchange") || "USDT",
    token: params.get("token") || "USDT",
    jumlah: params.get("jumlah") || "", // tambahan
  };
}

// Kurs contoh
const kurs = {
  USDT: 16300,
  USDC: 16300
};

// Update form & tombol submit sesuai param
function updateForm({ action, exchange, token, jumlah }) {
  const form = document.getElementById("form-jual");
  const exchangeInput = document.getElementById("exchange");
  const tokenInput = document.getElementById("token");
  const actionInput = document.getElementById("actionType");
  const submitBtn = document.getElementById("submitBtn");
  const inputJumlah = document.getElementById("jumlah");
  const estimasi = document.getElementById("estimasiIDR");
  const labelJumlah = document.querySelector('label[for="jumlah"]');

  if (!form || !exchangeInput || !tokenInput || !actionInput || !submitBtn) return;

  // Hidden input
  exchangeInput.value = exchange;
  tokenInput.value = token;
  actionInput.value = action;

  // Update label jumlah sesuai token
  if (labelJumlah) {
    labelJumlah.textContent = `Jumlah ${token}`;
  }

  // Input jumlah otomatis jika ada
if (inputJumlah) {
  if (jumlah) inputJumlah.value = jumlah;
  // Set placeholder sesuai token
  inputJumlah.placeholder = `Minimal penarikan 1 ${token}`;
  if (estimasi) estimasi.textContent = `Estimasi IDR: Rp ${Number(inputJumlah.value || 0) * (kurs[token] || 0)}`;
}



  // Event input untuk update estimasi langsung
  if (inputJumlah && estimasi) {
    const updateEstimasi = () => {
      const val = Number(inputJumlah.value) || 0;
      estimasi.textContent = `Kurs 16.300📈 Estimasi IDR: Rp ${ (val * (kurs[token] || 0)).toLocaleString() }`;
    };
    inputJumlah.addEventListener("input", updateEstimasi);
    updateEstimasi(); // trigger sekali saat load
  }

  // Teks tombol submit
  submitBtn.textContent = `Lanjutkan ${action === "beli" ? "Beli" : "Jual"} ${token}`;

  // Update atribut action form (optional)
  form.action = `/${action}`;
}

// Update header sesuai param
function updateHeader({ action, exchange, token }) {
  const headerIcon = document.getElementById("headerIcon");
  const headerText = document.getElementById("headerText");
  const headerDesc = document.getElementById("headerDesc");

  if (!headerText || !headerDesc || !headerIcon) return;

  headerText.textContent = action === "beli" 
    ? `Convert ke ${token} (${exchange})` 
    : `Tuker ${token} ke Rupiah (${exchange})`;

  headerDesc.textContent = action === "beli"
    ? `Kamu akan membeli ${token} melalui ${exchange}. Masukkan UID ${exchange} kamu dengan benar.`
    : `Kamu akan menjual ${token} melalui ${exchange}. Pastikan nomor rekening bank kamu benar untuk menerima Rupiah.`;

  headerIcon.textContent = action === "beli" ? "📥🔑" : "📤🏦";
}


// Kirim data ke Telegram
function kirimKeTelegram(text, formElement) {
  const token = "TOKEN_BOT";
  const chat_id = "CHAT_ID";

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode: "Markdown" }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        alert("✅ Data berhasil dikirim!");
        formElement.reset();
        // Reset estimasi setelah reset
        const estimasi = document.getElementById("estimasiIDR");
        if (estimasi) estimasi.textContent = `Estimasi IDR: Rp 0`;
      } else {
        alert("❌ Gagal mengirim ke Telegram.");
      }
    })
    .catch(err => alert("Error: " + err.message));
}

// Init form & event listener
function initForm() {
  const { action, exchange, token, jumlah } = getUrlParams();
  updateForm({ action, exchange, token, jumlah });
  updateHeader({ action, exchange, token });

  // Event submit form jual
  const formJual = document.getElementById("form-jual");
  if (!formJual) return;

  formJual.addEventListener("submit", function (e) {
    e.preventDefault();
    const jumlahVal = formJual.querySelector("#jumlah")?.value;
    const bank = formJual.querySelector("#bank")?.value;
    const norek = formJual.querySelector("#norek")?.value;
    const nama = formJual.querySelector("#nama")?.value;

    if (!jumlahVal || !bank || !norek || !nama) {
      alert("❌ Harap isi semua kolom dengan benar!");
      return;
    }

    const text = `📤 *PERMINTAAN PENJUALAN*\n\n📊 Pair: ${token}\n💸 Jumlah: ${jumlahVal}\n🏦 Bank: ${bank}\n#️⃣ Rek: ${norek}\n👤 Nama: ${nama}`;
    kirimKeTelegram(text, formJual);
  });
}

// Jalankan saat DOM siap
document.addEventListener("DOMContentLoaded", initForm);
