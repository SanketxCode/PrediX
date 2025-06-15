const express = require('express');
const cors = require('cors');
const supabase = require('./supaBaseClient');
const { setupWebSocket } = require('./websocket/websocketServer.js'); // MODIFY THIS

const http = require('http'); // ADD THIS


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

const orderBookRoutes =  require('./routes/orderBook.js');
app.use('/api/orderbook',orderBookRoutes);

const orderRoutes =  require('./routes/order.js');
app.use('/api/orders',orderRoutes);

const tradeRoutes = require('./routes/trade.js');
app.use('/api/trades', tradeRoutes);


const PORT = 4000;

const server = http.createServer(app); // CREATE HTTP SERVER

// Start WebSocket server on same HTTP server
setupWebSocket(server); // START WEBSOCKET ON SAME SERVER

server.listen(PORT, () => {
  console.log(`Server (HTTP + WebSocket) running on PORT ${PORT}`);
});
// app.listen(PORT,()=>{
//   console.log(`Server is running on PORT:${PORT}`);
// })

// wss.on('listening', () => {
//   console.log('WebSocket server running on port 8080');
// });