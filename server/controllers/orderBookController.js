const supabase = require('../supaBaseClient');

    // Group orders by market + side + price
    const getOrderBook =   async (req,res) => {

        const {market_id} = req.params;
        console.log('Market ID type:', typeof market_id, market_id);
        if(!market_id)
        {
            return res.status(400).json({ error :' Market ID is required '});
        }

     
        const {data,error}  = await supabase
            .from('orders')
            .select('side,price,amount')
            .eq('market_id',market_id);

            console.log('Orders data:', data);
        if(error) 
            return res.status(500).json({error: error.message});


        //group and sum amount by side+price

        const orderBook ={};

        data.forEach(({side,price,amount}) => {
            const key = `${side}-${price}`;
            if(!orderBook[key])
            {
                orderBook[key] = { side, price,totalAmount:0};
            }
            orderBook[key].totalAmount += amount;
        });

        res.json(Object.values(orderBook));

   };

   module.exports  = { getOrderBook}