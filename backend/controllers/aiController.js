// ======================
// AI CHAT CONTROLLER (ANTI 404 / GEMINI-PRO)
// ======================
const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message wajib diisi' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(200).json({ 
                success: true, 
                reply: "⚠️ **System Alert:** Vercel kamu GAGAL membaca `GEMINI_API_KEY`." 
            });
        }

        // ==========================================
        // PERUBAHAN 1: Pakai model universal 'gemini-pro'
        // ==========================================
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash" });

        // ==========================================
        // PERUBAHAN 2: Trik memasukkan kepribadian AI ke dalam prompt
        // ==========================================
        const superPrompt = `Kamu adalah EduVesting AI, asisten virtual cerdas yang ahli dalam investasi saham, kripto, reksadana, dan emas. Pengguna kamu adalah mahasiswa Indonesia. Jawablah dengan gaya bahasa yang asyik, relatable, santai tapi tetap profesional. Berikan saran yang realistis untuk kantong mahasiswa.\n\nPertanyaan User:\n${message}`;

        const result = await model.generateContent(superPrompt);
        const aiResponse = result.response.text();

        res.status(200).json({ success: true, reply: aiResponse });

    } catch (error) {
        console.error("Gemini API Error Detail:", error.message);
        
        res.status(200).json({ 
            success: true, 
            reply: `🚨 **Error Vercel/Google:** *${error.message}*`
        });
    }
};

module.exports = { chatWithAI };
