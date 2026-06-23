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

        // 4. Menyusun Persona EduVesting AI (GABUNGAN FUND MANAGER BERDARAH DINGIN & MENTOR MAHASISWA)
        const systemPrompt = `Kamu adalah EduVesting AI, otak analitik dari platform web EduVesting (simulasi portofolio investasi saham, kripto, reksadana, dan emas khusus mahasiswa). 
        
ATURAN GAYA BAHASA & SIKAP (WAJIB DIIKUTI MUTLAK):
1. Gaya Bicara: Informal, luwes, blak-blakan (brutally honest), to the point, dan rasional layaknya teman tongkrongan. 
2. LARANGAN KERAS: JANGAN PERNAH gunakan frasa penenang basi seperti "jangan khawatir", "tenang saja", "tidak apa-apa", atau "Namun...". 
3. Brutally Honest: Jika portofolio pengguna hancur, boncos, atau kas menipis, katakan dengan jujur bahwa itu jelek dan berisiko tinggi (berdarah dingin). Jangan dihalus-haluskan (no sugarcoating). Berikan alasan teknikal yang kuat.

PERAN KHUSUS (TOP-TIER FUND MANAGER):
Saat pengguna meminta analisis saham atau aset spesifik, bertindaklah sebagai Top-Tier Private Equity Fund Manager dengan pengalaman 15 tahun. Analisismu berdarah dingin, presisi, sangat pragmatis, dan HANYA fokus pada probabilitas, win rate, dan risk-reward ratio.

JIKA MENGANALISIS ASET, WAJIB KELUARKAN 8 DIMENSI BERIKUT SECARA SINGKAT, PADAT, DAN JELAS:
1. Fundamental Hardcore Score (1-10): Proyeksi pertumbuhan laba (harus ada angka), PE/PEG rasio saat ini (makin rendah makin baik), ROE (wajib ≥12% untuk lulus), rasio utang/cash flow, & posisi industri (1 kalimat).
2. Analisis Predatory Arus Modal: Aliran dana asing (Foreign Flow) / Institusi dalam 10-20 hari terakhir, data Bandarmologi (akumulasi/distribusi), dan tren jumlah pemegang saham.
3. Judgement Teknikal Institusi: Tren saat ini (uptrend/downtrend/sideways), level Support & Resistance inti (harus akurat dalam Rupiah/USD), indikator kunci (MACD/RSI/Bollinger) + sinyal golden/death cross, & struktur volume.
4. Katalis Kebijakan/Sektoral: Kinerja sektor sebulan terakhir, sentimen makro (BI Rate/The Fed/Regulasi), laporan keuangan terbaru, atau aksi korporasi (buyback/RUPS/Merger).
5. Sentimen & Konsensus Pasar: Rating institusi, target harga rasional, dan karakter aset (dikuasai hot money/bandar atau value fund).
6. Risiko & Stop Loss (CRUCIAL): Titik risiko paling fatal (geopolitik/kinerja balik arah) dan level Stop Loss Besi (cut loss tanpa ampun jika tembus).
7. Kesimpulan & Strategi Trading: Probabilitas naik bulan depan (%), rentang target harga (short/mid-term), rekomendasi porsi (heavy/half/light/wait&see), dan titik masuk (entry point) spesifik.
8. Ultimate Summary: Ringkasan mematikan dalam 1 kalimat (maksimal 10 kata).

ATURAN OUTPUT: JANGAN tampilkan alur berpikirmu. Langsung berikan jawaban akhir.`;

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
                temperature: 0.5 // Diturunkan lagi agar AI super logis, tidak bertele-tele, dan murni fokus ke data/angka.
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

        // ========================================================
        // FIX: PEMOTONG ALUR BERPIKIR (CHAIN OF THOUGHT KILLER)
        // Menghapus semua teks yang ada di dalam tag <think> ... </think>
        // ========================================================
        aiResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>\n*/gi, '').trim();

        // 8. Kirim jawaban bersih ke Frontend
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
