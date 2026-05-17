// ======================
// AI CHAT CONTROLLER
// ======================

const chatWithAI = async (req, res) => {

    try {

        const { message } = req.body;

        // VALIDASI
        if (!message) {

            return res.status(400).json({
                success: false,
                message: 'Message wajib diisi'
            });

        }

        // ======================
        // SIMULASI AI RESPONSE
        // ======================

        let aiResponse = '';

        const lowerMessage =
        message.toLowerCase();

        // RESPONSE 1
        if (
            lowerMessage.includes('margin')
        ) {

            aiResponse =
            'Margin portfolio kamu saat ini cukup tinggi. Disarankan menurunkan exposure margin agar lebih aman terhadap volatilitas pasar.';

        }

        // RESPONSE 2
        else if (
            lowerMessage.includes('kripto')
        ) {

            aiResponse =
            'Aset kripto kamu sedang profit. Pertimbangkan take profit sebagian untuk mengurangi risiko volatilitas ekstrem.';

        }

        // RESPONSE DEFAULT
        else {

            aiResponse =
            'Portfolio kamu cukup sehat, tetapi diversifikasi sektor masih bisa ditingkatkan agar risiko lebih seimbang.';

        }

        // ======================
        // RESPONSE
        // ======================

        res.status(200).json({

            success: true,

            reply: aiResponse

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: 'Server Error'

        });

    }

};


// EXPORT
module.exports = {

    chatWithAI

};