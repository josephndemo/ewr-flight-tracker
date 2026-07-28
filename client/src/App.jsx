import React, { useEffect, useState } from 'react';
import FlightChart from './components/FlightChart';
import BusyHoursSummary from './components/BusyHoursSummary';
import DriverInsights from './components/DriverInsights';
import { RefreshCw, Car } from 'lucide-react';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ewr-hourly-flights');
      if (!response.ok) throw new Error('Failed to load server data');
      const json = await response.json();
      setData(json.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 mb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Car className="w-7 h-7 text-black" />
              <h1 className="text-2xl md:text-3xl font-black">EWR Driver Surge Radar</h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Hourly flight arrivals & departures at Newark Liberty International Airport
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {lastUpdated && (
              <span className="text-xs text-gray-400">Updated {lastUpdated}</span>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-200 text-sm">
            <strong>Error:</strong> {error}. Ensure your Node backend is running on port 5000 and valid OpenSky credentials are set.
          </div>
        )}

        {/* Content */}
        {loading && data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mb-2" />
            <p>Fetching real-time data from OpenSky Network...</p>
          </div>
        ) : (
          <>
            <BusyHoursSummary data={data} />
            <FlightChart data={data} />
            <DriverInsights />
          </>
        )}
      </div>
    </div>
  );
}