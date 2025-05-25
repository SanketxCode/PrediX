import { useState } from "react";

const PlaceOrderBox = ({ onPlaceOrder }) => {
  const [side, setSide] = useState("yes");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!price || amount) return;

    onPlaceOrder({
      side,
      price: parseFloat(price),
      amount: parseFloat(amount),
    });
    setPrice("");
    setAmount("");
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl my-4">
      <h2 className="text-md font-semibold mb-2">Place Order</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <select value={side} onChange={(e) => setSide(e.target.value)} className="w-full p-2 border rounded"
>
          <option value="yes">YES (BUY)</option>
          <option value="no">NO (SELL)</option>
        </select>

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
           className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
           className="w-full p-2 border rounded"
        />
        <button type="submit"  className="w-full bg-blue-600 text-white py-2 rounded">Submit Order</button>
      </form>
    </div>
  );
};

export default PlaceOrderBox;