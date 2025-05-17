const supabase = require('../supaBaseClient')


// place an order and add it to the orders db
const placeOrder = async( req,res) => {
    
    const { market_id,side,price,amount} = req.body;

    console.log(req.body);
    

    if( !market_id || !side || !price || !amount )
    {
        return res.status(500).json({error:' market_id , price , side and amount are required '});
    }


    const {data,error}  = await supabase
        .from('orders')
        .insert([{market_id,side,price,amount}])
        .select();

    if(error) return res.status(500).json({error:error.message});

    res.status(201).json(data);
};


const getOrdersByMarket = async (req,res) =>{

    const {market_id} = req.params;


    if(!market_id)
    {
        return res.status(400).json({error : 'market_id is required !'});
    }

    const marketIdNum = Number(market_id);

    const {data,error} = await supabase
        .from('orders')
        .select('*')
        .eq('market_id',marketIdNum);

    if(error) return res.status(500).json({error:error.message});

    res.json(data);

}

const cancelOrder = async(req,res) =>{

    const {id} = req.params;

    if(!id){
        return res.status(400),json({error : 'Order id is required !'});
    }


    const {data ,error} = await supabase.from('orders').delete().eq('id',Number(id)).select();

    if (!data || data.length === 0) 
        {
            return res.status(404).json({ error: 'Order not found' });
        }

        
    if(error) return res.status(500).json({error:error.message});

    return res.status(200).json({message : ' Order Cancelled Successfully ',data});


}

module.exports = {placeOrder,getOrdersByMarket,cancelOrder};