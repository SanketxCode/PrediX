const express = require('express');
const router = express.Router();
const {placeOrder} = require('../controllers/orderController');
const { getOrdersByMarket } = require('../controllers/orderController');
const { cancelOrder } = require('../controllers/orderController');



router.post('/place',placeOrder);

router.get('/:market_id', getOrdersByMarket);

router.delete('/:id', cancelOrder);




module.exports = router;
