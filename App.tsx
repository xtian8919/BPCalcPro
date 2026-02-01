
import React, { useState } from 'react';
import { UserInput, Gender, AnalysisResult, BPStatus, HRStatus } from './types';
import { analyzeHealthData } from './services/geminiService';
import { BP_RANGES } from './constants';
import { BloodPressureChart, HeartRateChart } from './components/Charts';

const App: React.FC = () => {
  const [formData, setFormData] = useState<UserInput>({
    age: 30,
    gender: Gender.MALE,
    systolic: 120,
    diastolic: 80,
    heartRate: 72
  });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gender' ? value : Number(value)
    }));
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzeHealthData(formData);
      setResult(analysis);
    } catch (err) {
      setError("An error occurred during analysis. Please check your internet connection and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      age: 30,
      gender: Gender.MALE,
      systolic: 120,
      diastolic: 80,
      heartRate: 72
    });
    setResult(null);
    setError(null);
  };

  const getStatusConfig = (status: BPStatus) => {
    return BP_RANGES.find(r => r.status === status) || BP_RANGES[0];
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
          Blood Pressure <span className="text-red-600">Analyzer</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get professional insights into your cardiovascular health using our AI-driven diagnostic tool.
        </p>
      </header>

      {/* Main Interface: Form & Current Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Input Column */}
        <section className="lg:col-span-5">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Input Data
            </h2>
            <form onSubmit={handleCalculate} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Age</label>
                  <input
                    type="number"
                    name="age"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 transition-all font-semibold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 transition-all font-semibold appearance-none"
                  >
                    <option value={Gender.MALE}>Male</option>
                    <option value={Gender.FEMALE}>Female</option>
                    <option value={Gender.OTHER}>Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Systolic BP (Upper)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="systolic"
                    min="40"
                    max="300"
                    value={formData.systolic}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 transition-all font-semibold"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">mmHg</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Diastolic BP (Lower)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="diastolic"
                    min="40"
                    max="200"
                    value={formData.diastolic}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 transition-all font-semibold"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">mmHg</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Heart Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    name="heartRate"
                    min="30"
                    max="250"
                    value={formData.heartRate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 transition-all font-semibold"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">BPM</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-black text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:shadow-red-200'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : 'CALCULATE ANALYSIS'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-3 rounded-xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-all"
                >
                  RESET FORM
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Results Column */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {!result && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-500 mb-2">Ready to Analyze</h3>
              <p className="text-sm max-w-xs mx-auto leading-relaxed">Fill in your measurements on the left to get a detailed health breakdown and AI-generated advice.</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-red-50 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing Health Data</h3>
              <p className="text-gray-500 animate-pulse">Consulting Gemini AI Medical Analysis Engine...</p>
            </div>
          )}

          {error && (
            <div className="p-8 bg-red-50 text-red-700 rounded-3xl border border-red-200 shadow-inner">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className="font-black uppercase tracking-tight">Analysis Error</h3>
              </div>
              <p className="font-medium">{error}</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* BP Main Status Card */}
              <div className={`p-8 rounded-3xl shadow-xl border-t-8 bg-white ${getStatusConfig(result.bpStatus as BPStatus).border}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-1 block">Blood Pressure Level</span>
                    <h2 className={`text-3xl font-black ${getStatusConfig(result.bpStatus as BPStatus).color}`}>{result.bpStatus}</h2>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 rounded-2xl text-center min-w-[140px] border border-gray-100">
                    <p className="text-4xl font-black text-gray-900 leading-none">{formData.systolic}/{formData.diastolic}</p>
                    <p className="text-xs font-bold text-gray-400 mt-2 uppercase">mmHg</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Understanding Your Reading
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-medium">{result.explanation}</p>
                  </div>

                  <div>
                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Recommended Actions</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {result.advice.map((item, idx) => (
                         <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-red-100 transition-colors">
                           <div className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                             <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                           </div>
                           <span className="text-sm font-semibold text-gray-700">{item}</span>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              </div>

              {/* Heart Rate Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-100 flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    result.hrStatus === HRStatus.NORMAL ? 'bg-green-50 text-green-500' : 
                    result.hrStatus === HRStatus.TACHYCARDIA ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Heart Rate</h2>
                    <div className="flex items-baseline gap-1">
                      <p className="text-3xl font-black text-gray-900">{formData.heartRate}</p>
                      <p className="text-sm font-bold text-gray-400 uppercase">BPM</p>
                    </div>
                    <p className={`text-xs font-black uppercase mt-1 tracking-wider ${
                      result.hrStatus === HRStatus.NORMAL ? 'text-green-600' : 
                      result.hrStatus === HRStatus.TACHYCARDIA ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {result.hrStatus} Range
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-100 flex items-center gap-5">
                   <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Profile</h2>
                    <p className="text-xl font-black text-gray-800">{formData.age} Year Old</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{formData.gender}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Visualizations Section: Below the Interface */}
      <div className="border-t border-gray-200 pt-16">
        <header className="mb-10">
           <h2 className="text-3xl font-black text-gray-900 mb-2">Health Analytics Visualization</h2>
           <p className="text-gray-500">Visual breakdown of your cardiovascular metrics against medical standard benchmarks.</p>
        </header>

        <section className="flex flex-col gap-10">
          <BloodPressureChart 
            currentSys={result ? formData.systolic : undefined} 
            currentDia={result ? formData.diastolic : undefined} 
          />
          <HeartRateChart 
            currentHR={result ? formData.heartRate : undefined} 
          />
        </section>
      </div>

      <footer className="mt-20 pb-12 text-center">
        <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-3xl mb-8">
           <p className="text-xs text-gray-500 leading-relaxed italic">
            <strong>Medical Disclaimer:</strong> This application utilizes artificial intelligence to provide general information based on standard guidelines. It is not a clinical tool and does not provide professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions regarding a medical condition.
           </p>
        </div>
        <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">© {new Date().getFullYear()} Blood Pressure Calculator Pro</p>
        <p className="text-xs text-gray-400 mt-2">Powered by Google Gemini-3-Flash</p>
      </footer>
    </div>
  );
};

export default App;
