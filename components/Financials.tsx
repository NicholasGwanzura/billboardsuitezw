
import React, { useState, useEffect } from 'react';
import { getInvoices, getContracts, mockClients, getBillboards, addInvoice, markInvoiceAsPaid } from '../services/mockData';
import { generateInvoicePDF } from '../services/pdfGenerator';
import { FileText, Download, Printer, Plus, X, Save, Link2, CreditCard, Search, ChevronDown, Sparkles, Receipt, FileCheck } from 'lucide-react';
import { Invoice, VAT_RATE } from '../types';

// --- Premium UI Components ---

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
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
      <ChevronDown size={14} />
    </div>
  </div>
);

// --- Main Component ---

interface FinancialsProps { initialTab?: 'Invoices' | 'Quotations' | 'Receipts'; }

export const Financials: React.FC<FinancialsProps> = ({ initialTab = 'Invoices' }) => {
  const [activeTab, setActiveTab] = useState<'Invoices' | 'Quotations' | 'Receipts'>(initialTab);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(getInvoices());
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({ description: '', amount: 0 });
  const [formData, setFormData] = useState<Partial<Invoice>>({ clientId: '', items: [], date: new Date().toISOString().split('T')[0], status: 'Pending', contractId: '', paymentMethod: 'Bank Transfer', paymentReference: '' });
  const [selectedInvoiceToPay, setSelectedInvoiceToPay] = useState('');
  const [hasVat, setHasVat] = useState(true);

  useEffect(() => { setInvoices(getInvoices()); }, [activeTab, isModalOpen]);

  const handleRentalSelect = (contractId: string) => {
      const contract = getContracts().find(c => c.id === contractId);
      if (contract) {
          const billboard = getBillboards().find(b => b.id === contract.billboardId);
          setFormData({ ...formData, contractId: contractId, clientId: contract.clientId, items: [{ description: `Monthly Rental - ${billboard?.name} (${contract.details})`, amount: contract.monthlyRate }] });
      }
  };
  const handleInvoiceSelect = (invoiceId: string) => {
      setSelectedInvoiceToPay(invoiceId);
      const invoice = getInvoices().find(i => i.id === invoiceId);
      if (invoice) { setFormData({ ...formData, clientId: invoice.clientId, contractId: invoice.contractId, items: [{ description: `Payment for Invoice #${invoice.id}`, amount: invoice.total }] }); setHasVat(false); }
  };
  const addItem = () => { if(newItem.description && newItem.amount > 0) { setFormData({ ...formData, items: [...(formData.items || []), newItem] }); setNewItem({ description: '', amount: 0 }); } };
  const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      const subtotal = formData.items?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
      const vatAmount = hasVat ? subtotal * VAT_RATE : 0;
      const total = subtotal + vatAmount;
      const newDoc: Invoice = { id: `${activeTab === 'Quotations' ? 'QT' : activeTab === 'Receipts' ? 'RCT' : 'INV'}-${Date.now().toString().slice(-4)}`, clientId: formData.clientId!, date: formData.date!, items: formData.items || [], subtotal, vatAmount, total, status: activeTab === 'Receipts' ? 'Paid' : 'Pending', type: activeTab === 'Invoices' ? 'Invoice' : activeTab === 'Quotations' ? 'Quotation' : 'Receipt', contractId: formData.contractId, paymentMethod: activeTab === 'Receipts' ? formData.paymentMethod : undefined, paymentReference: activeTab === 'Receipts' ? formData.paymentReference : undefined };
      addInvoice(newDoc);
      if (activeTab === 'Receipts' && selectedInvoiceToPay) { markInvoiceAsPaid(selectedInvoiceToPay); }
      setInvoices(getInvoices()); setIsModalOpen(false); setFormData({ clientId: '', items: [], date: new Date().toISOString().split('T')[0], status: 'Pending', contractId: '', paymentMethod: 'Bank Transfer', paymentReference: '' }); setSelectedInvoiceToPay(''); alert(`${activeTab.slice(0, -1)} Created Successfully!`);
  };
  const downloadPDF = (doc: Invoice) => { const client = mockClients.find(c => c.id === doc.clientId); if (client) { generateInvoicePDF(doc, client); } else { alert(`Could not generate PDF: Client data missing for ID ${doc.clientId}`); } };
  const initiatePayment = (invoice: Invoice) => { setActiveTab('Receipts'); setIsModalOpen(true); setTimeout(() => handleInvoiceSelect(invoice.id), 0); };

  const filteredDocs = invoices.filter(i => {
      let matchesType = false;
      if (activeTab === 'Invoices') matchesType = i.type === 'Invoice'; else if (activeTab === 'Quotations') matchesType = i.type === 'Quotation'; else if (activeTab === 'Receipts') matchesType = i.type === 'Receipt'; 
      const searchLower = searchTerm.toLowerCase();
      const clientName = mockClients.find(c => c.id === i.clientId)?.companyName.toLowerCase() || '';
      const matchesSearch = i.id.toLowerCase().includes(searchLower) || clientName.includes(searchLower) || (i.paymentReference && i.paymentReference.toLowerCase().includes(searchLower));
      return matchesType && matchesSearch;
  });

  return (
    <>
      <div className="space-y-8 animate-fade-in pb-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-brand-700 to-accent-600 mb-2">
              {activeTab === 'Receipts' ? 'Receipts & Payments' : 'Financial Documents'}
            </h2>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              Manage billing, VAT, and transaction history
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative group w-full sm:w-72">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-200 to-accent-200 rounded-full blur opacity-25 group-focus-within:opacity-50 transition-opacity"></div>
                <div className="relative bg-white rounded-full shadow-sm border border-slate-200 flex items-center px-4 py-2.5 transition-all group-focus-within:ring-2 ring-brand-500/20 ring-offset-2">
                    <Search className="text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        placeholder="Search ID, Client..." 
                        className="w-full bg-transparent border-none outline-none text-sm ml-3 text-slate-800 placeholder-slate-400 font-medium"
                    />
                </div>
            </div>
            
            <button 
                onClick={() => { setSelectedInvoiceToPay(''); setFormData({ clientId: '', items: [], date: new Date().toISOString().split('T')[0], status: 'Pending', contractId: '', paymentMethod: 'Bank Transfer', paymentReference: '' }); setIsModalOpen(true); }} 
                className="bg-gradient-to-r from-brand-600 to-accent-600 text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-brand-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
                <Plus size={18} /> <span className="hidden sm:inline">Create {activeTab.slice(0, -1)}</span><span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
        
        {/* Modern Tabs */}
        <div className="flex gap-2 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 w-fit shadow-sm">
            {(['Invoices', 'Quotations', 'Receipts'] as const).map((tab) => {
                const isActive = activeTab === tab;
                const Icon = tab === 'Invoices' ? FileText : tab === 'Quotations' ? FileCheck : Receipt;
                return (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)} 
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isActive ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                    >
                        <Icon size={16} className={isActive ? 'text-brand-300' : ''} />
                        {tab}
                    </button>
                );
            })}
        </div>
        
        {/* Glass Table Container */}
        <div className="glass bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
              <thead className="bg-slate-50/80 border-b border-slate-200/60 backdrop-blur-sm">
                  <tr>
                      <th className="px-8 py-5 font-bold text-xs uppercase text-slate-400 tracking-wider">ID & Date</th>
                      <th className="px-6 py-5 font-bold text-xs uppercase text-slate-400 tracking-wider">Client Info</th>
                      {activeTab === 'Receipts' && (<><th className="px-6 py-5 font-bold text-xs uppercase text-slate-400 tracking-wider">Method</th><th className="px-6 py-5 font-bold text-xs uppercase text-slate-400 tracking-wider">Ref #</th></>)}
                      <th className="px-6 py-5 font-bold text-xs uppercase text-slate-400 tracking-wider text-right">Total Amount</th>
                      <th className="px-6 py-5 font-bold text-xs uppercase text-slate-400 tracking-wider text-center">Status</th>
                      <th className="px-8 py-5 font-bold text-xs uppercase text-slate-400 tracking-wider text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
                  <tr key={doc.id} className="group hover:bg-brand-50/30 transition-colors">
                      <td className="px-8 py-5">
                          <div className="font-bold text-slate-900">{doc.id}</div>
                          <div className="text-xs text-slate-400 font-medium">{doc.date}</div>
                      </td>
                      <td className="px-6 py-5">
                          <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-700 group-hover:text-brand-700 transition-colors">{mockClients.find(c => c.id === doc.clientId)?.companyName || 'Unknown Client'}</span>
                              {doc.contractId && <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wide flex items-center gap-1 mt-1"><Link2 size={10}/> Contract {doc.contractId}</span>}
                          </div>
                      </td>
                      {activeTab === 'Receipts' && (<><td className="px-6 py-5 text-xs font-medium">{doc.paymentMethod || '-'}</td><td className="px-6 py-5 text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded w-fit">{doc.paymentReference || '-'}</td></>)}
                      <td className="px-6 py-5 text-right font-black text-slate-800 text-base">${doc.total.toLocaleString()}</td>
                      <td className="px-6 py-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${doc.status === 'Paid' ? 'bg-emerald-100/50 text-emerald-700 border-emerald-100' : doc.status === 'Pending' ? 'bg-amber-100/50 text-amber-700 border-amber-100' : 'bg-rose-100/50 text-rose-700 border-rose-100'}`}>
                              {doc.status}
                          </span>
                      </td>
                      <td className="px-8 py-5">
                          <div className="flex justify-end gap-2">
                              <button onClick={() => downloadPDF(doc)} className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-brand-100" title="Download PDF"><Download size={18} /></button>
                              {activeTab === 'Invoices' && doc.status === 'Pending' && (
                                  <button onClick={() => initiatePayment(doc)} className="p-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-emerald-100" title="Record Payment"><CreditCard size={18} /></button>
                              )}
                          </div>
                      </td>
                  </tr>
                )) : (<tr><td colSpan={activeTab === 'Receipts' ? 8 : 6} className="px-6 py-12 text-center text-slate-400 italic font-medium">No documents found matching your filter.</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)} />
            
            <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden flex flex-col max-h-[90vh] animate-slide-up ring-1 ring-black/5">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create {activeTab.slice(0, -1)}</h3>
                        <p className="text-slate-500 text-sm font-medium">Fill in the details below to generate a new document.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"><X size={20} /></button>
                </div>

                {/* Modal Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                    <form onSubmit={handleCreate} className="space-y-8">
                        {activeTab === 'Receipts' && (
                            <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                <PremiumSelect label="Link to Pending Invoice" value={selectedInvoiceToPay} onChange={(e: any) => handleInvoiceSelect(e.target.value)} options={[{value: '', label: 'Select Invoice to Pay...'}, ...getInvoices().filter(i => i.status === 'Pending' && i.type === 'Invoice').map(i => ({ value: i.id, label: `Inv #${i.id} - $${i.total} (${mockClients.find(c => c.id === i.clientId)?.companyName})`}))]}/>
                            </div>
                        )}
                        
                        {activeTab !== 'Receipts' && (
                            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                <PremiumSelect label="Auto-fill from Rental (Optional)" value={formData.contractId} onChange={(e: any) => handleRentalSelect(e.target.value)} options={[{value: '', label: 'Select Rental Agreement...'}, ...getContracts().map(c => { const client = mockClients.find(cl => cl.id === c.clientId); const billboard = getBillboards().find(b => b.id === c.billboardId); return {value: c.id, label: `${client?.companyName} - ${billboard?.name} (${c.details})`};})]}/>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <PremiumSelect label="Client" value={formData.clientId} onChange={(e: any) => setFormData({...formData, clientId: e.target.value})} options={[{value: '', label: 'Select Client...'}, ...mockClients.map(c => ({value: c.id, label: c.companyName}))]}/>
                            <PremiumInput label="Date Issued" type="date" value={formData.date} onChange={(e: any) => setFormData({...formData, date: e.target.value})} />
                        </div>

                        {activeTab === 'Receipts' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <PremiumSelect label="Payment Method" value={formData.paymentMethod} onChange={(e: any) => setFormData({...formData, paymentMethod: e.target.value})} options={[{value: 'Bank Transfer', label: 'Bank Transfer'},{value: 'Cash', label: 'Cash'},{value: 'EcoCash', label: 'EcoCash'},{value: 'Other', label: 'Other'}]}/>
                                <PremiumInput label="Reference Number" value={formData.paymentReference} onChange={(e: any) => setFormData({...formData, paymentReference: e.target.value})} />
                            </div>
                        )}

                        <div className="bg-slate-50/80 rounded-2xl p-6 space-y-4 border border-slate-100 shadow-inner">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Line Items</h4>
                                <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-1 rounded font-bold">{formData.items?.length || 0} Items</span>
                            </div>
                            
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <PremiumInput label="Description" value={newItem.description} onChange={(e: any) => setNewItem({...newItem, description: e.target.value})} placeholder="e.g. Monthly Rental Fee" />
                                </div>
                                <div className="w-32">
                                    <PremiumInput label="Amount ($)" type="number" value={newItem.amount} onChange={(e: any) => setNewItem({...newItem, amount: Number(e.target.value)})} />
                                </div>
                                <button type="button" onClick={addItem} className="h-[50px] w-[50px] bg-slate-900 text-white rounded-xl hover:bg-slate-800 flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95 mb-[1px]">
                                    <Plus size={20}/>
                                </button>
                            </div>

                            {formData.items && formData.items.length > 0 && (
                                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {formData.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                                            <span className="font-medium text-slate-700 truncate mr-2">{item.description}</span>
                                            <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded border border-slate-100">${item.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                            <div className="relative flex items-center">
                                <input type="checkbox" checked={hasVat} disabled={activeTab === 'Receipts' && !!selectedInvoiceToPay} onChange={e => setHasVat(e.target.checked)} className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-brand-500 checked:bg-brand-500 hover:border-brand-400" />
                                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                            </div>
                            <label className="text-sm font-bold text-slate-700 cursor-pointer select-none">Include VAT (15%)</label>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <button type="submit" className="w-full py-4 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-brand-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                                <Save size={18} /> Create Document
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </>
  );
};
