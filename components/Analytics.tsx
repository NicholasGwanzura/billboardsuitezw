
import React from 'react';
import { getInvoices, getExpenses, mockPrintingJobs, mockOutsourcedBillboards } from '../services/mockData';
import { 
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';

export const Analytics: React.FC = () => {
    // 1. Calculate Revenue
    const totalRevenue = getInvoices().reduce((acc, curr) => acc + curr.total, 0);
    
    // 2. Calculate Expenses
    const operationalExpenses = getExpenses().reduce((acc, curr) => acc + curr.amount, 0);
    const printingExpenses = mockPrintingJobs.reduce((acc, curr) => acc + curr.totalCost, 0);
    const outsourcedPayouts = mockOutsourcedBillboards.reduce((acc, curr) => acc + (curr.monthlyPayout * 12), 0); // Annualized for demo
    
    const totalExpenses = operationalExpenses + printingExpenses + outsourcedPayouts;
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = (netProfit / totalRevenue) * 100;

    const expenseBreakdown = [
        { name: 'Operational', value: operationalExpenses },
        { name: 'Printing', value: printingExpenses },
        { name: 'Outsourced', value: outsourcedPayouts },
    ];

    const monthlyData = [
        { month: 'Aug', revenue: 12000, profit: 4500 },
        { month: 'Sep', revenue: 15500, profit: 6200 },
        { month: 'Oct', revenue: 18000, profit: 7100 },
        { month: 'Nov', revenue: 22000, profit: 9800 },
        { month: 'Dec', revenue: 19500, profit: 8500 },
        { month: 'Jan', revenue: 24000, profit: 11200 },
    ];

    const COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 mb-2">Profit Analytics</h2>
                <p className="text-slate-500 font-medium">Deep dive into financial health, margins, and expense distribution</p>
            </div>

            {/* Scorecards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Revenue</p>
                    <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">${totalRevenue.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 w-fit px-2 py-1 rounded-full text-xs font-bold">
                        <TrendingUp size={14} /> +15% vs Last Year
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Expenses</p>
                    <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">${totalExpenses.toLocaleString()}</h3>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Includes payouts & production</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Net Profit</p>
                    <h3 className="text-4xl font-extrabold text-white tracking-tight">${netProfit.toLocaleString()}</h3>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-medium">Margin</span>
                        <span className="font-bold text-green-400">{profitMargin.toFixed(1)}%</span>
                    </div>
                </div>
            </div>

            {/* Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Profit Trend</h3>
                    <div className="h-72">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <defs>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Expense Distribution</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                <Pie 
                                    data={expenseBreakdown} 
                                    dataKey="value" 
                                    cx="50%" cy="50%" 
                                    innerRadius={60} 
                                    outerRadius={100} 
                                    paddingAngle={5}
                                >
                                    {expenseBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                             </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Reporting Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Monthly Performance Report</h3>
                    <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors uppercase tracking-wider">Download CSV</button>
                </div>
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Month</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider text-right">Revenue</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider text-right">Expenses</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider text-right">Net Profit</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider text-right">Margin</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {monthlyData.map((data, i) => (
                             <tr key={i} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-6 py-4 font-bold text-slate-800">{data.month}</td>
                                 <td className="px-6 py-4 text-right font-medium">${data.revenue.toLocaleString()}</td>
                                 <td className="px-6 py-4 text-right font-medium">${(data.revenue - data.profit).toLocaleString()}</td>
                                 <td className="px-6 py-4 text-right font-bold text-green-600">${data.profit.toLocaleString()}</td>
                                 <td className="px-6 py-4 text-right">{((data.profit/data.revenue)*100).toFixed(1)}%</td>
                             </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
