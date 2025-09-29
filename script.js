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

// ✅ Kurs contoh
const kurs = {
  USDT: 16300,
  USDC: 16300
};

// ✅ Contoh nomor rekening sesuai bank / e-wallet
const contohNorek = {
  BCA: "1234567890",
  BNI: "9876543210",
  BRI: "1122334455",
  MANDIRI: "5566778899",
  "CIMB Niaga": "6677889900",
  Permata: "9988776655",
  DANA: "081234567890",
  OVO: "082345678901",
  GoPay: "083456789012",
  ShopeePay: "084567890123",
  LinkAja: "085678901234"
};

// ✅ Ambil param dari URL
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    action: params.get("action")?.toLowerCase() || "jual",
    exchange: params.get("exchange") || "USDT",
    token: params.get("token") || "USDT",
    jumlah: params.get("jumlah") || "",
  };
}

// ✅ Update form & tombol submit sesuai param
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

  exchangeInput.value = exchange;
  tokenInput.value = token;
  actionInput.value = action;

  

  if (inputJumlah) {
    if (jumlah) inputJumlah.value = jumlah;
    inputJumlah.placeholder = `Minimal penarikan 1 ${token}`;
    if (estimasi) estimasi.textContent = `Estimasi IDR: Rp ${Number(inputJumlah.value || 0) * (kurs[token] || 0)}`;
  }

  if (inputJumlah && estimasi) {
    const updateEstimasi = () => {
      const val = Number(inputJumlah.value) || 0;
      estimasi.textContent = `Kurs 16.300📈 Estimasi IDR: Rp ${(val * (kurs[token] || 0)).toLocaleString()}`;
    };
    inputJumlah.addEventListener("input", updateEstimasi);
    updateEstimasi();
  }

  submitBtn.textContent = `Lanjutkan ${action === "beli" ? "Beli" : "Jual"} ${token}`;
  form.action = `/${action}`;
}

// ✅ Update header sesuai param
function updateHeader({ action, exchange, token }) {
  const headerIcon = document.getElementById("headerIcon");
  const headerText = document.getElementById("headerText");
  const headerDesc = document.getElementById("headerDesc");

  if (!headerText || !headerDesc || !headerIcon) return;

  if (action && exchange && token) {
    headerText.textContent = `${action === "beli" ? "Convert ke " + token : "Tuker " + token + " ke Rupiah"} (${exchange})`;
    headerDesc.textContent = action === "beli"
      ? `Kamu akan membeli ${token} melalui ${exchange}. Silakan masukkan UID ${exchange} kamu dengan benar, karena token akan langsung dikirim ke akun tersebut setelah pembayaran Rupiah berhasil.`
      : `Kamu akan menjual ${token} melalui ${exchange}. Silakan transfer ${token} ke UID TukerCrypto yang tertera, dan pastikan nomor rekening bank kamu benar untuk menerima pencairan Rupiah.`;
    headerIcon.textContent = action === "beli" ? "📥🔑" : "📤🏦";
  } else if (action && token) {
    headerText.textContent = action === "beli" ? `Convert ke ${token}` : `Tuker ${token}`;
    headerDesc.textContent = action === "beli"
      ? `Konversi saldo Rupiah kamu menjadi ${token}.`
      : `Tuker ${token} kamu menjadi Rupiah.`;
    headerIcon.textContent = action === "beli" ? "🔄💸" : "💱💰";
  } else if (action) {
    headerText.textContent = action === "beli" ? "Convert Aset" : "Tuker Aset";
    headerDesc.textContent = `Isi formulir berikut untuk melakukan proses ${action}.`;
    headerIcon.textContent = action === "beli" ? "🔄" : "💱";
  } else {
    headerText.textContent = "Form Transaksi";
    headerDesc.textContent = "Silakan isi data tukar/convert aset dengan benar.";
    headerIcon.textContent = "💰";
  }
}

// Fix label/placeholder jumlah sesuai token di URL
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") || "USDT"; // default USDT

  const labelJumlah = document.querySelector('label[for="jumlah"]');
  if (labelJumlah) {
    labelJumlah.textContent = `Jumlah ${token}`;
  }

  const inputJumlah = document.getElementById("jumlah");
  if (inputJumlah) {
    inputJumlah.placeholder = `Minimal penarikan 1 ${token}`;
  }
});

// ✅ Kirim data ke Telegram
function kirimKeTelegram(text, formElement) {
  const token = "8069143332:AAHvshJ28eZjqXnB53KoSYwUfhWERCWSYds";
  const chat_id = "-1002767937795";

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
        const estimasi = document.getElementById("estimasiIDR");
        if (estimasi) estimasi.textContent = `Estimasi IDR: Rp 0`;
      } else {
        alert("❌ Gagal mengirim ke Telegram.");
      }
    })
    .catch(err => alert("Error: " + err.message));
}

