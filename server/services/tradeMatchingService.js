const supabase =  require('../supaBaseClient')

async function matchOrders(newOrder)
{
    const { market_id,side,price,amount} =  newOrder;

    const OppsiteSide = side === 'buy' ? 'sell' : 'buy';

    let remainingAmount  = amount;

  // 1. Fetch opposite orders sorted by best price
    const {data :OppsiteOrder ,error} = await supabase
    .from('orders')
    .select('*')
    .eq('market_id', market_id)
    .eq('side', oppositeSide)
    .lte('price', price)
    .order('price', { ascending: side === 'buy' });

    if (error) throw new Error(error.message);

    for (const order of OppsiteOrder)
    {
        if (remainingAmount <= 0) break;
        
        const tradeAmount = Math.min(order.amount,remainingAmount);

        await supabase.from('trades').insert([{
            market_id ,
            price : order.price,amount:tradeAmount,
            buy_order_id:side === 'buy' ? newOrder.id : order.id,
            sell_order_id:side === 'sell' ? newOrder.id : order.id
        }]);


        if(order.amount > tradeAmount)
        {
            await supabase
            .from('orders')
            .update({amount:order.amount - tradeAmount })
            .eq('id',order.id);          
        }
        else{
            await supabase
            .from('orders')
            .delete()
            .eq('id',order.id);
        }

        remainingAmount -= tradeAmount ;
    }

    return remainingAmount;
}

module.exports = { matchOrders };
