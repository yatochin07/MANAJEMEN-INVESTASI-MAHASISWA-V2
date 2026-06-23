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

        console.log("=== [DEBUG EDUVESTING AI - GROQ FETCH] ===");
        console.log("Status API Key Groq di Server Vercel:", apiKey ? "✅ TERBACA / DITEMUKAN!" : "❌ KOSONG / UNDEFINED!");
        console.log("============================================");

        if (!apiKey) {
            return res.status(200).json({ 
                success: true, 
                reply: "⚠️ **System Alert:** Vercel gagal membaca `GROQ_API_KEY`. Pastikan kamu sudah memasukkan kunci Groq di Vercel Settings, dicentang semua environment-nya, dan di-Redeploy!" 
            });
        }

        // 4. Menyusun Persona EduVesting AI (PENGAMANAN EKSTRA KETAT)
        const systemPrompt = `Kamu adalah EduVesting AI, otak analitik dari platform web EduVesting (simulasi portofolio investasi khusus mahasiswa). 
        
ATURAN GAYA BAHASA & SIKAP (WAJIB DIIKUTI MUTLAK):
1. Gaya Bicara: Informal, luwes, blak-blakan (brutally honest), to the point, dan rasional layaknya teman tongkrongan trader. WAJIB 100% BAHASA INDONESIA.
2. LARANGAN KERAS 1 (ANTI-SUGARCOATING): JANGAN PERNAH gunakan frasa penenang basi seperti "jangan khawatir", "tenang saja", "tidak apa-apa", atau "Namun...". 
3. LARANGAN KERAS 2 (ANTI-BOT): DILARANG KERAS menuliskan alur berpikirmu! JANGAN PERNAH menulis "Here's a thinking process", "Let's analyze", "Langkah 1", atau mengulangi data mentah dari user. LANGSUNG BERIKAN JAWABAN AKHIR TANPA BASA-BASI.
4. Brutally Honest: Jika portofolio pengguna hancur (minus parah) atau kas menipis, katakan dengan jujur bahwa itu bunuh diri finansial. Hantam dengan fakta teknikal dan margin/leverage jika relevan.

PERAN KHUSUS (TOP-TIER FUND MANAGER):
Saat menganalisis saham atau aset, bertindaklah sebagai Top-Tier Private Equity Fund Manager berdarah dingin. HANYA fokus pada probabilitas, win rate, dan risk-reward ratio.

JIKA MENGANALISIS ASET, KELUARKAN 8 DIMENSI INI (SINGKAT & PADAT):
1. Fundamental Score (1-10): Proyeksi laba, PE/PEG, ROE (wajib ≥12%), rasio utang.
2. Analisis Predatory: Foreign Flow/Bandarmologi & tren pemegang saham.
3. Judgement Teknikal: Tren (uptrend/downtrend), Support & Resistance inti, indikator kunci (MACD/RSI/Bollinger).
4. Katalis Kebijakan: Sentimen sektoral/makro & aksi korporasi.
5. Sentimen Pasar: Rating institusi & target harga rasional.
6. Risiko & Stop Loss: Titik risiko fatal & level Cut Loss tanpa ampun.
7. Kesimpulan & Strategi: Probabilitas naik (%), target harga, rekomendasi porsi, & entry point.
8. Ultimate Summary: Ringkasan mematikan dalam 1 kalimat (maksimal 10 kata).`;

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
                model: "qwen/qwen3.6-27b",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                temperature: 0.4 // Suhu diturunkan lagi ke 0.4 agar model jadi sangat patuh pada aturan (tidak berhalusinasi menulis alur berpikir)
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq Fetch Error Detail:", data);
            return res.status(200).json({ 
                success: true, 
                reply: `🚨 **Error Groq API:** *${data.error?.message || 'Gagal menghubungi server Groq Cloud'}*`
            });
        }

        // 7. Ambil balasan teks dari Groq
        let aiResponse = data.choices[0].message.content;

        // 8. PENGAMANAN REGEX LAPIS DUA
        // Jika AI masih bandel membocorkan "Here's a thinking process" atau tag <think>, kita potong paksa di sini
        aiResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>\n*/gi, '');
        if (aiResponse.toLowerCase().includes("thinking process:")) {
            const splitResponse = aiResponse.split(/(?:\n\n|\r\n\r\n)/);
            // Mencari paragraf pertama yang tidak mengandung kata "thinking" untuk dijadikan awalan
            aiResponse = splitResponse.filter(para => !para.toLowerCase().includes("thinking process")).join('\n\n').trim();
        }

        // 9. Kirim jawaban bersih ke Frontend
        res.status(200).json({ success: true, reply: aiResponse.trim() });

    } catch (error) {
        console.error("Fetch Request Error:", error.message);
        res.status(200).json({ 
            success: true, 
            reply: `🚨 **Internal Server Error:** *Koneksi ke AI terputus (${error.message})*`
        });
    }
};

module.exports = { chatWithAI };
