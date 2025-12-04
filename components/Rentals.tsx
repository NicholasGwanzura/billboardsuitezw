
import React, { useState, useEffect } from 'react';
import { getContracts, getBillboards, addContract, addInvoice, mockClients, deleteContract } from '../services/mockData';
import { generateContractPDF } from '../services/pdfGenerator';
import { generateRentalProposal } from '../services/aiService';
import { Contract, BillboardType, VAT_RATE, Invoice } from '../types';
import { FileText, Calendar, Download, Eye, Plus, X, Wand2, RefreshCw, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';

const MinimalInput = ({ label, value, onChange, type = "text", required = false, disabled = false }: any) => {
  const isDate = type === 'date';
  return (
    <div className="group relative pt-4 w-full">
        <input 
        type={type} 
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder=" "
        className="peer w-full px-0 py-2.5 border-b border-slate-200 bg-transparent text-slate-800 focus:border-slate-800 focus:ring-0 outline-none transition-all font-medium placeholder-transparent disabled:opacity-50" 
        />
        <label className={`absolute left-0 -top-0 text-xs text-slate-400 font-medium transition-all uppercase tracking-wide 
            ${isDate ? '' : 'peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-6'} 
            peer-focus:-top-0 peer-focus:text-xs peer-focus:text-slate-800 pointer-events-none`}>
        {label}
        </label>
    </div>
  );
};

const MinimalSelect = ({ label, value, onChange, options, disabled = false }: any) => (
  <div className="group relative pt-4 w-full">
    <select 
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="peer w-full px-0 py-2.5 border-b border-slate-200 bg-transparent text-slate-800 focus:border-slate-800 focus:ring-0 outline-none transition-all font-medium appearance-none cursor-pointer disabled:opacity-50" 
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <label className="absolute left-0 -top-0 text-xs text-slate-400 font-medium uppercase tracking-wide">
      {label}
    </label>
  </div>
);

export const Rentals: React.FC = () => {
  const [rentals, setRentals] = useState<Contract[]>(getContracts());
  const [selectedRental, setSelectedRental] = useState<Contract | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [rentalToDelete, setRentalToDelete] = useState<Contract | null>(null);
  const [aiProposal, setAiProposal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [newRental, setNewRental] = useState({
    clientId: '', billboardId: '', side: 'A' as 'A' | 'B' | 'Both', slotNumber: 1, startDate: '', endDate: '', 
    monthlyRate: 0, installationCost: 0, printingCost: 0, hasVat: true
  });

  const getClient = (id: string) => mockClients.find(c => c.id === id);
  const getBillboard = (id: string) => getBillboards().find(b => b.id === id);
  const getClientName = (id: string) => getClient(id)?.companyName || 'Unknown';
  const getBillboardName = (id: string) => getBillboard(id)?.name || 'Unknown';

  const selectedBillboard = getBillboard(newRental.billboardId);

  const isSideAvailable = (side: 'A' | 'B' | 'Both', billboard = selectedBillboard) => {
    if (!billboard) return false;
    if (billboard.type !== BillboardType.Static) return false;
    if (side === 'Both') {
        return billboard.sideAStatus === 'Available' && billboard.sideBStatus === 'Available';
    }
    return side === 'A' ? billboard.sideAStatus === 'Available' : billboard.sideBStatus === 'Available';
  };

  useEffect(() => {
    if (selectedBillboard?.type === BillboardType.Static) {
        const aFree = selectedBillboard.sideAStatus === 'Available';
        const bFree = selectedBillboard.sideBStatus === 'Available';
        let autoSide: 'A' | 'B' | 'Both' = 'A';
        let rate = 0;

        if (aFree && bFree) { autoSide = 'Both'; rate = (selectedBillboard.sideARate || 0) + (selectedBillboard.sideBRate || 0); }
        else if (aFree) { autoSide = 'A'; rate = selectedBillboard.sideARate || 0; } 
        else if (bFree) { autoSide = 'B'; rate = selectedBillboard.sideBRate || 0; } 
        else { rate = 0; }

        setNewRental(prev => ({ ...prev, side: autoSide, monthlyRate: rate }));
    } else if (selectedBillboard?.type === BillboardType.LED) {
        setNewRental(prev => ({ ...prev, monthlyRate: selectedBillboard.ratePerSlot || 0 }));
    }
  }, [newRental.billboardId]);

  const handleCreateRental = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBillboard?.type === BillboardType.Static) {
        if (!isSideAvailable(newRental.side)) {
            alert(`Selected side option (${newRental.side}) is no longer available.`);
            return;
        }
    }

    const subtotal = (newRental.monthlyRate * 12) + newRental.installationCost + newRental.printingCost;
    const vat = newRental.hasVat ? subtotal * VAT_RATE : 0;
    const rentalId = `C-${Date.now().toString().slice(-4)}`;
    
    let detailText = '';
    if (selectedBillboard?.type === BillboardType.Static) {
        detailText = newRental.side === 'Both' ? "Sides A & B" : `Side ${newRental.side}`;
    } else {
        detailText = `Slot ${newRental.slotNumber}`;
    }

    const rental: Contract = {
        id: rentalId,
        clientId: newRental.clientId,
        billboardId: newRental.billboardId,
        startDate: newRental.startDate,
        endDate: newRental.endDate,
        monthlyRate: newRental.monthlyRate,
        installationCost: newRental.installationCost,
        printingCost: newRental.printingCost,
        hasVat: newRental.hasVat,
        totalContractValue: subtotal + vat,
        status: 'Active',
        side: selectedBillboard?.type === BillboardType.Static ? newRental.side : undefined,
        slotNumber: selectedBillboard?.type === BillboardType.LED ? newRental.slotNumber : undefined,
        details: detailText
    };

    addContract(rental);

    const invoiceSubtotal = newRental.monthlyRate + newRental.installationCost + newRental.printingCost;
    const invoiceVat = newRental.hasVat ? invoiceSubtotal * VAT_RATE : 0;
    const initialInvoice: Invoice = {
        id: `INV-${Date.now().toString().slice(-5)}`,
        contractId: rentalId,
        clientId: newRental.clientId,
        date: new Date().toISOString().split('T')[0],
        items: [
            { description: `Rental: ${selectedBillboard?.name} (${rental.details}) - Month 1`, amount: newRental.monthlyRate },
            ...(newRental.installationCost > 0 ? [{ description: 'Installation Fee', amount: newRental.installationCost }] : []),
            ...(newRental.printingCost > 0 ? [{ description: 'Printing Costs', amount: newRental.printingCost }] : [])
        ],
        subtotal: invoiceSubtotal,
        vatAmount: invoiceVat,
        total: invoiceSubtotal + invoiceVat,
        status: 'Pending',
        type: 'Invoice'
    };
    addInvoice(initialInvoice);
    
    setRentals(getContracts());
    setIsCreateModalOpen(false);
    setNewRental({ clientId: '', billboardId: '', side: 'A', slotNumber: 1, startDate: '', endDate: '', monthlyRate: 0, installationCost: 0, printingCost: 0, hasVat: true });
    alert("Success! Rental Active & Initial Invoice Generated.");
  };

  const handleGenerateProposal = async () => {
    if (!newRental.clientId || !newRental.billboardId) { alert("Please select a Client and Billboard first."); return; }
    setIsGenerating(true);
    const client = getClient(newRental.clientId)!;
    const billboard = getBillboard(newRental.billboardId)!;
    const proposal = await generateRentalProposal(client, billboard, newRental.monthlyRate);
    setAiProposal(proposal);
    setIsGenerating(false);
  };

  const confirmDelete = () => {
      if (rentalToDelete) {
          deleteContract(rentalToDelete.id);
          setRentals(getContracts());
          setRentalToDelete(null);
      }
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 mb-2">Rentals Module</h2>
            <p className="text-slate-500 font-medium text-sm sm:text-base">Active contracts, renewals, and availability</p>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2">
            <Plus size={18} /> <span className="hidden sm:inline">New Rental</span><span className="sm:hidden">New</span>
          </button>
        </div>

        <div className="grid gap-4">
          {rentals.map(contract => (
            <div key={contract.id} className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 group hover:-translate-y-0.5 duration-300">
              <div className="flex items-start gap-4 w-full lg:w-auto">
                <div className="p-3 sm:p-4 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 transition-colors group-hover:text-white text-indigo-600 shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg truncate">{getClientName(contract.clientId)}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-500 mt-1">
                    <span className="font-medium text-slate-700 truncate">{getBillboardName(contract.billboardId)}</span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] sm:text-xs w-fit ${contract.side ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                      {contract.details}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-3 text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide font-medium flex-wrap">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {contract.startDate} — {contract.endDate}</span>
                    <span>ID: {contract.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row lg:flex-col lg:items-end gap-2 w-full lg:w-auto pl-0 lg:pl-16 justify-between lg:justify-start items-center">
                <div className="flex flex-col lg:items-end">
                    <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-slate-400 font-medium hidden sm:inline">Value:</span>
                        <span className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">${contract.totalContractValue.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2 text-[10px] text-slate-500 uppercase tracking-wide">
                        {contract.monthlyRate > 0 && <span>${contract.monthlyRate}/mo</span>}
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button onClick={() => setSelectedRental(contract)} className="px-3 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1">
                        <Eye size={14} /> <span className="hidden sm:inline">View</span>
                    </button>
                    <button onClick={() => { const client = getClient(contract.clientId); if(client) generateContractPDF(contract, client, getBillboardName(contract.billboardId)); }} className="px-3 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 shadow-lg hover:shadow-slate-500/30">
                        <Download size={14} /> <span className="hidden sm:inline">PDF</span>
                    </button>
                    <button onClick={() => setRentalToDelete(contract)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Rental">
                        <Trash2 size={16} />
                    </button>
                </div>
              </div>
            </div>
          ))}
          {rentals.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="text-slate-300" size={32}/>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Rentals</h3>
                  <p className="text-slate-500 text-sm">Create a new rental agreement to get started.</p>
              </div>
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[200] overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setIsCreateModalOpen(false)} />
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-4xl border border-white/20">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50 sticky top-0 z-10">
                        <h3 className="text-xl font-bold text-slate-900">New Rental Agreement</h3>
                        <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <form onSubmit={handleCreateRental} className="p-6 sm:p-8 space-y-6 sm:space-y-8 border-r border-slate-100">
                            <div className="space-y-6">
                                <MinimalSelect label="Select Client" value={newRental.clientId} onChange={(e: any) => setNewRental({...newRental, clientId: e.target.value})} options={[{value: '', label: 'Select Client...'}, ...mockClients.map(c => ({value: c.id, label: c.companyName}))]} />
                                <MinimalSelect label="Select Billboard" value={newRental.billboardId} onChange={(e: any) => { setNewRental(prev => ({...prev, billboardId: e.target.value})); }} options={[{value: '', label: 'Select Billboard...'}, ...getBillboards().map(b => ({value: b.id, label: `${b.name} (${b.type})`}))]} />
                            </div>

                            {selectedBillboard?.type === BillboardType.Static && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {(['A', 'B', 'Both'] as const).map(side => {
                                        const available = isSideAvailable(side);
                                        let price = 0;
                                        if(side === 'A') price = selectedBillboard.sideARate || 0;
                                        else if(side === 'B') price = selectedBillboard.sideBRate || 0;
                                        else price = (selectedBillboard.sideARate || 0) + (selectedBillboard.sideBRate || 0);

                                        const isSelected = newRental.side === side;
                                        return (
                                            <label key={side} className={`flex-1 relative cursor-pointer border rounded-xl p-3 text-center transition-all ${!available ? 'opacity-40 bg-slate-100 cursor-not-allowed border-slate-100' : isSelected ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                                                <input type="radio" name="side" className="hidden" disabled={!available} checked={isSelected} onChange={() => available && setNewRental({...newRental, side, monthlyRate: price})} />
                                                <div className="font-bold text-slate-800">{side === 'Both' ? 'Both A&B' : `Side ${side}`}</div>
                                                <div className="text-xs text-slate-500">${price.toLocaleString()}</div>
                                                {!available && <div className="text-[10px] text-red-500 font-bold uppercase mt-1">Occupied</div>}
                                                {isSelected && <div className="absolute top-2 right-2 text-blue-500"><CheckCircle size={14}/></div>}
                                            </label>
                                        )
                                    })}
                                </div>
                            )}
                            {selectedBillboard?.type === BillboardType.LED && (
                                <MinimalSelect label="Select Slot" value={newRental.slotNumber} onChange={(e: any) => setNewRental({...newRental, slotNumber: Number(e.target.value)})} options={Array.from({length: selectedBillboard.totalSlots || 10}, (_, i) => ({value: i+1, label: `Slot ${i+1}`}))} />
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <MinimalInput label="Start Date" type="date" value={newRental.startDate} onChange={(e: any) => setNewRental({...newRental, startDate: e.target.value})} required />
                                <MinimalInput label="End Date" type="date" value={newRental.endDate} onChange={(e: any) => setNewRental({...newRental, endDate: e.target.value})} required />
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl space-y-6">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Financials</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <MinimalInput label="Monthly Rate ($)" type="number" value={newRental.monthlyRate} onChange={(e: any) => setNewRental({...newRental, monthlyRate: Number(e.target.value)})} />
                                    <MinimalInput label="Install Fee ($)" type="number" value={newRental.installationCost} onChange={(e: any) => setNewRental({...newRental, installationCost: Number(e.target.value)})} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={newRental.hasVat} onChange={e => setNewRental({...newRental, hasVat: e.target.checked})} className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"/>
                                    <label className="text-sm font-medium text-slate-600">Include VAT (15%)</label>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 text-white bg-slate-900 rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2 shadow-xl font-bold uppercase tracking-wider transition-all hover:scale-[1.02]">
                                Generate Contract & Invoice
                            </button>
                        </form>
                        <div className="p-8 bg-slate-50/50 flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Wand2 size={20}/></div>
                                <div>
                                    <h4 className="font-bold text-slate-800">AI Proposal Draft</h4>
                                    <p className="text-xs text-slate-500">Generate a pitch email for this rental</p>
                                </div>
                            </div>
                            <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 shadow-inner mb-4 overflow-y-auto min-h-[200px] text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                                {aiProposal || "Select a client and billboard, then click 'Generate' to create a professional pitch draft..."}
                            </div>
                            <button type="button" onClick={handleGenerateProposal} disabled={isGenerating} className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                {isGenerating ? <RefreshCw size={16} className="animate-spin"/> : <Wand2 size={16} />} {isGenerating ? 'Drafting...' : 'Generate Proposal'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {rentalToDelete && (
        <div className="fixed inset-0 z-[200] overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setRentalToDelete(null)} />
          <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-sm border border-white/20 p-6 text-center">
                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-50">
                    <AlertTriangle className="text-red-500" size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Rental?</h3>
                 <p className="text-slate-500 mb-6 text-sm">
                   Are you sure you want to delete the rental agreement for <span className="font-bold text-slate-700">{getClientName(rentalToDelete.clientId)}</span>?
                 </p>
                 <div className="flex gap-3">
                   <button onClick={() => setRentalToDelete(null)} className="flex-1 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors">Cancel</button>
                   <button onClick={confirmDelete} className="flex-1 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors shadow-lg shadow-red-500/30">Delete</button>
                 </div>
              </div>
          </div>
        </div>
      )}
    </>
  );
};
