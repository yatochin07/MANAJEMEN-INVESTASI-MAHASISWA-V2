const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendLoginEmail(email, username) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Login Berhasil - EduVesting',
        html: `
            <h2>Login Berhasil</h2>
            <p>Halo ${username},</p>
            <p>Akun EduVesting Anda baru saja login menggunakan Google.</p>
            <p>Waktu: ${new Date().toLocaleString('id-ID')}</p>
            <hr>
            <p>Jika ini bukan Anda, segera ubah keamanan akun Anda.</p>
        `
    });
}

module.exports = sendLoginEmail;