import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function FlightChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">24-Hour Flight Traffic (EWR)</h2>
        <p className="text-sm text-gray-500">
          Arrivals generate immediate terminal pickup demand for drivers.
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', color: '#FFF', borderRadius: '8px' }}
              itemStyle={{ color: '#FFF' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="arrivals" name="Arrivals (Pickups)" fill="#2563EB" radius={[4, 4, 0, 0]} />
            <Bar dataKey="departures" name="Departures (Drop-offs)" fill="#93C5FD" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}