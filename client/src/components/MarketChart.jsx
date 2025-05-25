import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MarketChart  = ({data})  =>{
    return (
    <div className="p-4 bg-white shadow rounded-xl my-4">
      <h2 className="text-md font-semibold mb-2">Price Movement</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    )
}

export default MarketChart;