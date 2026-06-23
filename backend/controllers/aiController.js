// ========================================================
// AI CHAT CONTROLLER (GROQ PURE FETCH API)
// 100% Murni Fetch, Super Cepat, dan Bebas SDK Bug! Cihuyy
// ========================================================

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Validasi Input Pesan
        if (!message) {
            return res.status(400).json({ success: false, message: 'Message wajib diisi' });
        }

        // 2. Ambil API Key Groq dari Vercel
        const apiKey = process.env.GROQ_API_KEY;

        // ========================================================
        // INDIKATOR DEBUG: Cek tulisan ini di Vercel Logs kamu nanti!
        // ========================================================
        console.log("=== [DEBUG EDUVESTING AI - GROQ FETCH] ===");
        console.log("Status API Key Groq di Server Vercel:", apiKey ? "✅ TERBACA / DITEMUKAN!" : "❌ KOSONG / UNDEFINED!");
        console.log("============================================");

        // 3. Proteksi jika Environment Variable belum masuk
        if (!apiKey) {
            return res.status(200).json({ 
                success: true, 
                reply: "⚠️ **System Alert:** Vercel gagal membaca `GROQ_API_KEY`. Pastikan kamu sudah memasukkan kunci Groq di Vercel Settings, dicentang semua environment-nya, dan di-Redeploy!" 
            });
        }

        // 4. Menyusun Persona EduVesting AI
        const systemPrompt = "Kamu adalah EduVesting AI, asisten virtual cerdas yang ahli dalam investasi saham, kripto, reksadana, dan emas. Pengguna kamu adalah mahasiswa Indonesia. Jawablah dengan gaya bahasa yang asyik, relatable, santai tapi tetap profesional layaknya mentor finansial anak muda. Berikan saran yang realistis untuk kantong mahasiswa.";

        // 5. URL Endpoint Resmi Groq Cloud
        const url = "https://api.groq.com/openai/v1/chat/completions";

        // 6. Eksekusi PURE FETCH ke Server Groq
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-70b-8192", // Pilihan model ngebut dari Groq
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                temperature: 0.7 // Tingkat kreativitas AI
            })
        });

        const data = await response.json();

        // 7. Tangani jika Groq Menolak (Misal API Key salah)
        if (!response.ok) {
            console.error("Groq Fetch Error Detail:", data);
            return res.status(200).json({ 
                success: true, 
                reply: `🚨 **Error Groq API:** *${data.error?.message || 'Gagal menghubungi server Groq Cloud'}*`
            });
        }

        // 8. Tarik balasan teks dari struktur JSON asli Groq dan kirim ke Frontend
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
