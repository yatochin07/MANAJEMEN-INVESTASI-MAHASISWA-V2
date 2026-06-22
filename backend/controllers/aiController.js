// ======================
// AI CHAT CONTROLLER (REAL GEMINI AI)
// ======================
const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message wajib diisi' });
        }

        // PENTING: Inisialisasi API Key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Kamu adalah EduVesting AI, asisten virtual cerdas yang ahli dalam investasi saham, kripto, reksadana, dan emas. Pengguna kamu adalah mahasiswa Indonesia. Jawablah dengan gaya bahasa yang asyik, relatable, santai tapi tetap profesional. Berikan saran yang realistis."
        });

        const result = await model.generateContent(message);
        const aiResponse = result.response.text();

        res.status(200).json({ success: true, reply: aiResponse });

    } catch (error) {
        // JIKA API GEMINI GAGAL, DIA LARI KESINI (Ini yang bikin pesan di layarmu muncul)
        console.error("Gemini API Error:", error);
        res.status(500).json({ success: false, message: 'Gagal menghubungi Gemini' });
    }
};

module.exports = { chatWithAI };
