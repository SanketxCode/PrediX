import { useEffect, useState ,useParams} from "react";
import EventHeader from "../components/EventHeader";
import EventStats from "../components/EventStats";
import OrderBook from "../components/OrderBook";
import MarketChart from "../components/MarketChart";
import TradeHistory from "../components/TraderHistory";

const EventDetails = () =>{
    
    const {market_id} = useParams();

    const {marketdata,setMarketdata} = useState(null);
    const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;


    useEffect(()=>{
        const fetchMarket = async ()=>{
            const res = await fetch(`${BACKEND_BASE_URL}/api/markets/${market_id}/summary`);
            const data = await res.json();
            setMarketdata(data);
        };
        fetchMarket();
    },[market_id]);

     const handlePlaceOrder = async (order) => {
    await fetch(`${BACKEND_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...order, market_id }),
    });
  };
    if(!marketdata) return <div> Loading </div>


    return (
        
       <div className="p-4 space-y-4">
      <WebSocketStatus />
      <EventHeader title="Sample Market Question?" deadline="2025-06-01T12:00:00Z" />
      <EventStats stats={marketdata} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PlaceOrderBox onPlaceOrder={handlePlaceOrder} />
        <OrderBook marketId={market_id} />
      </div>
      <MarketGraph />
      <TradeHistory marketId={market_id} />
    </div>
    )
}


export default EventDetails;
