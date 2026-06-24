// ========================================================
// VERCEL EDGE MIDDLEWARE (ANTI-SPAM / RATE LIMITER)
// ========================================================

// 1. Tentukan halaman atau API mana saja yang mau dijaga satpam
export const config = {
  matcher: [
    '/login.html',       // Jaga halaman login dari brute-force password
    '/register.html',    // Jaga halaman daftar dari bot pembuat akun palsu
    '/api/:path*'        // Jaga seluruh jalur API AI lu (jika ada)
  ]
};

// 2. Memori sementara untuk nyatet IP pengunjung
const rateLimitMap = new Map();

export default function middleware(request) {
  // Tangkap IP Address asli dari pengunjung (Vercel menggunakan x-forwarded-for)
  const ip = request.headers.get('x-forwarded-for') || 'ip-tidak-diketahui';

  // ==============================================
  // ATURAN KETAT: Maksimal 15 Request per 10 Detik
  // ==============================================
  const LIMIT = 15; 
  const WAKTU_TUNGGU = 10000; // 10.000 ms = 10 Detik

  const currentTime = Date.now();

  // Jika IP ini baru pertama kali datang, catat di buku tamu
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, startTime: currentTime });
  } else {
    // Jika IP sudah ada, cek udah berapa kali dia request
    const userData = rateLimitMap.get(ip);
    const timePassed = currentTime - userData.startTime;

    if (timePassed < WAKTU_TUNGGU) {
      userData.count++;
      
      // JIKA MELEBIHI BATAS: Langsung tendang dengan pesan Error 429
      if (userData.count > LIMIT) {
        return new Response(
          JSON.stringify({
            sukses: false,
            pesan: "🚨 WOY SANTAI BOS! Terlalu banyak request. Tunggu 10 detik ya biar server nggak jebol."
          }),
          {
            status: 429, // Kode HTTP standar untuk "Too Many Requests"
            headers: { 
              'Content-Type': 'application/json',
              'Retry-After': '10' 
            }
          }
        );
      }
    } else {
      // Jika sudah lewat 10 detik, pemutihan dosa (reset hitungan ke 1)
      rateLimitMap.set(ip, { count: 1, startTime: currentTime });
    }
  }

  // Jika lolos dari semua pengecekan di atas, biarkan pengunjung masuk dengan tenang (lanjut ke proses normal Vercel)
}
