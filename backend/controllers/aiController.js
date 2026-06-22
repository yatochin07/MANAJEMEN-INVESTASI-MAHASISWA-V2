// ======================
// AI CHAT CONTROLLER
// ======================
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Pastikan dotenv di-load agar process.env.GEMINI_API_KEY terbaca
require('dotenv').config();

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        // VALIDASI
        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message wajib diisi woy!'
            });
        }

        // INISIALISASI GEMINI API
        // Pastikan GEMINI_API_KEY sudah ada di file .env
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Kita pakai model gemini-1.5-flash yang super cepat dan gratis
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // ======================
        // SYSTEM PROMPT (PERAN AI)
        // ======================
        // Kita suntikkan instruksi agar AI menjawab sesuai persona EduVesting
        const promptContext = `
            Kamu adalah EduVesting AI, asisten finansial pintar dan gaul khusus untuk mahasiswa Indonesia.
            Tugasmu adalah menganalisis portofolio investasi (Saham, Kripto, Emas, Reksa Dana, Kas) dan menjawab pertanyaan terkait keuangan.
            Gunakan bahasa yang asyik, santai, tapi tetap profesional dan mendidik. Panggil user dengan sebutan 'Bos' atau 'Bro/Sis'.
            Berikan jawaban yang singkat, padat, tidak bertele-tele, dan langsung ke intinya.

            Pertanyaan dari user: "${message}"
        `;

        // PANGGIL AI
        const result = await model.generateContent(promptContext);
        const aiResponse = result.response.text();

        // ======================
        // RESPONSE KE FRONTEND
        // ======================
        res.status(200).json({
            success: true,
            reply: aiResponse
        });

    } catch (error) {
        console.error("Gagal nyambung ke AI:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error atau API Limit habis bos!'
        });
    }
};

// EXPORT
module.exports = {
    chatWithAI
};