
import React, { useState } from 'react';
import { Client } from '../types';
import { getClients, addClient, deleteClient, getNextBillingDetails } from '../services/mockData';
import { Mail, Phone, MoreHorizontal, User, Plus, X, Save, Search, Trash2, AlertTriangle, Calendar, Clock } from 'lucide-react';

const MinimalInput = ({ label, value, onChange, type = "text", placeholder, required = false }: any) => (
  <div className="group relative">
    <input type={type} required={required} value={value} onChange={onChange} placeholder=" " className="peer w-full px-0 py-2.5 border-b border-slate-200 bg-transparent text-slate-800 focus:border-slate-800 focus:ring-0 outline-none transition-all font-medium placeholder-transparent" />
    <label className="absolute left-0 -top-2.5 text-xs text-slate-400 font-medium transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-slate-800 uppercase tracking-wide">{label}</label>
  </div>
);

export const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(getClients());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  
  const [newClient, setNewClient] = useState<Partial<Client>>({ companyName: '', contactPerson: '', email: '', phone: '', status: 'Active' });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const client: Client = { id: (clients.length + 1).toString(), companyName: newClient.companyName || 'New Company', contactPerson: newClient.contactPerson || 'N/A', email: newClient.email || '', phone: newClient.phone || '', status: 'Active' };
    addClient(client); setClients(getClients()); setIsAddModalOpen(false); setNewClient({ companyName: '', contactPerson: '', email: '', phone: '', status: 'Active' });
  };
  const handleConfirmDelete = () => { if (clientToDelete) { deleteClient(clientToDelete.id); setClients(getClients()); setClientToDelete(null); } };

  return (
    <>
      <div className="space-y-8 relative animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div><h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 mb-2">Client Directory</h2><p className="text-slate-500 font-medium">Manage advertising partners and contact details</p></div>
          <div className="flex items-center gap-4 w-full sm:w-auto"><div className="relative group w-full sm:w-64"><Search className="absolute left-0 top-2.5 text-slate-400 group-focus-within:text-slate-800 transition-colors" size={18} /><input type="text" placeholder="Search clients..." className="w-full pl-8 py-2 border-b border-slate-200 bg-transparent outline-none focus:border-slate-800 transition-colors"/></div><button onClick={() => setIsAddModalOpen(true)} className="bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-slate-800 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"><Plus size={18} /> <span className="hidden sm:inline">New Client</span></button></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {clients.map(client => {
                const billingInfo = getNextBillingDetails(client.id);
                return (
                <div key={client.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group hover:-translate-y-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4"><div className="w-14 h-14 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center font-bold text-xl group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-sm">{client.companyName.charAt(0)}</div><button onClick={() => setClientToDelete(client)} className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full" title="Delete Client"><Trash2 size={18} /></button></div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{client.companyName}</h3><div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium"><User size={14} className="text-indigo-500"/> {client.contactPerson}</div>
                        <div className="space-y-3 border-t border-slate-50 pt-4 mb-4"><div className="flex items-center gap-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors"><Mail size={16} className="text-slate-400" /> {client.email}</div><div className="flex items-center gap-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors"><Phone size={16} className="text-slate-400" /> {client.phone}</div></div>
                        
                        {billingInfo && (
                             <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 mb-4">
                                 <div className="flex items-center justify-between mb-1">
                                     <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-400">Next Bill</span>
                                     <span className="text-xs font-bold text-indigo-700">${billingInfo.amount.toLocaleString()}</span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm font-bold text-indigo-900">
                                     <Clock size={14} /> {billingInfo.date}
                                 </div>
                             </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center pt-2"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${client.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>{client.status}</span><button className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1">View Profile <MoreHorizontal size={14}/></button></div>
                </div>
            )})}
        </div>
      </div>
      {isAddModalOpen && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all"><div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border border-white/20"><div className="p-6 border-b border-slate-100 flex justify-between items-center"><h3 className="text-xl font-bold text-slate-900">Add New Client</h3><button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button></div><form onSubmit={handleAddClient} className="p-8 space-y-8"><MinimalInput label="Company Name" value={newClient.companyName} onChange={(e: any) => setNewClient({...newClient, companyName: e.target.value})} required /><MinimalInput label="Contact Person" value={newClient.contactPerson} onChange={(e: any) => setNewClient({...newClient, contactPerson: e.target.value})} required /><MinimalInput label="Email Address" type="email" value={newClient.email} onChange={(e: any) => setNewClient({...newClient, email: e.target.value})} required /><MinimalInput label="Phone Number" type="tel" value={newClient.phone} onChange={(e: any) => setNewClient({...newClient, phone: e.target.value})} /><button type="submit" className="w-full px-4 py-4 text-white bg-slate-900 rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2 shadow-xl font-bold uppercase tracking-wider transition-all hover:scale-105"><Save size={18} /> Save Client</button></form></div></div>)}
      {clientToDelete && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all"><div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full border border-white/20 p-6 text-center"><div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-50"><AlertTriangle className="text-red-500" size={32} /></div><h3 className="text-xl font-bold text-slate-900 mb-2">Delete Client?</h3><p className="text-slate-500 mb-6 text-sm">Are you sure you want to delete <span className="font-bold text-slate-700">{clientToDelete.companyName}</span>? This action cannot be undone.</p><div className="flex gap-3"><button onClick={() => setClientToDelete(null)} className="flex-1 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors">Cancel</button><button onClick={handleConfirmDelete} className="flex-1 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors shadow-lg shadow-red-500/30">Delete</button></div></div></div>)}
    </>
  );
};
