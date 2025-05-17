const WebSocket = require('ws');
const supabase  =  require('../supaBaseClient');


const wss = new WebSocket.Server({port:8080});

const clients = new Map(); // client => subscribed market_ids will be added here
wss.on('connection',(ws)=>{
    console.log('Client connected');


    clients.set(ws,new Set());

    
    ws.on('message',(message) =>{
        console.log('Recieved :',message);

        try{
            const {action,market_id}  = JSON.parse(message);

            console.log(action+" "+market_id)
            if(action === 'subscribe' && market_id)
            {
                clients.get(ws).add(market_id);
                ws.send(JSON.stringify({status:'subscribed',market_id}));
            }
            else if(action  === 'unsubscribe' && market_id)
            {
                clients.get(ws).delete(market_id);
                ws.send(JSON.stringify({status:'unsubscribed',market_id}));
            }
            else
            {
                ws.send(JSON.stringify({error:'Invalid action  missing market_id '}));
            }
        }catch{
            ws.send(JSON.stringify({error:'Invalid JSON'}));
        }
    });


    ws.on('close',()=>{
        console.log('Client disconnected');
    });
    
});

function broadcast(data){
    const msg = JSON.stringify(data);
    wss.clients.forEach((client)=>{
        if(client.readyState === WebSocket.OPEN){
            client.send(msg);
        }
    })
}


async function sendOrderBookUpdates(market_id){


    const {data,error} = await supabase
    .from('orders')
    .select('*')
    .eq('market_id',market_id);

    if(error){
        console.error(' Failed to fetch orders '+error.message);
    }

    broadcast({type :'orderbookUpdate',market_id,order:data});
}


module.exports = {wss ,sendOrderBookUpdates}