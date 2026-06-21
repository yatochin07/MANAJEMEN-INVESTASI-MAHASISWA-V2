// ======================
// CALCULATOR CONTROLLER
// ======================

const calculateFee = async (req, res) => {

    try {

        const {

            instrument,
            transactionType,
            budget,
            price

        } = req.body;

        let feeRate = 0;

        // ======================
        // FEE RATE
        // ======================

        if (instrument === 'saham') {

            feeRate =
            transactionType === 'beli'
            ? 0.0015
            : 0.0025;

        }

        else if (instrument === 'kripto') {

            feeRate = 0.001;

        }

        else if (instrument === 'emas') {

            feeRate = 0.005;

        }

        // ======================
        // CALCULATION
        // ======================

        const fee =
        budget * feeRate;

        const total =
        transactionType === 'beli'
        ? budget + fee
        : budget - fee;

        // ======================
        // RESPONSE
        // ======================

        res.status(200).json({

            success: true,

            instrument,

            transactionType,

            budget,

            price,

            fee,

            total

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

module.exports = {

    calculateFee

};
