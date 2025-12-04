
import React, { useState } from 'react';
import { getMaintenanceRecords, addMaintenanceRecord, getBillboards } from '../services/mockData';
import { MaintenanceRecord } from '../types';
import { Wrench, CheckCircle, AlertTriangle, Calendar, Plus, X, Search, Activity, Save } from 'lucide-react';

const PremiumInput = ({ label, value, onChange, type = "text", required = false, placeholder = "" }: any) => (
  <div className="group relative">
    <input 
      type={type} 
      required={required} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder || " "} 
      className="peer w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 pt-5 pb-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder-transparent font-medium" 
    />
    <label className="absolute left-4 top-1 text-[10px] uppercase tracking-wider text-slate-400 font-bold transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-medium peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-brand-600 peer-focus:font-bold pointer-events-none">
      {label}
    </label>
  </div>
);

const PremiumSelect = ({ label, value, onChange, options }: any) => (
  <div className="group relative">
    <select 
      value={value} 
      onChange={onChange} 
      className="peer w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 pt-5 pb-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer font-medium"
    >
      {options.map((opt: any) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
    </select>
    <label className="absolute left-4 top-1 text-[10px] uppercase tracking-wider text-slate-400 font-bold transition-all pointer-events-none">
      {label}
    </label>
  </div>
);

export const Maintenance: React.FC = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>(getMaintenanceRecords());
  const [billboards] = useState(getBillboards());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newRecord, setNewRecord] = useState<Partial<MaintenanceRecord>>({
    billboardId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Bolt Check',
    technician: '',
    notes: '',
    cost: 0,
    status: 'Completed'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.billboardId) return;

    const record: MaintenanceRecord = {
        id: `MNT-${Date.now()}`,
        billboardId: newRecord.billboardId!,
        date: newRecord.date!,
        type: newRecord.type as any,
        technician: newRecord.technician || 'Unknown',
        notes: newRecord.notes || '',
        cost: newRecord.cost || 0,
        status: newRecord.status as any
    };

    addMaintenanceRecord(record);
    setRecords(getMaintenanceRecords());
    setIsModalOpen(false);
    setNewRecord({
        billboardId: '',
        date: new Date().toISOString().split('T')[0],
        type: 'Bolt Check',
        technician: '',
        notes: '',
        cost: 0,
        status: 'Completed'
    });
  };

  const getMaintenanceStatus = (lastDate?: string) => {
      if (!lastDate) return { status: 'Critical', color: 'red', label: 'Never Checked' };
      
      const today = new Date();
      const lastCheck = new Date(lastDate);
      const diffTime = Math.abs(today.getTime() - lastCheck.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 120) return { status: 'Critical', color: 'red', label: `${diffDays} days ago` };
      if (diffDays > 90) return { status: 'Warning', color: 'amber', label: `${diffDays} days ago` };
      return { status: 'Healthy', color: 'emerald', label: `${diffDays} days ago` };
  };

  const getBillboardName = (id: string) => billboards.find(b => b.id === id)?.name || 'Unknown Asset';

  const filteredRecords = records.filter(r => 
      getBillboardName(r.billboardId).toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-brand-700 to-accent-600 mb-2">
            Maintenance & Safety
          </h2>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Activity size={16} className="text-emerald-500" />
            Track structural integrity, bolt checks, and repairs
          </p>
        </div>
        
        <div className="flex gap-4">
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:shadow-lg hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
                <Plus size={18} /> Log Maintenance
            </button>
        </div>
      </div>

      {/* Fleet Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-50 rounded-2xl text-red-600"><AlertTriangle size={24}/></div>
                  <div>
                      <h4 className="font-bold text-slate-800">Critical Attention</h4>
                      <p className="text-xs text-slate-500">Overdue > 4 Months</p>
                  </div>
              </div>
              <div className="text-3xl font-black text-slate-900">
                  {billboards.filter(b => getMaintenanceStatus(b.lastMaintenanceDate).status === 'Critical').length}
                  <span className="text-sm font-medium text-slate-400 ml-2">assets</span>
              </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-amber-50 rounded-2xl text-amber-600"><Wrench size={24}/></div>
                  <div>
                      <h4 className="font-bold text-slate-800">Due Soon</h4>
                      <p className="text-xs text-slate-500">Check within 30 days</p>
                  </div>
              </div>
              <div className="text-3xl font-black text-slate-900">
                  {billboards.filter(b => getMaintenanceStatus(b.lastMaintenanceDate).status === 'Warning').length}
                  <span className="text-sm font-medium text-slate-400 ml-2">assets</span>
              </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><CheckCircle size={24}/></div>
                  <div>
                      <h4 className="font-bold text-slate-800">Healthy Fleet</h4>
                      <p className="text-xs text-slate-500">Checked recently</p>
                  </div>
              </div>
              <div className="text-3xl font-black text-slate-900">
                  {billboards.filter(b => getMaintenanceStatus(b.lastMaintenanceDate).status === 'Healthy').length}
                  <span className="text-sm font-medium text-slate-400 ml-2">assets</span>
              </div>
          </div>
      </div>

      {/* Fleet Status List */}
      <div className="glass bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">Asset Maintenance Status</h3>
              <div className="relative group w-64">
                  <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                  <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      placeholder="Search Logs..." 
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:border-slate-800 transition-all text-sm"
                  />
              </div>
          </div>
          
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
              <thead className="bg-slate-50/80 border-b border-slate-200/60 backdrop-blur-sm sticky top-0 z-10">
                  <tr>
                      <th className="px-8 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Asset Name</th>
                      <th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Location</th>
                      <th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Last Check</th>
                      <th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Status</th>
                      <th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider text-right">Action</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {billboards.map(b => {
                    const health = getMaintenanceStatus(b.lastMaintenanceDate);
                    return (
                        <tr key={b.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-4 font-bold text-slate-900">{b.name}</td>
                            <td className="px-6 py-4 text-xs font-medium">{b.location}</td>
                            <td className="px-6 py-4 font-mono text-xs">{b.lastMaintenanceDate || 'Never'}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm flex items-center gap-1 w-fit
                                    ${health.status === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : 
                                      health.status === 'Warning' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                      'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                    {health.status === 'Critical' && <AlertTriangle size={10} />}
                                    {health.status === 'Warning' && <Wrench size={10} />}
                                    {health.status === 'Healthy' && <CheckCircle size={10} />}
                                    {health.label}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => { setNewRecord({...newRecord, billboardId: b.id}); setIsModalOpen(true); }}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                                >
                                    Log Check
                                </button>
                            </td>
                        </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
      </div>

      {/* Recent Activity Log */}
      <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Recent Service History</h3>
          <div className="grid grid-cols-1 gap-4">
              {filteredRecords.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10).map(record => (
                  <div key={record.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${record.type === 'Bolt Check' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                              {record.type === 'Bolt Check' ? <Wrench size={20}/> : <Activity size={20}/>}
                          </div>
                          <div>
                              <h4 className="font-bold text-slate-800 text-sm">{getBillboardName(record.billboardId)}</h4>
                              <p className="text-xs text-slate-500">{record.type} by {record.technician} • {record.date}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="font-bold text-slate-900 text-sm">${record.cost}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">{record.status}</p>
                      </div>
                  </div>
              ))}
              {records.length === 0 && (
                  <div className="text-center py-12 text-slate-400 italic">No maintenance records found.</div>
              )}
          </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)} />
            
            <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden flex flex-col animate-slide-up ring-1 ring-black/5">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Log Maintenance</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-6">
                    <PremiumSelect 
                        label="Select Asset" 
                        value={newRecord.billboardId} 
                        onChange={(e: any) => setNewRecord({...newRecord, billboardId: e.target.value})} 
                        options={[{value: '', label: 'Select Billboard...'}, ...billboards.map(b => ({value: b.id, label: b.name}))]}
                    />
                    
                    <div className="grid grid-cols-2 gap-6">
                        <PremiumSelect 
                            label="Service Type" 
                            value={newRecord.type} 
                            onChange={(e: any) => setNewRecord({...newRecord, type: e.target.value})} 
                            options={[{value: 'Bolt Check', label: 'Bolt Check'}, {value: 'Structural', label: 'Structural'}, {value: 'Electrical', label: 'Electrical'}, {value: 'Cleaning', label: 'Cleaning'}, {value: 'Repair', label: 'Repair'}]}
                        />
                        <PremiumInput label="Date" type="date" value={newRecord.date} onChange={(e: any) => setNewRecord({...newRecord, date: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <PremiumInput label="Technician" value={newRecord.technician} onChange={(e: any) => setNewRecord({...newRecord, technician: e.target.value})} />
                        <PremiumInput label="Cost ($)" type="number" value={newRecord.cost} onChange={(e: any) => setNewRecord({...newRecord, cost: Number(e.target.value)})} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold ml-4">Notes</label>
                        <textarea 
                            value={newRecord.notes} 
                            onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-medium text-sm h-24 resize-none"
                            placeholder="Describe work done or issues found..."
                        />
                    </div>

                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                        <Save size={18} /> Save Record
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
