Arsitektur BackendTeknologi:Node.js: Lingkungan eksekusi JavaScript di sisi server.Express.js: Kerangka kerja (framework) untuk membuat server web dan API dengan mudah.Axios/node-fetch: Untuk melakukan panggilan HTTP dari backend kita ke API AI pihak ketiga.Tugas Utama:Menyediakan API Endpoint: Membuat sebuah URL khusus, contoh: /api/generate-motif.Menerima Permintaan: Ketika pengguna menekan tombol "Buat Desain" di frontend, frontend akan mengirim prompt (deskripsi motif) ke URL tersebut.Memanggil Layanan AI: Backend secara aman menggunakan kunci API rahasianya untuk meneruskan prompt pengguna ke layanan AI (misal: Imagen dari Google AI).Mengirimkan Hasil: Setelah mendapatkan balasan berupa URL gambar dari layanan AI, backend mengirimkan URL tersebut kembali ke frontend untuk ditampilkan.Contoh Struktur Folder/gaya-etnik-backend
├── node_modules/
├── public/             // (Opsional) Untuk file statis seperti HTML, CSS
├── package.json
└── server.js           // Logika utama server kita
Contoh Kode Backend (server.js)// server.js

// 1. Impor library yang dibutuhkan
const express = require('express');
const cors = require('cors'); // Untuk mengizinkan koneksi dari frontend
const axios = require('axios'); // Untuk memanggil API lain

// 2. Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Konfigurasi middleware
app.use(cors()); // Mengizinkan semua domain (untuk pengembangan)
app.use(express.json()); // Memungkinkan server membaca data JSON dari request

// --- KUNCI API RAHASIA ---
// Di aplikasi production, gunakan environment variables (process.env.AI_API_KEY)
const AI_IMAGE_API_KEY = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // JANGAN DI-HARDCODE SEPERTI INI DI PRODUKSI
const AI_IMAGE_API_URL = "https://api.openai.com/v1/images/generations"; // Contoh URL API DALL-E

// 4. Definisikan API Endpoint untuk AI Motif Mixer
app.post('/api/generate-motif', async (req, res) => {
    // Ambil deskripsi motif dari body request yang dikirim frontend
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Deskripsi motif (prompt) tidak boleh kosong.' });
    }

    try {
        console.log(`Menerima permintaan untuk membuat motif: ${prompt}`);

        // Konfigurasi request ke API AI
        const apiRequestData = {
            prompt: `desain motif kain sarung etnik indonesia, ${prompt}`, // Kita bisa menambahkan konteks
            n: 1, // Jumlah gambar yang dihasilkan
            size: "512x512" // Ukuran gambar
        };

        const apiRequestHeaders = {
            'Authorization': `Bearer ${AI_IMAGE_API_KEY}`
        };

        // Panggil API AI menggunakan Axios
        const aiResponse = await axios.post(AI_IMAGE_API_URL, apiRequestData, { headers: apiRequestHeaders });

        // Ambil URL gambar dari respons AI
        const imageUrl = aiResponse.data.data[0].url;

        console.log(`Sukses! URL Gambar: ${imageUrl}`);

        // Kirim URL gambar kembali ke frontend
        res.status(200).json({ imageUrl: imageUrl });

    } catch (error) {
        console.error("Terjadi error saat memanggil API AI:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Gagal membuat motif. Silakan coba lagi nanti.' });
    }
});

// 5. Jalankan server
app.listen(PORT, () => {
    console.log(`Server GayaEtnik berjalan di http://localhost:${PORT}`);
});
