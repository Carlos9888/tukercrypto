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

// ✅ Tutup menu otomatis saat link diklik
document.addEventListener("DOMContentLoaded", () => {
  const mobileLinks = document.querySelectorAll('#mobileMenu a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      toggleMenu(); // Tutup menu

      // Kalau link ke halaman lain, tunggu sebentar baru pindah
      if (!href.startsWith('#')) {
        e.preventDefault();
        setTimeout(() => {
          window.location.href = href;
        }, 200); // delay 0.2s biar animasi slide kelihatan
      }
    });
  });
});



// Fungsi ambil parameter dari URL
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

document.addEventListener("DOMContentLoaded", function () {


  // ✅ Form Pembelian
  const form = document.getElementById("form-beli");
  if (form) {
    const pair = getQueryParam("pair") || "Tidak diketahui";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const jumlah = form.jumlah.value;
      const jaringan = form.jaringan.value;
      const wallet = form.alamat.value;

      const text = `🚀 *PERMINTAAN PEMBELIAN*\n\n📊 Pasangan: ${pair}\n💰 Jumlah: ${jumlah}\n🔗 Jaringan: ${jaringan}\n👛 Wallet: ${wallet}`;
      kirimKeTelegram(text, form);
    });

    // Tambah teks "Kamu sedang beli..."
    const pairText = getQueryParam("pair");
    if (pairText) {
      const pairInfo = document.createElement("p");
      pairInfo.textContent = `Kamu sedang beli: ${pairText}`;
      pairInfo.className = "text-sm text-purple-400 mb-4";
      form.prepend(pairInfo);
    }
  }

  // ✅ Form Penjualan
  const formJual = document.getElementById("form-jual");
  if (formJual) {
    const pair = getQueryParam("pair") || "Tidak diketahui";

    formJual.addEventListener("submit", function (e) {
      e.preventDefault();

      const jumlah = formJual.jumlah.value;
      const jaringan = formJual.jaringan.value;
      const bank = formJual.bank.value;
      const norek = formJual.norek.value;
      const nama = formJual.nama.value;

      const text = `📤 *Permintaan Penjualan!*\n\n📊 Pasangan: ${pair}\n💸 Jumlah: ${jumlah} USDT\n🔗 Jaringan: ${jaringan}\n🏦 Bank: ${bank}\n#️⃣ No. Rek: ${norek}\n👤 Atas Nama: ${nama}`;
      kirimKeTelegram(text, formJual);
    });
  }

  // ✅ Tombol BELI / JUAL
  const buttons = document.querySelectorAll("button[data-action][data-pair]");
  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const action = this.dataset.action;
      const pair = this.dataset.pair;
      window.location.href = `${action}.html?action=${action}&pair=${encodeURIComponent(pair)}`;
    });
  });
});

// Fungsi Kirim ke Telegram
function kirimKeTelegram(text, formElement) {
  const token = "8069143332:AAHvshJ28eZjqXnB53KoSYwUfhWERCWSYds";
  const chat_id = "-1002767937795";

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
    .catch((err) => {
      alert("Error: " + err.message);
    });
}

// ✅ Loader hide setelah halaman selesai load
window.addEventListener("load", function() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "none"; // hilang seketika
  }
});

// ✅ Popup Join Profesional
document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("joinPopup");
  const content = document.querySelector(".popup-content");
  const closeBtn = document.getElementById("closePopup");
  const dontShowBtn = document.getElementById("dontShowAgain");

  // Cek localStorage
  if (!localStorage.getItem("hideJoinPopup")) {
    popup.classList.remove("hidden");
    setTimeout(() => content.classList.add("show"), 50);
  }

  // Fungsi tutup popup
  function hidePopup() {
    content.classList.remove("show");
    setTimeout(() => popup.classList.add("hidden"), 300);
  }

  // Tombol X
  closeBtn.addEventListener("click", hidePopup);

  // Tombol jangan tampilkan lagi
  dontShowBtn.addEventListener("click", () => {
    localStorage.setItem("hideJoinPopup", "true");
    hidePopup();
  });
});
