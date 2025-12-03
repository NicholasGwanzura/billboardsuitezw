
import React, { useState, useEffect } from 'react';
import { getContracts, getBillboards, addContract, addInvoice, mockClients, deleteContract } from '../services/mockData';
import { generateContractPDF } from '../services/pdfGenerator';
import { generateRentalProposal } from '../services/aiService';
import { Contract, BillboardType, VAT_RATE, Invoice } from '../types';
import { FileText, Calendar, Download, Eye, Plus, X, Wand2, RefreshCw, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';

const MinimalInput = ({ label, value, onChange, type = "text", required = false, disabled = false }: any) => {
  // Logic to determine if label should float
  // Always float for date inputs to avoid overlapping browser mask
  const isDate = type === 'date';
  
  return (
    <div className="group relative pt-2">
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
            ${isDate ? '' : 'peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4'} 
            peer-focus:-top-0 peer-focus:text-xs peer-focus:text-slate-800 pointer-events-none`}>
        {label}
        </label>
    </div>
  );
};

const MinimalSelect = ({ label, value, onChange, options, disabled = false }: any) => (
  <div className="group relative pt-2">
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
  
  // AI State
  const [aiProposal, setAiProposal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // New Rental State
  const [newRental, setNewRental] = useState({
    clientId: '',
    billboardId: '',
    side: 'A' as 'A' | 'B',
    slotNumber: 1,
    startDate: '',
    endDate: '',
    monthlyRate: 0,
    installationCost: 0,
    printingCost: 0,
    hasVat: true
  });

  const getClient = (id: string) => mockClients.find(c => c.id === id);
  const getBillboard = (id: string) => getBillboards().find(b => b.id === id);
  const getClientName = (id: string) => getClient(id)?.companyName || 'Unknown';
  const getBillboardName = (id: string) => getBillboard(id)?.name || 'Unknown';

  const selectedBillboard = getBillboard(newRental.billboardId);

  // Filter available sides logic
  const isSideAvailable = (side: 'A' | 'B', billboard = selectedBillboard) => {
    if (!billboard) return false;
    if (billboard.type !== BillboardType.Static) return false;
    return side === 'A' ? billboard.sideAStatus === 'Available' : billboard.sideBStatus === 'Available';
  };

  // Smart Auto-Select Effect
  useEffect(() => {
    if (selectedBillboard?.type === BillboardType.Static) {
        const aFree = selectedBillboard.sideAStatus === 'Available';
        const bFree = selectedBillboard.sideBStatus === 'Available';
        
        let autoSide: 'A' | 'B' = 'A';
        let rate = 0;

        if (aFree) {
            autoSide = 'A';
            rate = selectedBillboard.sideARate || 0;
        } else if (bFree) {
            autoSide = 'B';
            rate = selectedBillboard.sideBRate || 0;
        } else {
            // Both taken
             rate = 0;
        }

        setNewRental(prev => ({
            ...prev,
            side: autoSide,
            monthlyRate: rate
        }));
    } else if (selectedBillboard?.type === BillboardType.LED) {
        setNewRental(prev => ({
            ...prev,
            monthlyRate: selectedBillboard.ratePerSlot || 0
        }));
    }
  }, [newRental.billboardId]);

  const handleCreateRental = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check availability one last time
    if (selectedBillboard?.type === BillboardType.Static) {
        if (!isSideAvailable(newRental.side)) {
            alert(`Side ${newRental.side} is no longer available. Please select a different side.`);
            return;
        }
    }

    const subtotal = (newRental.monthlyRate * 12) + newRental.installationCost + newRental.printingCost; // Assuming 12 months for calc
    const vat = newRental.hasVat ? subtotal * VAT_RATE : 0;
    const rentalId = `C-${Date.now().toString().slice(-4)}`;
    
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
        details: selectedBillboard?.type === BillboardType.Static ? `Side ${newRental.side}` : `Slot ${newRental.slotNumber}`
    };

    // 1. Create Contract
    addContract(rental);

    // 2. Auto-Generate Invoice
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
    
    // Update local state
    setRentals(getContracts());
    setIsCreateModalOpen(false);
    
    // Reset
    setNewRental({
        clientId: '', billboardId: '', side: 'A', slotNumber: 1, startDate: '', endDate: '', 
        monthlyRate: 0, installationCost: 0, printingCost: 0, hasVat: true
    });

    alert("Success! Rental Active & Initial Invoice Generated.");
  };

  const handleGenerateProposal = async () => {
    if (!newRental.clientId || !newRental.billboardId) {
        alert("Please select a Client and Billboard first.");
        return;
    }
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
            <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 mb-2">Rentals Module</h2>
            <p className="text-slate-500 font-medium">Active contracts, renewals, and availability tracking</p>
          </div>
          <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
          >
            <Plus size={18} /> New Rental
          </button>
        </div>

        <div className="grid gap-4">
          {rentals.map(contract => (
            <div key={contract.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:-translate-y-0.5 duration-300">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 transition-colors group-hover:text-white text-indigo-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{getClientName(contract.clientId)}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <span className="font-medium text-slate-700">{getBillboardName(contract.billboardId)}</span>
                    <span className="text-slate-300">•</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-xs ${contract.side ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                      {contract.details}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 uppercase tracking-wide font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {contract.startDate} — {contract.endDate}
                    </span>
                    <span>ID: {contract.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-1 w-full md:w-auto pl-16 md:pl-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400 font-medium">Value:</span>
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">${contract.totalContractValue.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 text-[10px] text-slate-500 uppercase tracking-wide">
                  {contract.monthlyRate > 0 && <span>${contract.monthlyRate}/mo</span>}
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-5 md:pt-0 mt-2 md:mt-0 pl-16 md:pl-0">
                <button 
                    onClick={() => setSelectedRental(contract)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                    <Eye size={14} /> View
                </button>
                <button 
                    onClick={() => {
                        const client = getClient(contract.clientId);
                        if(client) generateContractPDF(contract, client, getBillboardName(contract.billboardId));
                    }}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 shadow-lg hover:shadow-slate-500/30"
                >
                    <Download size={14} /> PDF
                </button>
                <button 
                    onClick={() => setRentalToDelete(contract)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Rental"
                >
                    <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE RENTAL MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all overflow-y-auto animate-fade-in">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full border border-white/20 my-8">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50 sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-slate-900">New Rental Agreement</h3>
                    <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <form onSubmit={handleCreateRental} className="p-8 space-y-8 border-r border-slate-100">
                        <MinimalSelect 
                            label="Select Client" 
                            value={newRental.clientId} 
                            onChange={(e: any) => setNewRental({...newRental, clientId: e.target.value})}
                            options={[{value: '', label: 'Select Client...'}, ...mockClients.map(c => ({value: c.id, label: c.companyName}))]}
                        />
                        <MinimalSelect 
                            label="Select Billboard" 
                            value={newRental.billboardId} 
                            onChange={(e: any) => {
                                // Logic handled by useEffect, but we update ID here
                                setNewRental(prev => ({...prev, billboardId: e.target.value}));
                            }}
                            options={[{value: '', label: 'Select Billboard...'}, ...getBillboards().map(b => ({value: b.id, label: `${b.name} (${b.type})`}))]}
                        />

                        {selectedBillboard?.type === BillboardType.Static && (
                             <div className="flex gap-4">
                                {(['A', 'B'] as const).map(side => {
                                    const available = isSideAvailable(side);
                                    const price = side === 'A' ? selectedBillboard.sideARate : selectedBillboard.sideBRate;
                                    const isSelected = newRental.side === side;
                                    
                                    return (
                                        <label key={side} className={`flex-1 relative cursor-pointer border rounded-xl p-3 text-center transition-all ${
                                            !available ? 'opacity-40 bg-slate-100 cursor-not-allowed border-slate-100' : 
                                            isSelected ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                                        }`}>
                                            <input 
                                                type="radio" 
                                                name="side" 
                                                className="hidden" 
                                                disabled={!available} 
                                                checked={isSelected} 
                                                onChange={() => available && setNewRental({...newRental, side, monthlyRate: price || 0})} 
                                            />
                                            <div className="font-bold text-slate-800">Side {side}</div>
                                            <div className="text-xs text-slate-500">${price}</div>
                                            {!available && <div className="text-[10px] text-red-500 font-bold uppercase mt-1">Occupied</div>}
                                            {isSelected && <div className="absolute top-2 right-2 text-blue-500"><CheckCircle size={14}/></div>}
                                        </label>
                                    )
                                })}
                             </div>
                        )}

                        {selectedBillboard?.type === BillboardType.LED && (
                            <MinimalSelect 
                                label="Select Slot" 
                                value={newRental.slotNumber} 
                                onChange={(e: any) => setNewRental({...newRental, slotNumber: Number(e.target.value)})}
                                options={Array.from({length: selectedBillboard.totalSlots || 10}, (_, i) => ({value: i+1, label: `Slot ${i+1}`}))}
                            />
                        )}

                        <div className="grid grid-cols-2 gap-6">
                            <MinimalInput label="Start Date" type="date" value={newRental.startDate} onChange={(e: any) => setNewRental({...newRental, startDate: e.target.value})} required />
                            <MinimalInput label="End Date" type="date" value={newRental.endDate} onChange={(e: any) => setNewRental({...newRental, endDate: e.target.value})} required />
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Financials</h4>
                            <div className="grid grid-cols-2 gap-6">
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

                    {/* AI Proposal Section */}
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

                        <button 
                            type="button" 
                            onClick={handleGenerateProposal}
                            disabled={isGenerating}
                            className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <RefreshCw size={16} className="animate-spin"/> : <Wand2 size={16} />} 
                            {isGenerating ? 'Drafting...' : 'Generate Proposal'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {rentalToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full border border-white/20 p-6 text-center">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-50">
                <AlertTriangle className="text-red-500" size={32} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Rental?</h3>
             <p className="text-slate-500 mb-6 text-sm">
               Are you sure you want to delete the rental agreement for <span className="font-bold text-slate-700">{getClientName(rentalToDelete.clientId)}</span>?
             </p>
             <div className="flex gap-3">
               <button 
                  onClick={() => setRentalToDelete(null)}
                  className="flex-1 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors"
                >
                  Cancel
               </button>
               <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors shadow-lg shadow-red-500/30"
                >
                  Delete
               </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};
