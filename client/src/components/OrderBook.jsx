const OrderBook  = ({bestYes ,bestNo , totalYes, totalNo}) =>{

    return(
         <div className="p-4 bg-white shadow rounded-xl my-4">
      <h2 className="text-md font-semibold mb-2">Order Book</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="font-medium text-green-700">Best YES: {bestYes ?? '—'}</p>
          <p className="text-gray-500">Total YES: {totalYes}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="font-medium text-red-700">Best NO: {bestNo ?? '—'}</p>
          <p className="text-gray-500">Total NO: {totalNo}</p>
        </div>
      </div>
    </div>
    );
}


export default OrderBook;