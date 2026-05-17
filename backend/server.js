const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

require('dotenv').config();


// ======================
// IMPORT ROUTES
// ======================

const authRoutes =
require('./routes/authRoutes');

const portfolioRoutes =
require('./routes/portfolioRoutes');

const transactionRoutes =
require('./routes/transactionRoutes');

const goalsRoutes =
require('./routes/goalsRoutes');

const aiRoutes =
require('./routes/aiRoutes');

const alloRoutes =
require('./routes/alloRoutes');

const calculatorRoutes =
require('./routes/calculatorRoutes');

const settingsRoutes =
require('./routes/settingsRoutes');


// ======================
// APP
// ======================

const app = express();


// ======================
// MIDDLEWARE
// ======================

app.use(cors());

app.use(express.json());


// ======================
// DATABASE
// ======================

mongoose.connect(
    process.env.MONGO_URI
)
.then(() => {

    console.log(
        'MongoDB Connected'
    );

})
.catch((err) => {

    console.log(err);

});


// ======================
// ROUTES
// ======================

app.use(
    '/api/auth',
    authRoutes
);

app.use(
    '/api/portfolio',
    portfolioRoutes
);

app.use(
    '/api/transactions',
    transactionRoutes
);

app.use(
    '/api/goals',
    goalsRoutes
);

app.use(
    '/api/ai',
    aiRoutes
);

app.use(
    '/api/allocations',
    alloRoutes
);

app.use(
   '/api/calculator',
   calculatorRoutes
);

app.use(
   '/api/settings',
   settingsRoutes
);


// ======================
// SERVER
// ======================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

    console.log(
        '✅ SERVER BERHASIL JALAN'
    );

});