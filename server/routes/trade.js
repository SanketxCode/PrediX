const express =  require('express');
const router  = express.Router();
const { createTrade }  = require('../controllers/tradeController');


router.post('/create/new-trade',createTrade);

module.exports = router;