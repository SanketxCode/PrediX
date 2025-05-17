const express = require('express');
const router  = express.Router();
const { createMarket,getMarkets,getMarketSummary} = require('../controllers/marketController');

router.post('/',createMarket);
router.get('/',getMarkets);
router.get('/:market_id/summary', getMarketSummary);


module.exports = router;