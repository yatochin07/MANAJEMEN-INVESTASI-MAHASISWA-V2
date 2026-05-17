// ======================
// IMPORT MODEL
// ======================

const User = require(
    '../models/users'
);


// ======================
// UPDATE PROFILE
// ======================

const updateProfile =
async (req, res) => {

    try {

        const {

            email,
            username

        } = req.body;

        // ======================
        // VALIDASI
        // ======================

        if (!email || !username) {

            return res.status(400).json({

                success: false,
                message:
                'Email dan username wajib'

            });

        }

        // ======================
        // CARI USER
        // ======================

        const user =
        await User.findOne({

            email

        });

        if (!user) {

            return res.status(404).json({

                success: false,
                message:
                'User tidak ditemukan'

            });

        }

        // ======================
        // UPDATE DATA
        // ======================

        user.username =
        username;

        user.name =
        username;

        await user.save();

        // ======================
        // RESPONSE
        // ======================

        res.status(200).json({

            success: true,

            message:
            'Profile berhasil diupdate',

            user

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message:
            'Server Error'

        });

    }

};


// ======================
// EXPORT
// ======================

module.exports = {

    updateProfile

};