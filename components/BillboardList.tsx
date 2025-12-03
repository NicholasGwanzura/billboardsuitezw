import React, { useState, useEffect, useRef } from 'react';
import { Billboard, BillboardType } from '../types';
import { getBillboards, addBillboard, updateBillboard, deleteBillboard, mockClients, ZIM_TOWNS } from '../services/mockData';
import { MapPin, X, Edit2, Save, Plus, Layers, PenTool, Image as ImageIcon, Map as MapIcon, Grid as GridIcon, Trash2, AlertTriangle, Share2, Eye, EyeOff, Copy, Check, List as ListIcon, Upload, Search, Link2 } from 'lucide-react';
import L from 'leaflet';

const MinimalInput = ({ label, value, onChange, type = "text", placeholder, required = false }: any) => (
  <div className="group relative">
    <input type={type} required={required} value={value} onChange={onChange} placeholder=" " className="peer w-full px-0 py-2.5 border-b border-slate-200 bg-transparent text-slate-800 focus:border-slate-800 focus:ring-0 outline-none transition-all font-medium placeholder-transparent" />
    <label className="absolute left-0 -top-2.5 text-xs text-slate-400 font-medium transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-slate-800 uppercase tracking-wide">{label}</label>
  </div>
);

const MinimalSelect = ({ label, value, onChange, options }: any) => (
  <div className="group relative">
    <select value={value} onChange={onChange} className="peer w-full px-0 py-2.5 border-b border-slate-200 bg-transparent text-slate-800 focus:border-slate-800 focus:ring-0 outline-none transition-all font-medium appearance-none cursor-pointer" >
      {options.map((opt: any) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
    </select>
    <label className="absolute left-0 -top-2.5 text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</label>
  </div>
);

const MinimalTextArea = ({ label, value, onChange, required = false }: any) => (
  <div className="group relative pt-4">
    <textarea required={required} value={value} onChange={onChange} placeholder=" " className="peer w-full px-0 py-2.5 border-b border-slate-200 bg-transparent text-slate-800 focus:border-slate-800 focus:ring-0 outline-none transition-all font-medium placeholder-transparent resize-none h-20" />
    <label className="absolute left-0 top-0 text-xs text-slate-400 font-medium transition-all uppercase tracking-wide">{label}</label>
  </div>
);

// Helper Component for the Billboard Card
const BillboardCard = ({ billboard, onEdit, onDelete, getClientName, onShare }: { billboard: Billboard, onEdit: (b: Billboard) => void, onDelete: (b: Billboard) => void, getClientName: (id?: string) => string, onShare: (b: Billboard) => void }) => (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-1">
        <div className="h-48 bg-slate-200 relative overflow-hidden shrink-0">
            {billboard.imageUrl ? (
                <img src={billboard.imageUrl} alt="Billboard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300"><ImageIcon size={48} /></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute top-4 right-4 flex gap-2">
                <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">{billboard.town}</span>
                <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full text-white backdrop-blur-md border border-white/30 ${billboard.type === BillboardType.LED ? 'bg-indigo-600/80' : 'bg-orange-600/80'}`}>{billboard.type}</span>
            </div>
            <div className="absolute bottom-4 left-4 text-white w-[90%]">
                <h3 className="font-bold text-lg leading-tight tracking-tight truncate">{billboard.name}</h3>
                <div className="flex items-center text-slate-300 text-xs mt-1 font-medium truncate"><MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />{billboard.location}</div>
            </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                <div><p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Dimensions</p><p className="text-sm font-semibold text-slate-700">{billboard.width}m x {billboard.height}m</p></div>
                {billboard.type === BillboardType.Static ? (
                <div><p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Monthly Rates</p><div className="text-sm font-medium text-slate-700"><span className="text-xs text-slate-400 mr-1">A:</span>${billboard.sideARate?.toLocaleString()}<span className="mx-2 text-slate-300">|</span><span className="text-xs text-slate-400 mr-1">B:</span>${billboard.sideBRate?.toLocaleString()}</div></div>
                ) : (
                <div><p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Rate / Slot</p><p className="text-sm font-semibold text-slate-700">${billboard.ratePerSlot?.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/mo</span></p></div>
                )}
            </div>
            <div className="mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1 flex items-center gap-1"><Eye size={10} /> Visibility Analysis</p>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{billboard.visibility || "No visibility data available."}</p>
            </div>
            {billboard.type === BillboardType.Static ? (
                <div className="flex gap-3 mb-6">
                <div className={`flex-1 p-3 rounded-xl border transition-all ${billboard.sideAStatus === 'Available' ? 'border-green-200 bg-green-50/50' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex justify-between items-center mb-1"><span className="text-xs font-bold text-slate-700">Side A</span><div className={`w-1.5 h-1.5 rounded-full ${billboard.sideAStatus === 'Available' ? 'bg-green-500' : 'bg-red-400'}`}></div></div>
                    <p className="text-[10px] text-slate-500 truncate" title={getClientName(billboard.sideAClientId)}>{billboard.sideAStatus === 'Available' ? 'Vacant' : getClientName(billboard.sideAClientId)}</p>
                </div>
                <div className={`flex-1 p-3 rounded-xl border transition-all ${billboard.sideBStatus === 'Available' ? 'border-green-200 bg-green-50/50' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex justify-between items-center mb-1"><span className="text-xs font-bold text-slate-700">Side B</span><div className={`w-1.5 h-1.5 rounded-full ${billboard.sideBStatus === 'Available' ? 'bg-green-500' : 'bg-red-400'}`}></div></div>
                    <p className="text-[10px] text-slate-500 truncate" title={getClientName(billboard.sideBClientId)}>{billboard.sideBStatus === 'Available' ? 'Vacant' : getClientName(billboard.sideBClientId)}</p>
                </div>
                </div>
            ) : (
                <div className="mb-6">
                <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Slot Occupancy</span><span className="text-xs font-bold text-slate-700">{billboard.rentedSlots}/{billboard.totalSlots}</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${(billboard.rentedSlots! / billboard.totalSlots!) * 100}%` }}></div></div>
                </div>
            )}
            <div className="mt-auto flex gap-2">
                <button onClick={() => onEdit(billboard)} className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-center gap-2"><Edit2 size={14} /> Edit</button>
                <button onClick={() => onShare(billboard)} className="px-3 py-2.5 text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 rounded-xl transition-all flex items-center justify-center" title="Share Billboard Link"><Link2 size={16} /></button>
                <button onClick={() => onDelete(billboard)} className="px-3 py-2.5 text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 rounded-xl transition-all flex items-center justify-center" title="Delete Asset"><Trash2 size={16} /></button>
            </div>
        </div>
    </div>
);

export const BillboardList: React.FC = () => {
  const [billboards, setBillboards] = useState<Billboard[]>(getBillboards());
  const [filter, setFilter] = useState<'All' | 'Static' | 'LED'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClientView, setIsClientView] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [editingBillboard, setEditingBillboard] = useState<Billboard | null>(null);
  const [billboardToDelete, setBillboardToDelete] = useState<Billboard | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMapShareModalOpen, setIsMapShareModalOpen] = useState(false);
  
  const [newBillboard, setNewBillboard] = useState<Partial<Billboard>>({
    name: '', location: '', town: 'Harare', type: BillboardType.Static, width: 0, height: 0,
    sideARate: 0, sideBRate: 0, ratePerSlot: 0, totalSlots: 10, imageUrl: '', visibility: '',
    coordinates: { lat: -17.8292, lng: 31.0522 }
  });

  const filteredBillboards = billboards.filter(b => {
    const matchesFilter = filter === 'All' ? true : b.type === filter;
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.town.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const ledBoards = filteredBillboards.filter(b => b.type === BillboardType.LED);
  const staticBoards = filteredBillboards.filter(b => b.type === BillboardType.Static);

  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    try {
        const map = L.map(mapContainerRef.current).setView([-19.0154, 29.1549], 6);
        mapRef.current = map;
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: 'OpenStreetMap', maxZoom: 19 }).addTo(map);
        const DefaultIcon = L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });
        filteredBillboards.forEach(b => {
            if (b.coordinates) {
                const popupContent = isClientView ? `<div><strong>${b.name}</strong></div>` : `<div><strong>${b.name}</strong><div>${b.location}</div></div>`;
                L.marker([b.coordinates.lat, b.coordinates.lng], { icon: DefaultIcon }).addTo(map).bindPopup(popupContent);
            }
        });
    } catch (e) { console.error("Failed to initialize map:", e); }
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } }
  }, [viewMode, filter, isClientView, searchTerm]); 

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBillboard) { updateBillboard(editingBillboard); setBillboards([...getBillboards()]); setEditingBillboard(null); }
  };
  const handleConfirmDelete = () => {
      if (billboardToDelete) { deleteBillboard(billboardToDelete.id); setBillboards([...getBillboards()]); setBillboardToDelete(null); }
  };
  const handleAddBillboard = (e: React.FormEvent) => {
    e.preventDefault();
    const billboard: Billboard = {
      id: (Date.now()).toString(), name: newBillboard.name!, location: newBillboard.location!, town: newBillboard.town || 'Harare', type: newBillboard.type!, width: newBillboard.width!, height: newBillboard.height!,
      sideARate: newBillboard.sideARate, sideBRate: newBillboard.sideBRate, ratePerSlot: newBillboard.ratePerSlot, totalSlots: newBillboard.totalSlots, rentedSlots: 0,
      sideAStatus: 'Available', sideBStatus: 'Available', imageUrl: newBillboard.imageUrl, visibility: newBillboard.visibility, coordinates: newBillboard.coordinates || { lat: -17.82, lng: 31.05 }
    };
    addBillboard(billboard); setBillboards([...getBillboards()]); setIsAddModalOpen(false);
    setNewBillboard({ name: '', location: '', town: 'Harare', type: BillboardType.Static, width: 0, height: 0, sideARate: 0, sideBRate: 0, ratePerSlot: 0, totalSlots: 10, imageUrl: '', visibility: '', coordinates: { lat: -17.8292, lng: 31.0522 } });
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            if (isEdit && editingBillboard) { setEditingBillboard({...editingBillboard, imageUrl: base64}); } else { setNewBillboard({...newBillboard, imageUrl: base64}); }
        };
        reader.readAsDataURL(file);
    }
  };
  const getClientName = (clientId?: string) => { if(!clientId) return 'Available'; return mockClients.find(c => c.id === clientId)?.companyName || 'Unknown'; };
  const shareBillboard = (b: Billboard) => { navigator.clipboard.writeText(`Check out this billboard: ${b.name} at ${b.location}`); alert("Copied to clipboard!"); };
  const copyMapLink = () => { navigator.clipboard.writeText("https://app.spiritus.com/map/view/public-share-id-123"); setIsMapShareModalOpen(false); alert("Map link copied!"); };

  return (
    <>
      <div className="space-y-8 relative font-sans h-[calc(100vh-140px)] flex flex-col animate-fade-in">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 shrink-0">
          <div><h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 mb-2">Inventory Management</h2><p className="text-slate-500 font-medium">Manage static sides and LED slots across Zimbabwe</p></div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
             <div className="relative group w-full sm:w-64"><Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-slate-800 transition-colors" size={18} /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search billboards..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full bg-white outline-none focus:border-slate-800 transition-all text-sm shadow-sm"/></div>
             <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className="flex bg-white rounded-full border border-slate-200 p-1 shadow-sm">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`} title="Grid View"><GridIcon size={18} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`} title="List View"><ListIcon size={18} /></button>
                    <button onClick={() => setViewMode('map')} className={`p-2 rounded-full transition-all ${viewMode === 'map' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`} title="Map View"><MapIcon size={18} /></button>
                </div>
                <div className="flex bg-white rounded-full border border-slate-200 p-1 shadow-sm hidden sm:flex">{(['All', 'Static', 'LED'] as const).map(type => (<button key={type} onClick={() => setFilter(type)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${filter === type ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>{type}</button>))}</div>
                <button onClick={() => setIsMapShareModalOpen(true)} className="bg-white text-slate-600 p-3 rounded-full hover:bg-slate-50 border border-slate-200 transition-colors shadow-sm" title="Share Map"><Share2 size={20} /></button>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-slate-900 text-white p-3 rounded-full hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200" title="Add Billboard"><Plus size={20} /></button>
             </div>
          </div>
        </div>
        <div className="flex-1 min-h-0 relative animate-fade-in">
          {viewMode === 'map' ? (
              <div className="h-full w-full rounded-3xl overflow-hidden shadow-sm border border-slate-200 relative z-0"><div ref={mapContainerRef} className="h-full w-full bg-slate-100" /><div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur shadow-lg border border-slate-200 rounded-xl p-2 flex flex-col gap-2"><button onClick={() => setIsClientView(!isClientView)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${isClientView ? 'bg-indigo-50 text-indigo-700' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}>{isClientView ? <Eye size={14}/> : <EyeOff size={14} />} {isClientView ? 'Client View On' : 'Admin View'}</button></div></div>
          ) : viewMode === 'list' ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col"><div className="overflow-y-auto"><table className="w-full text-left text-sm text-slate-600"><thead className="bg-slate-50/50 border-b border-slate-100 sticky top-0 z-10 backdrop-blur-sm"><tr><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Asset</th><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Location</th><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Type</th><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Status / Occupancy</th><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Rate</th><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredBillboards.map(b => (<tr key={b.id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4 flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">{b.imageUrl ? <img src={b.imageUrl} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20}/></div>}</div><span className="font-bold text-slate-900">{b.name}</span></td><td className="px-6 py-4"><div className="text-slate-800 font-medium">{b.town}</div><div className="text-xs text-slate-500">{b.location}</div></td><td className="px-6 py-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${b.type === 'LED' ? 'bg-indigo-50 text-indigo-700' : 'bg-orange-50 text-orange-700'}`}>{b.type}</span></td><td className="px-6 py-4">{b.type === BillboardType.Static ? (<div className="flex gap-2"><div className={`px-2 py-1 rounded text-xs ${b.sideAStatus === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>A</div><div className={`px-2 py-1 rounded text-xs ${b.sideBStatus === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>B</div></div>) : (<div className="flex items-center gap-2"><div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{width: `${(b.rentedSlots! / b.totalSlots!) * 100}%`}}></div></div><span className="text-xs font-bold">{b.rentedSlots}/{b.totalSlots}</span></div>)}</td><td className="px-6 py-4 font-mono text-xs">{b.type === BillboardType.Static ? `$${b.sideARate} | $${b.sideBRate}` : `$${b.ratePerSlot}/slot`}</td><td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => setEditingBillboard(b)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"><Edit2 size={16}/></button><button onClick={() => shareBillboard(b)} className="p-2 text-indigo-400 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg"><Link2 size={16}/></button><button onClick={() => setBillboardToDelete(b)} className="p-2 text-red-400 hover:text-red-900 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button></div></td></tr>))}</tbody></table></div></div>
          ) : (
            <div className="pb-8 overflow-y-auto max-h-full pr-2">
                {(filter === 'All' || filter === 'LED') && ledBoards.length > 0 && (<div className="mb-10"><h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3"><span className="w-1.5 h-8 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></span>Digital / LED Inventory <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{ledBoards.length}</span></h3><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">{ledBoards.map(billboard => (<BillboardCard key={billboard.id} billboard={billboard} onEdit={setEditingBillboard} onDelete={setBillboardToDelete} getClientName={getClientName} onShare={shareBillboard}/>))}</div></div>)}
                {(filter === 'All' || filter === 'Static') && staticBoards.length > 0 && (<div className="mb-10"><h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3"><span className="w-1.5 h-8 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>Static Inventory <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{staticBoards.length}</span></h3><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">{staticBoards.map(billboard => (<BillboardCard key={billboard.id} billboard={billboard} onEdit={setEditingBillboard} onDelete={setBillboardToDelete} getClientName={getClientName} onShare={shareBillboard}/>))}</div></div>)}
                {filteredBillboards.length === 0 && (<div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200"><p className="text-slate-400 font-medium">No billboards found matching this filter.</p></div>)}
            </div>
          )}
        </div>
      </div>
      {isMapShareModalOpen && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all animate-fade-in"><div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full border border-white/20 p-6"><div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600"><Share2 size={24} /></div><h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Share Map</h3><p className="text-slate-500 text-center text-sm mb-6">Clients will see a simplified view without pricing.</p><div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between mb-4"><code className="text-xs text-slate-600 truncate max-w-[200px]">https://app.spiritus.com/map/view/public</code><button onClick={copyMapLink} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"><Copy size={16}/></button></div><div className="flex gap-3"><button onClick={() => setIsMapShareModalOpen(false)} className="flex-1 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors">Close</button><button onClick={() => { setIsClientView(true); setViewMode('map'); setIsMapShareModalOpen(false); }} className="flex-1 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors shadow-lg shadow-indigo-500/30">Preview</button></div></div></div>)}
      {isAddModalOpen && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all overflow-y-auto"><div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-3xl w-full border border-white/20 my-8"><div className="p-6 border-b border-slate-100 flex justify-between items-center"><h3 className="text-xl font-bold text-slate-900">Add New Billboard</h3><button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button></div><form onSubmit={handleAddBillboard} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8"><div className="space-y-6"><MinimalInput label="Name" value={newBillboard.name} onChange={(e: any) => setNewBillboard({...newBillboard, name: e.target.value})} required /><MinimalInput label="Location Description" value={newBillboard.location} onChange={(e: any) => setNewBillboard({...newBillboard, location: e.target.value})} required /><MinimalSelect label="Town / City" value={newBillboard.town} onChange={(e: any) => setNewBillboard({...newBillboard, town: e.target.value})} options={ZIM_TOWNS.map(t => ({ value: t, label: t }))}/><MinimalSelect label="Type" value={newBillboard.type} onChange={(e: any) => setNewBillboard({...newBillboard, type: e.target.value})} options={[{ value: BillboardType.Static, label: 'Static (Side A/B)' }, { value: BillboardType.LED, label: 'LED (Slots)' }]}/> <MinimalTextArea label="Visibility & Traffic Analysis" value={newBillboard.visibility || ''} onChange={(e: any) => setNewBillboard({...newBillboard, visibility: e.target.value})}/></div><div className="space-y-6"><div className="space-y-2"><p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Asset Image</p><div className="flex items-center gap-4"><div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">{newBillboard.imageUrl ? <img src={newBillboard.imageUrl} className="w-full h-full object-cover"/> : <ImageIcon className="text-slate-300" />}</div><label className="flex-1 cursor-pointer"><span className="block px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg text-center hover:bg-slate-50 transition-colors">Upload Photo</span><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} /></label></div></div><div className="grid grid-cols-2 gap-4"><MinimalInput label="Width (m)" type="number" value={newBillboard.width} onChange={(e: any) => setNewBillboard({...newBillboard, width: Number(e.target.value)})} /><MinimalInput label="Height (m)" type="number" value={newBillboard.height} onChange={(e: any) => setNewBillboard({...newBillboard, height: Number(e.target.value)})} /></div><div className="grid grid-cols-2 gap-4"><MinimalInput label="Latitude" type="number" value={newBillboard.coordinates?.lat} onChange={(e: any) => setNewBillboard({...newBillboard, coordinates: {...newBillboard.coordinates!, lat: Number(e.target.value)}})} /><MinimalInput label="Longitude" type="number" value={newBillboard.coordinates?.lng} onChange={(e: any) => setNewBillboard({...newBillboard, coordinates: {...newBillboard.coordinates!, lng: Number(e.target.value)}})} /></div>{newBillboard.type === BillboardType.Static ? (<div className="space-y-4 pt-2"><p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Monthly Rates</p><div className="grid grid-cols-2 gap-4"><MinimalInput label="Side A Rate ($)" type="number" value={newBillboard.sideARate} onChange={(e: any) => setNewBillboard({...newBillboard, sideARate: Number(e.target.value)})} /><MinimalInput label="Side B Rate ($)" type="number" value={newBillboard.sideBRate} onChange={(e: any) => setNewBillboard({...newBillboard, sideBRate: Number(e.target.value)})} /></div></div>) : (<div className="space-y-4 pt-2"><p className="text-xs font-bold uppercase text-slate-400 tracking-wider">LED Configuration</p><div className="grid grid-cols-2 gap-4"><MinimalInput label="Total Slots" type="number" value={newBillboard.totalSlots} onChange={(e: any) => setNewBillboard({...newBillboard, totalSlots: Number(e.target.value)})} /><MinimalInput label="Rate / Slot ($)" type="number" value={newBillboard.ratePerSlot} onChange={(e: any) => setNewBillboard({...newBillboard, ratePerSlot: Number(e.target.value)})} /></div></div>)}</div><div className="md:col-span-2 pt-4 flex gap-4"><button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">Cancel</button><button type="submit" className="flex-1 py-3 text-white bg-slate-900 rounded-xl hover:bg-slate-800 shadow-lg font-bold uppercase tracking-wider transition-all">Create Asset</button></div></form></div></div>)}
      {editingBillboard && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all overflow-y-auto"><div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full border border-white/20 my-8"><div className="p-6 border-b border-slate-100 flex justify-between items-center"><h3 className="text-xl font-bold text-slate-900">Edit Asset</h3><button onClick={() => setEditingBillboard(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button></div><form onSubmit={handleSaveEdit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8"><div className="space-y-6"><MinimalInput label="Name" value={editingBillboard.name} onChange={(e: any) => setEditingBillboard({...editingBillboard, name: e.target.value})} /><MinimalSelect label="Town" value={editingBillboard.town} onChange={(e: any) => setEditingBillboard({...editingBillboard, town: e.target.value})} options={ZIM_TOWNS.map(t => ({value:t, label:t}))} /><div className="grid grid-cols-2 gap-4"><MinimalInput label="Latitude" type="number" value={editingBillboard.coordinates?.lat} onChange={(e: any) => setEditingBillboard({...editingBillboard, coordinates: {...editingBillboard.coordinates!, lat: Number(e.target.value)}})} /><MinimalInput label="Longitude" type="number" value={editingBillboard.coordinates?.lng} onChange={(e: any) => setEditingBillboard({...editingBillboard, coordinates: {...editingBillboard.coordinates!, lng: Number(e.target.value)}})} /></div><MinimalTextArea label="Visibility & Traffic Analysis" value={editingBillboard.visibility || ''} onChange={(e: any) => setEditingBillboard({...editingBillboard, visibility: e.target.value})}/></div><div className="space-y-6"><div className="space-y-2"><p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Asset Image</p><div className="flex items-center gap-4"><div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">{editingBillboard.imageUrl ? <img src={editingBillboard.imageUrl} className="w-full h-full object-cover"/> : <ImageIcon className="text-slate-300" />}</div><label className="flex-1 cursor-pointer"><span className="block px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg text-center hover:bg-slate-50 transition-colors">Change Photo</span><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} /></label></div></div>{editingBillboard.type === BillboardType.Static ? (<div className="grid grid-cols-2 gap-6 pt-2"><MinimalInput label="Side A Monthly ($)" type="number" value={editingBillboard.sideARate} onChange={(e: any) => setEditingBillboard({...editingBillboard, sideARate: Number(e.target.value)})} /><MinimalInput label="Side B Monthly ($)" type="number" value={editingBillboard.sideBRate} onChange={(e: any) => setEditingBillboard({...editingBillboard, sideBRate: Number(e.target.value)})} /></div>) : (<div className="grid grid-cols-2 gap-6 pt-2"><MinimalInput label="Total Slots" type="number" value={editingBillboard.totalSlots} onChange={(e: any) => setEditingBillboard({...editingBillboard, totalSlots: Number(e.target.value)})} /><MinimalInput label="Rate / Slot ($)" type="number" value={editingBillboard.ratePerSlot} onChange={(e: any) => setEditingBillboard({...editingBillboard, ratePerSlot: Number(e.target.value)})} /></div>)}<button type="submit" className="w-full py-4 text-white bg-slate-900 rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2 shadow-xl font-bold uppercase tracking-wider transition-all mt-8"><Save size={18} /> Save Changes</button></div></form></div></div>)}
      {billboardToDelete && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all"><div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full border border-white/20 p-6 text-center"><div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-50"><AlertTriangle className="text-red-500" size={32} /></div><h3 className="text-xl font-bold text-slate-900 mb-2">Delete Asset?</h3><p className="text-slate-500 mb-6">Are you sure you want to delete <span className="font-bold text-slate-700">{billboardToDelete.name}</span>? This action cannot be undone.</p><div className="flex gap-3"><button onClick={() => setBillboardToDelete(null)} className="flex-1 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors">Cancel</button><button onClick={handleConfirmDelete} className="flex-1 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors shadow-lg shadow-red-500/30">Delete</button></div></div></div>)}
    </>
  );
};