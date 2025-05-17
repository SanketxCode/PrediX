const supabase = require('../supaBaseClient');


const createTrade  =  async( req, res) =>{
    
    const { market_id,price,amount,buy_order_id,sell_order_id} = req.body;

    console.log(req.body);
    
    if (!market_id || !price || !amount || !buy_order_id || !sell_order_id) {
        return res.status(400).json({ error: 'All trade fields are required' });
    }


    const {data,error}  = await  supabase
        .from('trades')
        .insert([{market_id,price,amount,buy_order_id,sell_order_id}])
        .select();

    if(error) return res.status(500).json({error : error.message});


    res.status(201).json({ message : ' Trade created ',data});

};

module.exports = { createTrade};