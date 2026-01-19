
import React, { useMemo } from 'react';
import { CalculatorState } from '../types';
import { calculateROI } from '../utils/calculations';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area, CartesianGrid
} from 'recharts';
import * as Icons from 'lucide-react';

interface Props {
  state: CalculatorState;
  onReset: () => void;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
};

const COLORS = ['#3348F6', '#32D9F6', '#1E17BA', '#B796FF', '#ECEEFF', '#DEE5FF'];

const Dashboard: React.FC<Props> = ({ state, onReset }) => {
  const results = useMemo(() => calculateROI(state), [state]);

  return (
    <div className="space-y-8 animate-fade-in pb-20 font-sans">
      
      {/* Hero Header */}
      <div className="text-center py-8 relative">
        <h2 className="text-xs font-bold text-accent tracking-widest uppercase mb-2">Risultato per {state.lead.companyName || 'la tua azienda'}</h2>
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6">
          {formatCurrency(results.totalAnnualSavings)}
        </h1>
        <p className="text-xl font-normal text-gray-400">Risparmio annuale stimato</p>
        <p className="text-sm font-light text-gray-500 mt-2">Un report completo è stato inviato a <span className="text-white font-medium">{state.lead.email}</span></p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-bg-card border border-white/10 p-5 rounded-xl flex flex-col gap-4 hover:border-primary/50 transition-colors group">
          <div className="flex justify-between items-start">
             <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Ore Risparmiate</span>
             <Icons.Clock className="text-primary group-hover:scale-110 transition-transform" size={20} />
          </div>
          <div className="mt-auto">
             <span className="text-3xl font-bold text-white block">{Math.round(results.totalAnnualHours).toLocaleString('it-IT')} h</span>
             <span className="text-xs font-light text-gray-500">su base annua</span>
          </div>
        </div>

        <div className="bg-bg-card border border-white/10 p-5 rounded-xl flex flex-col gap-4 hover:border-accent/50 transition-colors group">
          <div className="flex justify-between items-start">
             <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">FTE Equivalenti</span>
             <Icons.Users className="text-accent group-hover:scale-110 transition-transform" size={20} />
          </div>
           <div className="mt-auto">
             <span className="text-3xl font-bold text-white block">{results.fteEquivalent.toFixed(1)}</span>
             <span className="text-xs font-light text-gray-500">Collaboratori full-time</span>
           </div>
        </div>

        <div className="bg-bg-card border border-white/10 p-5 rounded-xl flex flex-col gap-4 hover:border-primary/50 transition-colors group">
          <div className="flex justify-between items-start">
             <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Break-Even Point</span>
             <Icons.TrendingUp className="text-primary group-hover:scale-110 transition-transform" size={20} />
          </div>
          <div className="mt-auto">
             <span className="text-3xl font-bold text-white block">{results.roiMonths > 0 ? `${results.roiMonths} mesi` : '< 1 mese'}</span>
             <span className="text-xs font-light text-gray-500">Recupero investimento</span>
          </div>
        </div>

        <div className="bg-bg-card border border-white/10 p-5 rounded-xl flex flex-col gap-4 hover:border-accent/50 transition-colors group">
          <div className="flex justify-between items-start">
             <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">ROI (3 Anni)</span>
             <Icons.Rocket className="text-accent group-hover:scale-110 transition-transform" size={20} />
          </div>
          <div className="mt-auto">
            <span className="text-3xl font-bold text-accent block">+{Math.round(results.roi3YearPct)}%</span>
            <span className="text-xs font-light text-gray-500">Ritorno atteso</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Department Savings Pie */}
        <div className="glass-panel rounded-2xl p-6 h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Risparmio per Reparto</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={results.savingsByDept}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {results.savingsByDept.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#101214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'Poppins' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline Area */}
        <div className="glass-panel rounded-2xl p-6 h-[400px]">
           <h3 className="text-lg font-bold text-white mb-6">Proiezione Cumulativa (36 mesi)</h3>
           <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={results.timelineData}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#32D9F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#32D9F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3348F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3348F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#666" style={{ fontSize: '12px', fontFamily: 'Poppins' }} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#101214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'Poppins' }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Area type="monotone" dataKey="cumulativeSavings" name="Risparmio Cumulativo" stroke="#32D9F6" fillOpacity={1} fill="url(#colorSavings)" />
              <Area type="monotone" dataKey="cost" name="Costo Cumulativo" stroke="#3348F6" fillOpacity={1} fill="url(#colorCost)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Top Processes Table/Bar */}
       <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Top 5 Processi per Impatto</h3>
          <div className="space-y-4">
             {results.topProcesses.slice(0, 5).map((proc, idx) => (
                <div key={idx} className="relative pt-1">
                   <div className="flex mb-2 items-center justify-between">
                     <div>
                       <span className="text-xs font-bold inline-block text-accent uppercase">
                         {proc.name}
                       </span>
                     </div>
                     <div className="text-right">
                       <span className="text-xs font-bold inline-block text-white">
                         {formatCurrency(proc.savings)}
                       </span>
                     </div>
                   </div>
                   <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-bg-dark border border-white/5">
                     <div style={{ width: `${(proc.savings / results.topProcesses[0].savings) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary to-accent transition-all duration-1000"></div>
                   </div>
                </div>
             ))}
          </div>
       </div>

      <div className="flex justify-center pt-8">
        <button 
            onClick={onReset}
            className="px-8 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-colors"
        >
            Ricalcola Nuova Simulazione
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
