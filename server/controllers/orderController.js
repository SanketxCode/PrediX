const supabase = require('../supaBaseClient')
const tradematchingService = require('../services/tradeMatchingService');
const { sendOrderBookUpdates } = require('../websocket/websocketServer');


// place an order and add it to the orders db
const placeOrder = async (req, res) => {

    // const { market_id,side,price,amount} = req.body;
    const market_id = Number(req.body.market_id);
    const side = req.body.side;
    const price = Number(req.body.price);
    const amount = Number(req.body.amount);



    console.log('Incoming Order =>', { market_id, side, price, amount });


    if (!market_id || !side || isNaN(price) || isNaN(amount)) {
        return res.status(400).json({ error: 'Valid market_id, price, side, and amount are required' });
    }



    let insertedOrders;
    try {
        console.log("Before Insert:", { market_id, side, price, amount });

        const insertResult = await supabase
            .from('orders')
            .insert([{ market_id, side, price, amount }])
            .select();

        if (insertResult.error) {
            return res.status(500).json({ error: insertResult.error.message });
        }

        insertedOrders = insertResult.data;
    } catch (insertErr) {
        console.error('Insert error:', insertErr);
        return res.status(500).json({ error: insertErr.message });
    }


    const newOrder = insertedOrders[0];
    try {

        const remainingAmount = await tradematchingService.matchOrders(newOrder);


        if (remainingAmount > 0) 
        {
            await supabase.
                from('orders')
                .update({ amount: remainingAmount })
                .eq('id', newOrder.id);
        }
        else 
        {
            await supabase
                .from('orders')
                .delete()
                .eq('id', newOrder.id);
        }

        await sendOrderBookUpdates(market_id);

        return res.status(201).json({
            message: 'Order placed and matched',
            originalOrder: newOrder,
            remainingAmount
        });

    } catch (matchError) {
        return res.status(500).json({ error: matchError.message });
    }

};


const getOrdersByMarket = async (req, res) => {

    const { market_id } = req.params;


    if (!market_id) 
    {
        return res.status(400).json({ error: 'market_id is required !' });
    }

    const marketIdNum = Number(market_id);

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('market_id', marketIdNum);

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);

}

const cancelOrder = async (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400), json({ error: 'Order id is required !' });
    }


    const { data, error } = await supabase.from('orders').delete().eq('id', Number(id)).select();

    if (!data || data.length === 0) 
    {
        return res.status(404).json({ error: 'Order not found' });
    }


    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ message: ' Order Cancelled Successfully ', data });


}

module.exports = { placeOrder, getOrdersByMarket, cancelOrder };