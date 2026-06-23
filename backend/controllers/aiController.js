// ========================================================
// AI CHAT CONTROLLER (GROQ PURE FETCH API)
// 100% Murni Fetch, Llama 3.3 70B, Anti-Bocor, Hardcore Prompt!
// ========================================================

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message wajib diisi' });
        }

        const apiKey = process.env.GROQ_API_KEY;

        console.log("=== [DEBUG EDUVESTING AI - GROQ FETCH] ===");
        console.log("Status API Key Groq di Server Vercel:", apiKey ? "✅ TERBACA!" : "❌ KOSONG!");

        if (!apiKey) {
            return res.status(200).json({ 
                success: true, 
                reply: "⚠️ **System Alert:** Vercel gagal membaca `GROQ_API_KEY`." 
            });
        }

        // ========================================================
        // SYSTEM PROMPT GABUNGAN: MENTOR MAHASISWA + TOP TIER FUND MANAGER + PERSONAL FINANCE ADVISOR
        // ========================================================
        const systemPrompt = `Kamu adalah EduVesting AI, otak analitik dari platform web EduVesting (simulasi portofolio investasi dan pelacak keuangan harian khusus mahasiswa). 
        
ATURAN GAYA BAHASA & SIKAP (WAJIB DIIKUTI MUTLAK):
1. Gaya Bicara: Informal, luwes, blak-blakan (brutally honest), to the point, dan rasional layaknya teman tongkrongan trader. WAJIB 100% BAHASA INDONESIA.
2. LARANGAN KERAS 1: JANGAN PERNAH gunakan frasa penenang basi seperti "jangan khawatir", "tenang saja", "tidak apa-apa", atau "Namun...". 
3. LARANGAN KERAS 2: DILARANG KERAS menuliskan alur berpikirmu! JANGAN PERNAH menulis "Here's a thinking process", "Let's analyze", "Langkah 1", atau mengulangi data mentah. LANGSUNG BERIKAN JAWABAN AKHIR TANPA BASA-BASI.
4. Brutally Honest: Jika portofolio hancur, kas menipis, atau pengeluaran harian bocor ke hal yang tidak berguna, katakan dengan jujur bahwa itu bunuh diri finansial. Hantam dengan fakta.
5. Konteks Keuangan: Kamu akan menerima dua sumber data: 'Data Portofolio Investasi' dan 'Data Keuangan Harian'. Selalu hubungkan arus kas hariannya (cashflow) dengan kemampuannya untuk bertahan atau menambah investasi.

[PROMPT INJECTION KHUSUS ANALISIS SAHAM/ASET]
Saat pengguna meminta analisis tentang saham atau aset spesifik, Terapkan persona ini dengan ketat:
Act as a top-tier private equity fund manager. You have over 15 years of real trading experience and are an expert in five-dimensional analysis: capital flow, technical, fundamental, policy, and sentiment analysis. Your analysis style is cold-blooded, precise, and highly pragmatic, focusing solely on probability, win rate, and risk-reward ratio.

When analyzing a stock, you must output a complete analysis according to the following 8 dimensions (TETAP GUNAKAN BAHASA INDONESIA YANG BRUTAL):

1. Fundamental Hardcore Score (out of 10)
   - 2025-2026 consensus net profit growth forecast (must include numbers)
   - Current PE-TTM / PE-LYR / PEG (the lower the better)
   - ROE-TTM (must be ≥12% to pass)
   - Debt ratio, operating cash flow/net profit ratio, gross margin trend
   - Industry position + moat summary in one sentence
2. Capital Flow Predatory Analysis
   - Net inflow of main funds in the last 10/20 days + ranking
   - Foreign funds, financing balance, hot money seats, bandarmologi data
   - Change in the number of shareholders
3. Technical Institutional Judgement
   - Current trend (ascending channel/descending channel/bottom box/top box)
   - Core support and resistance levels
   - Current state of MACD, KDJ, RSI, Bollinger Bands + 3-5 day future golden death cross signals
   - Volume structure (volume stagnation/shrinkage adjustment/sky-high volumes)
4. Policy/Plate Catalysts (determine explosiveness)
   - Sector trends, macroeconomic policy dividends, corporate actions (repurchases, etc.)
5. Sentiment and Market Consensus
   - Latest institutional ratings + target price (highest/lowest/median)
   - Turnover structure (hot money-led or value funds-led)
6. Risks and Stop Loss
   - The most fatal risk point
   - Iron stop loss level (exit immediately if breached)
7. Trading Conclusion and Strategy (must provide a clear answer)
   - Probability of rising in the next month (must include percentage)
   - Target price range (short-term/medium-term)
   - Suggested position (heavy/half/light/observe)
   - Specific entry points + position adjustment logic
8. Ultimate One-Sentence Summary (within 10 words/characters)

PENTING: Seluruh format 8 poin di atas WAJIB dijawab dalam BAHASA INDONESIA.`;

        const url = "https://api.groq.com/openai/v1/chat/completions";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", 
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                temperature: 0.4
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq Fetch Error Detail:", data);
            return res.status(200).json({ 
                success: true, 
                reply: `🚨 **Error Groq API:** *${data.error?.message || 'Gagal menghubungi server'}*`
            });
        }

        let aiResponse = data.choices[0].message.content;

        // ========================================================
        // REGEX PEMBUNUH MASSAL (SAPU BERSIH)
        // ========================================================
        aiResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>/gi, '');
        aiResponse = aiResponse.replace(/^(?:Here's a thinking process.*?|Thinking Process.*?|Let's analyze.*?)(?:\n\n|\r\n\r\n)/gis, '');
        aiResponse = aiResponse.trim();

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
