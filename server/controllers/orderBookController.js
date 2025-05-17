const supabase = require('../supaBaseClient');

    // Group orders by market + side + price
    const getOrderBook =   async (req,res) => {

        const {market_id} = req.params;


        if(!market_id)
        {
            return res.status(400).json({ error :' Market ID is required '});
        }

     
        const {data,error}  = await supabase
            .from('orders')
            .select('side,price,amount')
            .eq('market_id',market_id);


        if(error) return res.status(500).json({error: error.message});

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

       const grouped  = Object.values(orderBook).reduce(
        (acc, order) => 
            {
                const sideKey = order.side === 'yes' ? 'buy' : 'sell';
                acc[sideKey].push({price: order.price, totalAmount: order.totalAmount});
                return acc;
            },
        { buy: [], sell: [] }
    );

       grouped.buy.sort((a,b) => b.price - a.price); // descending
       grouped.sell.sort((a,b) => a.price - b.price); // ascending


        res.json(grouped);

   };

   module.exports  = { getOrderBook}