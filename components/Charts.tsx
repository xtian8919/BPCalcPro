
import React from 'react';
import { BP_CHART_REFERENCE, HR_CHART_REFERENCE, BP_RANGES } from '../constants';
import { BPStatus } from '../types';

interface ChartProps {
  currentSys?: number;
  currentDia?: number;
  currentHR?: number;
}

export const BloodPressureChart: React.FC<ChartProps> = ({ currentSys, currentDia }) => {
  // Logic to determine which row is active
  const getActiveCategory = () => {
    if (!currentSys || !currentDia) return null;
    if (currentSys >= 180 || currentDia >= 120) return 'Crisis';
    if (currentSys >= 140 || currentDia >= 90) return 'Stage 2';
    if (currentSys >= 130 || currentDia >= 80) return 'Stage 1';
    if (currentSys >= 120 && currentDia < 80) return 'Elevated';
    if (currentSys < 120 && currentDia < 80) return 'Normal';
    return 'Low';
  };

  const activeCategory = getActiveCategory();

  return (
    <div className="w-full bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-black text-gray-800">Blood Pressure Reference</h3>
        <p className="text-sm text-gray-500">Standard AHA/ACC Medical Classifications</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-widest">Systolic</th>
              <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-widest">Diastolic</th>
              <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {BP_CHART_REFERENCE.map((row) => {
              const isActive = activeCategory === row.category;
              return (
                <tr 
                  key={row.category} 
                  className={`transition-all duration-300 ${isActive ? 'bg-gray-50 scale-[1.01] shadow-inner' : 'hover:bg-gray-50/50'}`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded-full" style={{ backgroundColor: row.fill }}></div>
                      <span className={`font-bold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>{row.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-500">
                    {row.category === 'Crisis' ? '> 180' : row.category === 'Low' ? '< 90' : `< ${row.sys + 5}`}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-500">
                    {row.category === 'Crisis' ? '> 120' : row.category === 'Low' ? '< 60' : `< ${row.dia + 5}`}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {isActive ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-600 text-[10px] font-black text-white animate-pulse">
                        YOUR READING
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-300">REFERENCE</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-blue-700 leading-relaxed font-medium">
          If your systolic and diastolic numbers fall into different categories, the higher category should be used to classify your blood pressure.
        </p>
      </div>
    </div>
  );
};

export const HeartRateChart: React.FC<ChartProps> = ({ currentHR }) => {
  const getHRZone = () => {
    if (!currentHR) return null;
    if (currentHR < 60) return 'Sleep';
    if (currentHR <= 80) return 'Resting';
    if (currentHR <= 120) return 'Walking';
    if (currentHR <= 160) return 'Exercise';
    return 'Peak';
  };

  const activeZone = getHRZone();

  return (
    <div className="w-full bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-black text-gray-800">Heart Rate Zones</h3>
        <p className="text-sm text-gray-500">BPM ranges by physical activity level</p>
      </div>

      <div className="space-y-3">
        {HR_CHART_REFERENCE.map((zone) => {
          const isActive = activeZone === zone.category;
          return (
            <div 
              key={zone.category}
              className={`p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between ${
                isActive 
                ? 'bg-blue-600 border-blue-600 shadow-lg translate-x-1' 
                : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-400'
                  }`}
                  style={!isActive ? { borderLeft: `4px solid ${zone.fill}` } : {}}
                >
                  {zone.category[0]}
                </div>
                <div>
                  <h4 className={`font-bold ${isActive ? 'text-white' : 'text-gray-800'}`}>{zone.category}</h4>
                  <p className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>Target Range</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-xl font-black ${isActive ? 'text-white' : 'text-gray-700'}`}>
                   {zone.bpm} <span className="text-[10px] uppercase opacity-60">BPM</span>
                </p>
                {isActive && (
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                    <span className="text-[9px] font-black text-white tracking-widest">ACTIVE ZONE</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
