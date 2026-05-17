const express = require('express');

const router = express.Router();

let goals = [];


// GET ALL GOALS
router.get('/', (req, res) => {

    res.json(goals);

});


// ADD GOAL
router.post('/', (req, res) => {

    const newGoal = req.body;

    goals.push(newGoal);

    res.json({
        message: 'Target berhasil dibuat',
        data: newGoal
    });

});


module.exports = router;