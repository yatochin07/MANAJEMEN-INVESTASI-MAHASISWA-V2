// ======================
// GET ALLOCATION DATA
// ======================

const getAllocationData = async (req, res) => {

    try {

        res.status(200).json({

            success: true,

            allocations: [

                {
                    name: 'Saham',
                    percentage: 40,
                    amount: 5928000
                },

                {
                    name: 'Kripto',
                    percentage: 20,
                    amount: 2964000
                },

                {
                    name: 'Emas',
                    percentage: 15,
                    amount: 2223000
                },

                {
                    name: 'Kas',
                    percentage: 25,
                    amount: 3705000
                }

            ]

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

    getAllocationData

};