// ✅ Fungsi validasi nama pemilik rekening / e-wallet
function validateNamaPemilik(nama) {
  nama = nama.trim();
  if (nama.length < 3) return { ok: false, msg: "Nama terlalu pendek" };
  if (!/^[a-zA-Z\s]+$/.test(nama)) return { ok: false, msg: "Nama hanya boleh huruf dan spasi" };
  return { ok: true, nama };
}

// ✅ DOMContentLoaded utama
document.addEventListener("DOMContentLoaded", function () {
  // Redirect tombol BELI / JUAL
  const actionButtons = document.querySelectorAll("button[data-action]");
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const exchange = btn.dataset.exchange;
      const token = btn.dataset.token;
      const pair = btn.dataset.pair;
      const network = btn.dataset.network;

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

  // Update header & form header
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

  updateHeader({ action, exchange, token });

  // Event listener placeholder bank
  const bankInput = document.getElementById("bank");
  const norekInput = document.getElementById("norek");
  if (bankInput && norekInput) {
    bankInput.addEventListener("change", () => {
      const val = bankInput.value;
      norekInput.placeholder = contohNorek[val] ? `Contoh: ${contohNorek[val]}` : "Contoh: 1234567890";
    });
    const defaultVal = bankInput.value;
    if (defaultVal && contohNorek[defaultVal]) {
      norekInput.placeholder = `Contoh: ${contohNorek[defaultVal]}`;
    }
  }

  // Form Pembelian
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

  // Form Penjualan
  const formJual = document.getElementById("form-jual");
  if (formJual) {
    const submitBtn = document.getElementById("submitBtn");
    const inputJumlah = document.getElementById("jumlah");
    const estimasi = document.getElementById("estimasiIDR");
    const bankSelect = document.getElementById("bank");
    const norekInput = document.getElementById("norek");
    const namaInput = document.getElementById("nama");
    const notifEmail = document.getElementById("notifEmail");
    const notifWA = document.getElementById("notifWA");

    if (inputJumlah && estimasi) {
      const updateEstimasi = () => {
        const val = Number(inputJumlah.value) || 0;
        const tokenFromUrl = (new URLSearchParams(window.location.search)).get("token") || "USDT";
        estimasi.textContent = `Kurs 16.300📈 Estimasi IDR: Rp ${(val * (kurs[tokenFromUrl] || 0)).toLocaleString()}`;
      };
      inputJumlah.addEventListener("input", updateEstimasi);
      updateEstimasi();
    }

    formJual.addEventListener("submit", function (e) {
      e.preventDefault();
      const jumlahVal = inputJumlah?.value;
      const bank = bankSelect?.value;
      const norek = norekInput?.value;
      const namaVal = namaInput?.value;
      const email = notifEmail?.value || "";
      const wa = notifWA?.value || "";

      if (!jumlahVal || !bank || !norek || !namaVal) {
        alert("❌ Harap isi semua kolom dengan benar!");
        return;
      }

      const v = validateNamaPemilik(namaVal);
      if (!v.ok) {
        alert(`❌ ${v.msg}`);
        return;
      }

      const confirmText = `Konfirmasi data:\n\nBank: ${bank}\nNo. Rek: ${norek}\nNama Pemilik: ${v.nama}\nJumlah: ${jumlahVal}\nEmail: ${email}\nWA: ${wa}\n\nPastikan nama sesuai dengan data rekening/e-wallet. Lanjutkan?`;
      if (!confirm(confirmText)) return;

      const tokenFromUrl = (new URLSearchParams(window.location.search)).get("token") || "";
      const text = `📤 *PERMINTAAN PENJUALAN*\n\n📊 Pair: ${tokenFromUrl}\n💸 Jumlah: ${jumlahVal}\n🏦 Bank: ${bank}\n#️⃣ Rek: ${norek}\n👤 Nama: ${v.nama}\n✉️ Email: ${email}\n📲 WA: ${wa}`;

      kirimKeTelegram(text, formJual);
    });
  }
});

// Jalankan saat DOM siap
document.addEventListener("DOMContentLoaded", initForm);


// Tutup menu otomatis saat klik link di mobile menu
document.addEventListener("DOMContentLoaded", function () {
  const mobileLinks = document.querySelectorAll("#mobileMenu a");
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.add("translate-x-full"); // tutup menu
      if (overlay) overlay.classList.add("hidden"); // sembunyikan overlay
    });
  });
});
