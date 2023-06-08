const express = require('express');
const router = express.Router();
const userRouter = require('./userRouter');
const gameRouter = require('./gameRouter');

router.use('/users', userRouter);
router.use('/game', gameRouter);

module.exports = router;
