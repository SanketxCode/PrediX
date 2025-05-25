const TradeHistory = ({ltp,totalVolume}) => {
 

    return (

         <div className="p-4 bg-white shadow rounded-xl my-4">
      <h2 className="text-md font-semibold mb-2">Recent Trades</h2>
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-gray-500">Last Traded Price (LTP)</p>
          <p className="font-bold text-blue-600">{ltp ?? '—'}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Volume</p>
          <p className="font-bold text-blue-600">{totalVolume}</p>
        </div>
      </div>
    </div>
    )
}

export default TradeHistory;