import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventHeader from "../components/EventHeader";
import EventStats from "../components/EventStats";
import OrderBook from "../components/OrderBook";
import PlaceOrderBox from "../components/PlaceOrderBox";
import MarketChart from "../components/MarketChart";
import TradeHistory from "../components/TraderHistory";
import WebSocketStatus from "../components/WebSocketStatus";


const EventDetails = () => {

  const { id: market_id } = useParams();

  const [marketdata, setMarketdata] = useState("");
  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  // Inside EventDetails
  const [bestYes, setBestYes] = useState(null);
  const [bestNo, setBestNo] = useState(null);
  const [totalYes, setTotalYes] = useState(0);
  const [totalNo, setTotalNo] = useState(0);



  useEffect(() => {
    const fetchMarket = async () => {
      const res = await fetch(`${BACKEND_BASE_URL}/api/markets/${market_id}/summary`);
      const data = await res.json();
      setMarketdata(data);
      console.log(data);


    };
    fetchMarket();
  }, [market_id]);


  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000');

    socket.onopen = () => {
      socket.send(JSON.stringify({ action: 'subscribe', market_id: Number(market_id) }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Printing Data ", data);

      if (data.type === 'orderbookUpdate' && data.market_id === Number(market_id)) {
        const yesOrders = data.order.filter(o => o.side === 'yes');
        const noOrders = data.order.filter(o => o.side === 'no');

        const bestYes = yesOrders.length ? Math.max(...yesOrders.map(o => o.price)) : 0;
        const bestNo = noOrders.length ? Math.min(...noOrders.map(o => o.price)) : 0;
        const totalYes = yesOrders.reduce((sum, o) => sum + o.amount, 0);
        const totalNo = noOrders.reduce((sum, o) => sum + o.amount, 0);

        setBestYes(data.best_yes);
        setBestNo(data.best_no);
        setTotalYes(totalYes);
        setTotalNo(totalNo);
      }
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action: 'unsubscribe', market_id: Number(market_id) }));
      }
      socket.close();
    };
  }, [market_id]);

  //handling placed order
  const handlePlaceOrder = async (order) => {
    const res = await fetch(`${BACKEND_BASE_URL}/api/orders/place`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...order, market_id }),
    });

    const data = await res.json();
    console.log("Order Placed Response:", data); // ← Add this
    return data;
  };
  if (!marketdata) return <div> Loading </div>
  const dummyChartData = [
    { time: '10:00', price: 45 },
    { time: '11:00', price: 50 },
    { time: '12:00', price: 48 },
  ];

  return (

    <div className="p-4 space-y-4">
      <WebSocketStatus />
      <EventHeader question={marketdata.question} deadline={marketdata.deadline} />
      <EventStats stats={marketdata} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PlaceOrderBox onPlaceOrder={handlePlaceOrder} />
        <OrderBook
          bestYes={bestYes}
          bestNo={bestNo}
          totalYes={totalYes}
          totalNo={totalNo}
        />

      </div>
      <MarketChart data={dummyChartData} />
      <TradeHistory marketId={market_id} />
    </div>
  )
}


export default EventDetails;
