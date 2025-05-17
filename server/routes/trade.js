const express =  require('express');
const router  = express.Router();
const { createTrade, getTradesByMarket }  = require('../controllers/tradeController');


router.post('/create/new-trade',createTrade);

router.get('/:market_id',getTradesByMarket)

module.exports = router;