const supabase = require('../supaBaseClient');


const createTrade = async (req, res) => {
  const { market_id, price, amount, yes_order_id, no_order_id } = req.body;

  console.log("Incoming Trade =>", req.body);

  if (!market_id || !price || !amount || !yes_order_id || !no_order_id) {
    return res.status(400).json({ error: 'All trade fields are required' });
  }

  const { data, error } = await supabase
    .from('trades')
    .insert([{ market_id, price, amount, yes_order_id, no_order_id }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ message: 'Trade created', data });
};


const getTradesByMarket = async (req,res) =>{
    const { market_id} = req.params;

    if(!market_id)
    {
        return res.status(400).json({error : 'market_id is required !'});
    }

    const {data ,error} = await supabase
    .from('trades')
    .select('*')
    .eq('market_id',market_id)
    .order('created_date',{ascending : false});


    if(error) return res.status(500).json({ error : error.message});

    res.json(data);
}

module.exports = { createTrade,getTradesByMarket};