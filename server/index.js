const express = require('express');
const cors = require('cors');
const supabase = require('./supaBaseClient');

const app  =  express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Predix backend is running........');
});

app.get('/test-supabase', async (req, res) => {
  const { data, error } = await supabase.from('markets').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

const marketRoutes = require('./routes/market.js');
app.use('/api/markets', marketRoutes);

const orderRoutes =  require('./routes/orderBook.js');
app.use('/api/orderbook',orderRoutes);

const PORT = 4000;

app.listen(PORT,()=>{
  console.log(`Server is running on PORT:${PORT}`);
})