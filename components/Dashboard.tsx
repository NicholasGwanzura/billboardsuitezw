

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend, ComposedChart, Line
} from 'recharts';
import { DollarSign, FileText, Activity, Users, Sparkles, TrendingUp, TrendingDown, Bell, AlertTriangle, Clock, Calendar, Search, ArrowRight, BrainCircuit } from 'lucide-react';
import { getContracts, getInvoices, getBillboards, getClients, getExpiringContracts, getOverdueInvoices, getUpcomingBillings, getFinancialTrends } from '../services/mockData';
import { BillboardType } from '../types';
import { analyzeBusinessData } from '../services/aiService';

export const Dashboard: React.FC = () => {
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Live Data
  const contracts = getContracts();
  const invoices = getInvoices();
  const billboards = getBillboards();
  const clients = getClients();

  // Notification Data
  const expiringContracts = getExpiringContracts();
  const overdueInvoices = getOverdueInvoices();
  // Get only first 3 upcoming
  const upcomingBillings = getUpcomingBillings().slice(0, 3);
  const financialTrends = getFinancialTrends();

  const totalRevenue = invoices.filter(i => i.type === 'Invoice').reduce((acc, curr) => acc + curr.total, 0);
  const activeContracts = contracts.filter(c => c.status === 'Active').length;
  
  const ledBillboards = billboards.filter(b => b.type === BillboardType.LED);
  const totalLedSlots = ledBillboards.reduce((acc, b) => acc + (b.totalSlots || 0), 0);
  const rentedLedSlots = ledBillboards.reduce((acc, b) => acc + (b.rentedSlots || 0), 0);
  
  const staticBillboards = billboards.filter(b => b.type === BillboardType.Static);
  const totalStaticSides = staticBillboards.length * 2;
  const rentedStaticSides = staticBillboards.reduce((acc, b) => {
    let count = 0;
    if (b.sideAStatus === 'Rented') count++;
    if (b.sideBStatus === 'Rented') count++;
    return acc + count;
  }, 0);

  const occupancyRate = Math.round(((rentedLedSlots + rentedStaticSides) / (totalLedSlots + totalStaticSides)) * 100) || 0;

  // Occupancy Data (Donut Chart)
  const occupancyData = [
    { name: 'Occupied', value: rentedLedSlots + rentedStaticSides },
    { name: 'Available', value: (totalLedSlots + totalStaticSides) - (rentedLedSlots + rentedStaticSides) },
  ];
  const OCCUPANCY_COLORS = ['#6366f1', '#e2e8f0'];

  // Top Clients Data
  const topClientsData = clients.map(client => {
      const clientRevenue = invoices
        .filter(i => i.clientId === client.id && i.type === 'Invoice')
        .reduce((acc, curr) => acc + curr.total, 0);
      return { name: client.companyName, value: clientRevenue };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  // Revenue by Town
  const revenueByTownData = billboards.reduce((acc: any[], curr) => {
      const billboardContracts = contracts.filter(c => c.billboardId === curr.id && c.status === 'Active');
      const revenue = billboardContracts.reduce((sum, c) => sum + c.totalContractValue, 0);
      
      const existing = acc.find(item => item.name === curr.town);
      if (existing) {
          existing.value += revenue;
      } else {
          acc.push({ name: curr.town, value: revenue });
      }
      return acc;
  }, []).sort((a: any, b: any) => b.value - a.value).slice(0, 5);

  const handleAskAI = async (e?: React.FormEvent) => {
      if(e) e.preventDefault();
      if(!aiQuery) return;
      
      setLoadingAi(true);
      const context = `
        Current Revenue: $${totalRevenue}. 
        Occupancy Rate: ${occupancyRate}%. 
        Active Contracts: ${activeContracts}. 
        Expiring Contracts (Next 30 days): ${expiringContracts.length}. 
        Overdue Invoices: ${overdueInvoices.length}. 
        Top Client: ${topClientsData[0]?.name || 'N/A'}. 
        Top Town by Revenue: ${revenueByTownData[0]?.name || 'N/A'}.
        User Question: ${aiQuery}
      `;
      const result = await analyzeBusinessData(context);
      setAiResponse(result);
      setLoadingAi(false);
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.companyName || 'Unknown';

  return (
    <div className="space-y-8 animate-fade-in pb-12 flex flex-col lg:flex-row gap-8">
      {/* Main Content Area */}
      <div className="flex-1 space-y-8 min-w-0">
        
        {/* AI Analyst Section */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><BrainCircuit size={24} className="text-indigo-300"/></div>
                    <h2 className="text-2xl font-bold">Spiritus AI Analyst</h2>
                </div>
                <p className="text-indigo-200 mb-6 max-w-xl">Ask questions about your fleet performance, financial health, or get predictive insights instantly.</p>
                
                <form onSubmit={handleAskAI} className="relative max-w-2xl">
                    <input 
                        type="text" 
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        placeholder="Ex: How can I improve occupancy in Harare?" 
                        className="w-full pl-6 pr-14 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-indigo-300/50 backdrop-blur-md focus:outline-none focus:bg-white/20 transition-all"
                    />
                    <button type="submit" disabled={loadingAi} className="absolute right-2 top-2 p-2 bg-white text-indigo-900 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-70">
                        {loadingAi ? <Sparkles size={20} className="animate-spin"/> : <ArrowRight size={20} />}
                    </button>
                </form>

                {aiResponse && (
                    <div className="mt-6 p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md animate-fade-in">
                        <div className="flex items-start gap-3">
                            <Sparkles size={18} className="text-yellow-300 mt-1 shrink-0"/>
                            <p className="text-sm leading-relaxed text-indigo-50">{aiResponse}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                <TrendingUp size={12}/> +12%
              </span>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Revenue</p>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">${totalRevenue.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">Active</span>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Contracts</p>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{activeContracts}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                {rentedLedSlots + rentedStaticSides} / {totalLedSlots + totalStaticSides}
              </span>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Occupancy</p>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{occupancyRate}%</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                <TrendingUp size={12}/> +2
              </span>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Clients</p>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{clients.length}</h3>
            </div>
          </div>
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Financial Performance & Forecast</h3>
                    <p className="text-xs text-slate-400">Actual revenue vs expenses with AI projection</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-900"></span> Revenue</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> Profit Margin</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-200"></span> Expenses</div>
                </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={financialTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="revenue" barSize={20} fill="#0f172a" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar dataKey="expenses" barSize={20} fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Expenses" />
                  <Line type="monotone" dataKey="margin" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} name="Net Margin" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Revenue by Town (Horizontal Bar) */}
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Top Performing Locations</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueByTownData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} width={80} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px' }}/>
                            <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             </div>

             {/* Occupancy Gauge (Donut) */}
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Inventory Occupancy</h3>
                <div className="h-64 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={occupancyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={10}
                        >
                        {occupancyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={OCCUPANCY_COLORS[index % OCCUPANCY_COLORS.length]} />
                        ))}
                        </Pie>
                        <Legend iconType="circle" verticalAlign="bottom" height={36}/>
                    </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                        <span className="text-4xl font-extrabold text-slate-900">{occupancyRate}%</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Occupied</span>
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* Sidebar / Notification Area */}
      <div className="w-full lg:w-80 space-y-6 min-w-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold uppercase tracking-wide text-xs">
                 <Bell size={16} className="text-slate-400" /> Recent Alerts
             </div>
             
             <div className="space-y-4">
                 {/* Upcoming Collections Widget */}
                 {upcomingBillings.length > 0 && (
                     <div className="mb-6 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar size={14} className="text-indigo-500" />
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Upcoming Collections</h4>
                        </div>
                        <div className="space-y-3">
                            {upcomingBillings.map((bill, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-indigo-50/50 rounded-xl border border-indigo-50">
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate">{bill.clientName}</p>
                                        <p className="text-[10px] text-slate-500">Due: {bill.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-indigo-700">${bill.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                 )}

                 {/* Expiring Contracts */}
                 {expiringContracts.length > 0 ? (
                    expiringContracts.map(c => (
                        <div key={c.id} className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 hover:bg-amber-50 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-white rounded-lg text-amber-500 shadow-sm mt-0.5 border border-amber-100">
                                    <Clock size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">Expiring Soon</h4>
                                    <p className="text-sm font-bold text-slate-800 mt-0.5">{getClientName(c.clientId)}</p>
                                    <p className="text-xs text-slate-500">Ends {c.endDate}</p>
                                </div>
                            </div>
                        </div>
                    ))
                 ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs text-slate-400">
                        No contracts expiring soon.
                    </div>
                 )}

                 {/* Overdue Invoices */}
                 {overdueInvoices.length > 0 ? (
                    overdueInvoices.slice(0, 3).map(inv => (
                        <div key={inv.id} className="p-4 bg-red-50/50 rounded-xl border border-red-100 hover:bg-red-50 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-white rounded-lg text-red-500 shadow-sm mt-0.5 border border-red-100">
                                    <AlertTriangle size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-red-800 uppercase tracking-wide">Pending Payment</h4>
                                    <p className="text-sm font-bold text-slate-800 mt-0.5">{getClientName(inv.clientId)}</p>
                                    <p className="text-xs text-slate-500">${inv.total.toLocaleString()} (Inv #{inv.id})</p>
                                </div>
                            </div>
                        </div>
                    ))
                 ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs text-slate-400">
                        No pending invoices.
                    </div>
                 )}
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Top Revenue Sources</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topClientsData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#0f172a" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
      </div>
    </div>
  );
};