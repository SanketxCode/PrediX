const WebSocket = require('ws');
const supabase  =  require('../supaBaseClient');


const wss = new WebSocket.Server({port:8080});

wss.on('connection',(ws)=>{
    console.log('Client connected');

    ws.on('message',(message) =>{
        console.log('Recieved :',message);
        
    });


    ws.on('close',()=>{
        console.log('Client disconnected');
    })
    
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