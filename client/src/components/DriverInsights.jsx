import React from 'react';
import { Compass, Clock, ShieldAlert } from 'lucide-react';

export default function DriverInsights() {
  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-xl mt-6 shadow-md">
      <h3 className="text-lg font-bold mb-3 flex items-center text-amber-400">
        <Compass className="w-5 h-5 mr-2" />
        EWR Uber Driver Pro-Tips
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
        <div className="flex items-start space-x-3 bg-slate-800 p-3 rounded-lg">
          <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Staging Lot Strategy:</span>
            <p className="text-xs mt-0.5">Position yourself in the EWR Cell Phone / Rideshare Staging Lot 15-20 minutes prior to a major arrival peak window.</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 bg-slate-800 p-3 rounded-lg">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Baggage Delay Factor:</span>
            <p className="text-xs mt-0.5">Passenger demand peaks 20-30 minutes after flight touchdown due to deplaning and baggage claim wait times.</p>
          </div>
        </div>
      </div>
    </div>
  );
}