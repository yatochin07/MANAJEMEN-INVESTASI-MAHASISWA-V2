// ========================================================
// AI CHAT CONTROLLER (REAL GEMINI INTEGRATION)
// ========================================================
const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Validasi Input Pesan
        if (!message) {
            return res.status(400).json({ success: false, message: 'Message wajib diisi' });
        }

        // 2. Ambil API Key dari Environment Variable di dalam Fungsi (Wajib untuk Vercel Serverless)
        const apiKey = process.env.GEMINI_API_KEY;

        // ========================================================
        // INDIKATOR DEBUG: Cek tulisan ini di Vercel Logs kamu nanti!
        // ========================================================
        console.log("=== [DEBUG EDUVESTING AI] ===");
        console.log("Status API Key di Server Vercel:", apiKey ? "✅ TERBACA / DITEMUKAN!" : "❌ KOSONG / UNDEFINED!");
        console.log("=============================");

        // 3. Proteksi jika Environment Variable belum masuk ke Vercel
        if (!apiKey) {
            return res.status(200).json({ 
                success: true, 
                reply: "⚠️ **System Alert:** Vercel kamu GAGAL membaca `GEMINI_API_KEY`. Pastikan Environment Variables di Vercel Settings sudah diisi dengan benar dan project sudah di-Redeploy!" 
            });
        }

        // 4. Inisialisasi Google Generative AI SDK
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Menggunakan model Gemini 1.5 Flash Terbaru (Sangat cepat & pintar)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 5. Menyusun Prompt / Persona EduVesting AI
        const superPrompt = `Kamu adalah EduVesting AI, asisten virtual cerdas yang ahli dalam investasi saham, kripto, reksadana, dan emas. Pengguna kamu adalah mahasiswa Indonesia. Jawablah dengan gaya bahasa yang asyik, relatable, santai tapi tetap profesional layaknya mentor finansial anak muda. Berikan saran yang realistis untuk kantong mahasiswa.\n\nPertanyaan User:\n${message}`;

        // 6. Ambil respons dari Google Gemini Cloud
        const result = await model.generateContent(superPrompt);
        const aiResponse = result.response.text();

        // 7. Kirim balik respons sukses ke Frontend
        res.status(200).json({ success: true, reply: aiResponse });

    } catch (error) {
        // Jika kodingan benar tapi Google menolak (misal API key buatanmu di-suspend atau salah), 
        // Log ini akan mencatat alasan aslinya dari Google, dan memunculkannya di chat UI biar ketahuan.
        console.error("Gemini API Error Detail:", error.message);

        res.status(200).json({ 
            success: true, 
            reply: `🚨 **Error Google Gemini Cloud:** *${error.message}* (Pastikan API Key yang dimasukkan ke Vercel sudah benar-benar valid di Google AI Studio)`
        });
    }
};

module.exports = { chatWithAI };
