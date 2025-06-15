const WebSocket = require('ws');
const supabase = require('../supaBaseClient');

let wss;
const clients = new Map();

function setupWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.set(ws, new Set());

    ws.on('message', (message) => {
      try {
        const { action, market_id } = JSON.parse(message);
        if (action === 'subscribe' && market_id) {
          clients.get(ws).add(market_id);
          ws.send(JSON.stringify({ status: 'subscribed', market_id }));
            sendOrderBookUpdates(market_id);
            console.log(market_id);
            
        } else if (action === 'unsubscribe' && market_id) {
          clients.get(ws).delete(market_id);
          ws.send(JSON.stringify({ status: 'unsubscribed', market_id }));
        } else {
          ws.send(JSON.stringify({ error: 'Invalid action/missing market_id' }));
        }
      } catch {
        ws.send(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      clients.delete(ws);
    });
  });
}

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

async function sendOrderBookUpdates(market_id) {
  const { data: yesOrders } = await supabase
    .from('orders')
    .select('price, amount')
    .eq('market_id', market_id)
    .eq('side', 'yes');

  const { data: noOrders } = await supabase
    .from('orders')
    .select('price, amount')
    .eq('market_id', market_id)
    .eq('side', 'no');

  const bestYes = yesOrders.length ? Math.max(...yesOrders.map(o => o.price)) : 0;
  const bestNo = noOrders.length ? Math.min(...noOrders.map(o => o.price)) : 0;

  const totalYes = yesOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalNo = noOrders.reduce((sum, o) => sum + o.amount, 0);

 broadcast({
  type: 'orderbookUpdate',
  market_id,
  best_yes: bestYes,
  best_no: bestNo,
  order: [
    { side: 'yes', price: bestYes, amount: totalYes },
    { side: 'no', price: bestNo, amount: totalNo }
  ]
});

}

module.exports = { setupWebSocket, sendOrderBookUpdates };
