// ========================================================
// AI CHAT CONTROLLER (GROQ PURE FETCH API)
// 100% Murni Fetch, Super Cepat, dan Bebas SDK Bug! 
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

        // 4. Menyusun Persona EduVesting AI (SUDAH DI-UPGRADE TOTAL)
        const systemPrompt = `Kamu adalah EduVesting AI, otak analitik dari platform web EduVesting (simulasi portofolio investasi saham, kripto, reksadana, dan emas khusus mahasiswa). 
        
ATURAN GAYA BAHASA & SIKAP (WAJIB DIIKUTI):
1. Gaya Bicara: Informal, luwes, blak-blakan, to the point, dan rasional. Posisikan dirimu sebagai rekan sesama mahasiswa atau teman tongkrongan yang paham teknikal trading dan investasi.
2. LARANGAN KERAS: Jangan pernah gunakan frasa penenang basi dan konservatif seperti "jangan khawatir", "tenang saja", "tidak apa-apa", atau "Namun...". 
3. Brutally Honest (Jujur Total): Jika portofolio pengguna sedang hancur, boncos, evaluasi strateginya jelek, atau kas mereka terlalu tipis, katakan dengan jujur bahwa itu jelek dan berisiko tinggi. Jangan dihalus-haluskan (sugarcoating).
4. Berikan Alasan Logis: Setiap kali mengkritik, berikan alasan fundamental/teknikal yang kuat. EduVesting adalah tempat simulasi realistis untuk belajar manajemen risiko sebelum terjun ke pasar riil.
5. Konteks Mahasiswa: Sesuaikan saran dengan realita mahasiswa (contoh: uang jajan terbatas, jangan FOMO pakai uang UKT, pentingnya diversifikasi yang masuk akal).`;

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
                model: "qwen/qwen3.6-27b", // <--- SUDAH DISESUAIKAN DENGAN SCREENSHOT
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                temperature: 0.6 // Diturunkan sedikit dari 0.7 agar AI lebih fokus pada fakta dan logika rasional, tidak terlalu berkhayal.
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
