const express = require('express');
const router = express.Router();
const passport = require('passport');
const nodemailer = require('nodemailer');

const {
    loginUser,
    registerUser
} = require('../controllers/authController');

// =========================
// EMAIL TRANSPORTER
// =========================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// =========================
// LOGIN MANUAL
// =========================
router.post('/login', loginUser);
router.post('/register', registerUser);

// =========================
// LOGIN GOOGLE
// =========================
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// =========================
// CALLBACK GOOGLE
// =========================
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://127.0.0.1:5500/frontend/login.html'
    }),
    async (req, res) => {

        const username = req.user.displayName;
        const email = req.user.emails[0].value;

        // Kirim email notifikasi login
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Login Berhasil - EduVesting',
                html: `
                    <h2>Login Berhasil</h2>
                    <p>Halo <b>${username}</b>,</p>
                    <p>Akun EduVesting Anda baru saja login menggunakan Google.</p>
                    <p>Email: ${email}</p>
                    <p>Waktu Login: ${new Date().toLocaleString('id-ID')}</p>
                    <hr>
                    <p>Jika ini bukan Anda, segera periksa keamanan akun Google Anda.</p>
                `
            });

            console.log('✅ Email login berhasil dikirim');
        } catch (error) {
            console.error('❌ Gagal mengirim email:', error.message);
        }

        const userData = {
            username,
            email
        };

        const encoded = encodeURIComponent(
            JSON.stringify(userData)
        );

        res.redirect(
            `http://127.0.0.1:5500/frontend/login.html?google=${encoded}`
        );
    }
);

module.exports = router;