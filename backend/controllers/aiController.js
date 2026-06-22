// ======================
// AI CHAT CONTROLLER (DENGAN DETEKTOR ERROR)
// ======================
const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message wajib diisi' });
        }

        // ==========================================
        // ALARM DETEKTOR API KEY
        // ==========================================
        const apiKey = process.env.GEMINI_API_KEY;
        
        // Cek apakah Vercel berhasil membaca kuncinya?
        if (!apiKey) {
            console.error("[ERROR FATAL]: Vercel tidak bisa menemukan GEMINI_API_KEY!");
            return res.status(200).json({ 
                success: true, 
                reply: "⚠️ **System Alert:** Vercel kamu GAGAL membaca `GEMINI_API_KEY`. Pastikan key sudah dimasukkan di Vercel Environment Variables dan dichecklist untuk target 'Production'!" 
            });
        }

        // Kalau kunci ada, jalankan AI-nya
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest",
            systemInstruction: "Kamu adalah EduVesting AI, asisten virtual cerdas yang ahli dalam investasi saham, kripto, reksadana, dan emas. Pengguna kamu adalah mahasiswa Indonesia. Jawablah dengan gaya bahasa yang asyik, relatable, santai tapi tetap profesional. Berikan saran yang realistis."
        });

        const result = await model.generateContent(message);
        const aiResponse = result.response.text();

        res.status(200).json({ success: true, reply: aiResponse });

    } catch (error) {
        console.error("Gemini API Error Detail:", error.message);
        
        // Kirim detail error aslinya ke layar frontend biar kita tahu!
        res.status(200).json({ 
            success: true, 
            reply: `🚨 **Google Menolak Request:** Error aslinya adalah: *${error.message}*. Cek lagi apakah API Key kamu valid atau ada spasi yang nyangkut.`
        });
    }
};

module.exports = { chatWithAI };
