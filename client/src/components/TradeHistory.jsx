const TradeHistory = ({ trades }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4 my-4">
      <h2 className="text-md font-semibold mb-2">Recent Trades</h2>
      <div className="max-h-64 overflow-y-auto">
        {trades?.length > 0 ? (
          <ul className="space-y-2">
            {trades.map((trade, index) => (
              <li key={index} className="flex justify-between text-sm text-gray-700">
                <span>{trade.side.toUpperCase()}</span>
                <span>₹{trade.price}</span>
                <span>{trade.amount} units</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No trades yet.</p>
        )}
      </div>
    </div>
  );
};

export default TradeHistory;
