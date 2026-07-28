import React from 'react';
import { Flame, PlaneLanding, PlaneTakeoff } from 'lucide-react';

export default function BusyHoursSummary({ data }) {
  if (!data || data.length === 0) return null;

  // Top 3 peak arrival hours (Highest Uber pickup potential)
  const sortedArrivals = [...data].sort((a, b) => b.arrivals - a.arrivals).slice(0, 3);
  
  // Highest overall traffic
  const peakHour = [...data].sort((a, b) => b.total - a.total)[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-600 text-white p-5 rounded-xl shadow-sm">
        <div className="flex items-center space-x-2 opacity-90 mb-1">
          <PlaneLanding className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Top Pickup Window</span>
        </div>
        <div className="text-2xl font-black">
          {sortedArrivals[0]?.hour} - {sortedArrivals[0]?.hourNum + 1}:00
        </div>
        <p className="text-xs text-blue-100 mt-1">
          {sortedArrivals[0]?.arrivals} incoming flights landing in this window.
        </p>
      </div>

      <div className="bg-amber-500 text-white p-5 rounded-xl shadow-sm">
        <div className="flex items-center space-x-2 opacity-90 mb-1">
          <Flame className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Overall Peak Hour</span>
        </div>
        <div className="text-2xl font-black">
          {peakHour?.hour}
        </div>
        <p className="text-xs text-amber-100 mt-1">
          {peakHour?.total} combined arrivals and departures.
        </p>
      </div>

      <div className="bg-slate-800 text-white p-5 rounded-xl shadow-sm">
        <div className="flex items-center space-x-2 opacity-90 mb-1">
          <PlaneTakeoff className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Top Drop-off Window</span>
        </div>
        <div className="text-2xl font-black">
          {[...data].sort((a, b) => b.departures - a.departures)[0]?.hour}
        </div>
        <p className="text-xs text-slate-300 mt-1">
          High demand for trips originating in NYC/NJ heading to EWR.
        </p>
      </div>
    </div>
  );
}