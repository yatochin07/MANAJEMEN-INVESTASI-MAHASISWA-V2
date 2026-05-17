const User = require('../models/users');


// ==========================
// LOGIN USER
// ==========================

const loginUser = async (req, res) => {

    try {

        const {
            login,
            password
        } = req.body;

        console.log(login);

        // cari berdasarkan EMAIL ATAU USERNAME
        const user = await User.findOne({

            $or: [

                { email: login },

                { username: login }

            ]

        });

        // kalau user tidak ada
        if (!user) {

            return res.status(401).json({

                message:
                'Username atau Email tidak ditemukan'

            });

        }

        // cek password
        if (user.password !== password) {

            return res.status(401).json({

                message:
                'Password salah'

            });

        }

        // login berhasil
        res.json({

            token: 'dummy_token',

            user: {

                username: user.username,

                email: user.email,

                university: user.university

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message:
            'Server Error'

        });

    }

};


// ==========================
// REGISTER USER
// ==========================

const registerUser = async (req, res) => {

    try {

        const {

            username,
            email,
            university,
            password

        } = req.body;

        // cek user
        const existingUser =
        await User.findOne({

            $or: [

                { email: email },

                { username: username }

            ]

        });

        if (existingUser) {

            return res.status(400).json({

                message:
                'Email / Username sudah digunakan'

            });

        }

        // user baru
        const newUser = new User({

            username,
            email,
            university,
            password

        });

        await newUser.save();

        res.json({

            message:
            'Register berhasil'

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message:
            'Server Error'

        });

    }

};


module.exports = {

    loginUser,
    registerUser

};