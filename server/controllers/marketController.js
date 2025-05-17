const supabase = require('../supaBaseClient');

const createMarket = async (req, res) => {
  console.log('Request Body:', req.body);
  const { question, deadline } = req.body;

  if (!question || !deadline) {
    return res.status(400).json({ error: 'Question and deadline required' });
  }

  const { data, error } = await supabase
    .from('markets')
    .insert([{ question, deadline }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
};

const getMarkets = async (req, res) => {
  const { data, error } = await supabase
    .from('markets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

const getMarketSummary = async (req, res) => {
  const { market_id } = req.params;

  if (!market_id) return res.status(400).json({ error: 'Market ID required' });

  try {
    // Sum amounts for yes and no sides
    const { data: yesOrders } = await supabase
      .from('orders')
      .select('amount')
      .eq('market_id', market_id)
      .eq('side', 'yes');

    const { data: noOrders } = await supabase
      .from('orders')
      .select('amount')
      .eq('market_id', market_id)
      .eq('side', 'no');

    const totalYes = yesOrders?.reduce((sum, o) => sum + o.amount, 0) || 0;
    const totalNo = noOrders?.reduce((sum, o) => sum + o.amount, 0) || 0;

    // Best yes order price (highest)
    const { data: bestYesOrder } = await supabase
      .from('orders')
      .select('price')
      .eq('market_id', market_id)
      .eq('side', 'yes')
      .order('price', { ascending: false })
      .limit(1);

    // Best no order price (lowest)
    const { data: bestNoOrder } = await supabase
      .from('orders')
      .select('price')
      .eq('market_id', market_id)
      .eq('side', 'no')
      .order('price', { ascending: true })
      .limit(1);

    // Last traded price and total traded volume from trades table
    const { data: trades } = await supabase
      .from('trades')
      .select('price, amount')
      .eq('market_id', market_id)
      .order('created_at', { ascending: false })
      .limit(1);

    const ltp = trades?.[0]?.price || null;

    const { data: allTrades } = await supabase
      .from('trades')
      .select('amount')
      .eq('market_id', market_id);

    const totalVolume = allTrades?.reduce((acc, t) => acc + t.amount, 0) || 0;

    res.json({
      total_yes: totalYes,
      total_no: totalNo,
      bestYes: bestYesOrder?.[0]?.price || null,
      bestNo: bestNoOrder?.[0]?.price || null,
      ltp,
      totalVolume,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createMarket, getMarkets, getMarketSummary };
