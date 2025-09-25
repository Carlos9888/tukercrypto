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

// Inisialisasi smooth scroll Lenis setelah DOM siap
document.addEventListener("DOMContentLoaded", function () {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.0,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

 // Handle form submit di beli.html
  // Fungsi ambil query dari URL
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

const form = document.getElementById("form-beli");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const jumlah = form.jumlah.value;
    const jaringan = form.jaringan.value;
    const wallet = form.alamat.value;
    const pair = getQueryParam("pair") || "Tidak diketahui";

    const token = "8069143332:AAHvshJ28eZjqXnB53KoSYwUfhWERCWSYds";
    const chat_id = "-1002767937795";
    const text = `🚀 *PERMINTAAN PEMBELIAN*\n\n📊 Pasangan: ${pair}\n💰 Jumlah: ${jumlah}\n🔗 Jaringan: ${jaringan}\n👛 Wallet: ${wallet}`;

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
          alert("Pesanan kamu berhasil dikirim!");
          form.reset();
        } else {
          alert("Gagal mengirim ke Telegram.");
        }
      })
      .catch((err) => {
        alert("Error: " + err.message);
      });
  });

  // ✅ Tambahan: Tampilkan pasangan di halaman
  const pairText = getQueryParam("pair");
  if (pairText) {
    const pairInfo = document.createElement("p");
    pairInfo.textContent = `Kamu sedang beli: ${pairText}`;
    pairInfo.className = "text-sm text-purple-400 mb-4";
    form.prepend(pairInfo);
  }
}


  
  // Tangkap jual
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

const formJual = document.getElementById("form-jual");
if (formJual) {
  formJual.addEventListener("submit", function (e) {
    e.preventDefault();

    const jumlah = formJual.jumlah.value;
    const jaringan = formJual.jaringan.value;
    const bank = formJual.bank.value;
    const norek = formJual.norek.value;
    const nama = formJual.nama.value;

    const pair = getQueryParam("pair") || "Tidak diketahui";

    const token = "8069143332:AAHvshJ28eZjqXnB53KoSYwUfhWERCWSYds";
    const chat_id = "-1002767937795";
    const text = `📤 *Permintaan Penjualan!*\n\n📊 Pasangan: ${pair}\n💸 Jumlah: ${jumlah} USDT\n🔗 Jaringan: ${jaringan}\n🏦 Bank: ${bank}\n#️⃣ No. Rek: ${norek}\n👤 Atas Nama: ${nama}`;

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
        alert("Data penjualan kamu berhasil dikirim!");
        formJual.reset();
      } else {
        alert("Gagal mengirim ke Telegram.");
      }
    })
    .catch((err) => {
      alert("Error: " + err.message);
    });
  });
}

  // Handle tombol BELI/JUAL di index.html
  const buttons = document.querySelectorAll("button[data-action][data-pair]");
  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const action = this.dataset.action;
      const pair = this.dataset.pair;
      window.location.href = `${action}.html?action=${action}&pair=${encodeURIComponent(pair)}`;
    });
  });
});
