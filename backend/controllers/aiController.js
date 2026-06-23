// ========================================================
// AI CHAT CONTROLLER (OPENAI PURE FETCH API)
// Tidak butuh require library SDK tambahan!
// ========================================================

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Validasi Input Pesan
        if (!message) {
            return res.status(400).json({ success: false, message: 'Message wajib diisi' });
        }

        // 2. Ambil API Key OpenAI dari Vercel
        const apiKey = process.env.OPENAI_API_KEY;

        // ========================================================
        // INDIKATOR DEBUG: Cek tulisan ini di Vercel Logs kamu nanti!
        // ========================================================
        console.log("=== [DEBUG EDUVESTING AI] ===");
        console.log("Status API Key OpenAI di Server Vercel:", apiKey ? "✅ TERBACA / DITEMUKAN!" : "❌ KOSONG / UNDEFINED!");
        console.log("=============================");

        // 3. Proteksi jika Environment Variable belum masuk
        if (!apiKey) {
            return res.status(200).json({ 
                success: true, 
                reply: "⚠️ **System Alert:** Vercel gagal membaca `OPENAI_API_KEY`. Pastikan Environment Variable sudah diisi, dicentang semua environment-nya, dan di-Redeploy!" 
            });
        }

        // 4. Menyusun Persona EduVesting AI
        const systemPrompt = "Kamu adalah EduVesting AI, asisten virtual cerdas yang ahli dalam investasi saham, kripto, reksadana, dan emas. Pengguna kamu adalah mahasiswa Indonesia. Jawablah dengan gaya bahasa yang asyik, relatable, santai tapi tetap profesional layaknya mentor finansial anak muda. Berikan saran yang realistis untuk kantong mahasiswa.";

        // 5. Eksekusi PURE FETCH ke Server OpenAI
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Model OpenAI yang paling cepat, pinter, dan hemat cost
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                temperature: 0.7 // Tingkat kreativitas AI (0 = kaku, 1 = kreatif)
            })
        });

        const data = await response.json();

        // 6. Tangani jika OpenAI Menolak (Misal Saldo Habis / Key Salah)
        if (!response.ok) {
            console.error("OpenAI Error Detail:", data);
            return res.status(200).json({ 
                success: true, 
                reply: `🚨 **Error OpenAI:** *${data.error?.message || 'Gagal menghubungi server API OpenAI'}*`
            });
        }

        // 7. Tarik balasan AI dan kirim ke Frontend
        const aiResponse = data.choices[0].message.content;
        res.status(200).json({ success: true, reply: aiResponse });

    } catch (error) {
        console.error("Fetch Request Error:", error.message);
        res.status(200).json({ 
            success: true, 
            reply: `🚨 **Internal Server Error:** *Koneksi ke AI terputus (${error.message})*`
        });
    }
};

module.exports = { chatWithAI };
