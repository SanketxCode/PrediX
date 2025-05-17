const express =  require('express');
const router  = express.Router();
const { getOrderBook} =  require('../controllers/orderBookController');


router.get('/book/:market_id', getOrderBook);

router.get('/:market_id',getOrderBook);



module.exports = router;