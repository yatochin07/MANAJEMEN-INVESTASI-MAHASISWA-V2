// ========================================================
// AI CHAT CONTROLLER (GEMINI PURE FETCH API)
// 100% Murni Fetch, Bebas SDK Bug, dan Gratis Selamanya!
// ========================================================

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Validasi Input Pesan
        if (!message) {
            return res.status(400).json({ success: false, message: 'Message wajib diisi' });
        }

        // 2. Ambil API Key Gemini dari Vercel
        const apiKey = process.env.GEMINI_API_KEY;

        // ========================================================
        // INDIKATOR DEBUG: Cek tulisan ini di Vercel Logs kamu nanti!
        // ========================================================
        console.log("=== [DEBUG EDUVESTING AI - GEMINI FETCH] ===");
        console.log("Status API Key Gemini di Server Vercel:", apiKey ? "✅ TERBACA / DITEMUKAN!" : "❌ KOSONG / UNDEFINED!");
        console.log("============================================");

        // 3. Proteksi jika Environment Variable belum masuk
        if (!apiKey) {
            return res.status(200).json({ 
                success: true, 
                reply: "⚠️ **System Alert:** Vercel gagal membaca `GEMINI_API_KEY`. Pastikan kamu sudah memasukkan kembali kunci Gemini di Vercel Settings, dicentang semua environment-nya, dan di-Redeploy!" 
            });
        }

        // 4. Menyusun Persona EduVesting AI
        const systemPrompt = "Kamu adalah EduVesting AI, asisten virtual cerdas yang ahli dalam investasi saham, kripto, reksadana, dan emas. Pengguna kamu adalah mahasiswa Indonesia. Jawablah dengan gaya bahasa yang asyik, relatable, santai tapi tetap profesional layaknya mentor finansial anak muda. Berikan saran yang realistis untuk kantong mahasiswa.";

        // 5. URL Endpoint Resmi Gemini Cloud (Sudah Fix Pake -latest)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        // 6. Eksekusi PURE FETCH ke Server Google
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: message }]
                    }
                ],
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                },
                generationConfig: {
                    temperature: 0.7 // Tingkat kreativitas AI
                }
            })
        });

        const data = await response.json();

        // 7. Tangani jika Google Menolak (Misal API Key salah)
        if (!response.ok) {
            console.error("Gemini Fetch Error Detail:", data);
            return res.status(200).json({ 
                success: true, 
                reply: `🚨 **Error Gemini API:** *${data.error?.message || 'Gagal menghubungi server Gemini Cloud'}*`
            });
        }

        // 8. Tarik balasan teks dari struktur JSON asli Google Gemini dan kirim ke Frontend
        const aiResponse = data.candidates[0].content.parts[0].text;
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
