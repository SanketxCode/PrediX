const EventStats = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow mb-4">
      <Stat label="Total Yes" value={summary.total_yes} />
      <Stat label="Total No" value={summary.total_no} />
      <Stat label="Best Buy" value={summary.bestYes} />
      <Stat label="Best Sell" value={summary.bestNo} />
      <Stat label="LTP" value={summary.ltp} />
      <Stat label="Total Volume" value={summary.totalVolume} />
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="text-center">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="font-semibold text-md">{value ?? '-'}</div>
  </div>
);

export default EventStats;
