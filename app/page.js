"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CozyLibrary() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [tempBook, setTempBook] = useState({ title: "", rating: 0, stage: 'title' });
  const constraintsRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('data');
    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData));
        setItems(decoded || []);
      } catch (e) { console.error("Load failed"); }
    }
  }, []);

  // NEW: Logic to find the first truly empty slot
  const getNextAvailableSlot = () => {
    const MAX_PER_SHELF = 10;
    const TOTAL_SHELVES = 3;
    
    // Create a map of occupied slots based on initial spawn positions
    const occupiedSlots = new Set(items.map(item => item.gridSlot));

    for (let s = 0; s < TOTAL_SHELVES; s++) {
      for (let p = 0; p < MAX_PER_SHELF; p++) {
        const slotId = `${s}-${p}`;
        if (!occupiedSlots.has(slotId)) {
          return {
            slotId,
            x: 40 + (p * 80),
            y: (s * 30) + 30 + "%"
          };
        }
      }
    }
    return null;
  };

  const finalizeBook = () => {
    const pos = getNextAvailableSlot();
    if (!pos) return alert("Shelves are full!");

    const colors = ["#b45309", "#78350f", "#451a03", "#92400e", "#5d2d12"];
    const newBook = {
      id: "book-" + Date.now(),
      type: 'book',
      label: tempBook.title,
      rating: tempBook.rating,
      gridSlot: pos.slotId, // Track which slot this item "owns"
      color: colors[items.length % colors.length],
      x: pos.x, 
      y: pos.y 
    };

    setItems(prev => [...prev, newBook]);
    setIsAddingBook(false);
    setTempBook({ title: "", rating: 0, stage: 'title' });
  };

  const addDecor = (icon, label) => {
    const pos = getNextAvailableSlot();
    if (!pos) return alert("Shelves are full!");

    const newItem = {
      id: "decor-" + Date.now(),
      type: 'decor',
      label: label,
      content: icon,
      gridSlot: pos.slotId, // Track which slot this item "owns"
      x: pos.x,
      y: pos.y
    };
    setItems(prev => [...prev, newItem]);
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItem(null);
  };

  const generateShareLink = () => {
    const data = btoa(JSON.stringify(items));
    const url = `${window.location.origin}${window.location.pathname}?data=${data}`;
    navigator.clipboard.writeText(url).then(() => alert("Link Copied!"));
  };

  const POTTED_PLANTS = ['🪴', '🌵', '🎍'];
  const DECOR = [
    { icon: '🏺', label: 'Classic Vase' },
    { icon: '🍵', label: 'Small Pot' }
  ];

  return (
    <main className={`min-h-screen flex font-serif overflow-hidden relative transition-colors duration-700 ${isNight ? 'bg-[#0f172a]' : 'bg-[#fefce8]'}`}>
      
      {/* TOP CONTROLS */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <button onClick={() => setIsNight(!isNight)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-lg transition-all border-2 ${isNight ? 'bg-slate-800 text-amber-400 border-amber-400/30' : 'bg-white text-indigo-900 border-indigo-100'}`}>
          {isNight ? '☀️ Day' : '🌙 Night'}
        </button>
        <button onClick={generateShareLink} className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-700 transition-colors">SHARE</button>
      </div>

      {/* SIDEBAR */}
      <div className={`relative z-10 w-24 flex flex-col items-center gap-4 border-r-2 p-4 h-screen shadow-xl transition-colors duration-700 ${isNight ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-amber-100'}`}>
        <button onClick={() => setIsAddingBook(true)} className="w-14 h-14 bg-amber-700 text-white rounded-2xl text-xl shadow-lg mb-2 active:scale-95 transition-transform">📖+</button>
        <p className={`text-[10px] font-bold uppercase tracking-tighter ${isNight ? 'text-slate-400' : 'text-amber-800'}`}>Plants</p>
        {POTTED_PLANTS.map((p, idx) => (
          <button key={idx} onClick={() => addDecor(p, 'Potted Plant')} className="text-4xl hover:scale-110 transition">{p}</button>
        ))}
        <div className={`w-10 h-[2px] my-2 ${isNight ? 'bg-slate-700' : 'bg-amber-100'}`} />
        <p className={`text-[10px] font-bold uppercase tracking-tighter ${isNight ? 'text-slate-400' : 'text-amber-800'}`}>Decor</p>
        {DECOR.map((d, idx) => (
          <button key={idx} onClick={() => addDecor(d.icon, d.label)} className="text-4xl hover:scale-110 transition">{d.icon}</button>
        ))}
      </div>

      {/* SHELF AREA */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-12">
        <div ref={constraintsRef} className={`relative w-full max-w-4xl h-[70vh] border-x-[12px] shadow-2xl rounded-sm transition-colors duration-700 ${isNight ? 'bg-slate-800/40 border-slate-900' : 'bg-[#fffcf0] border-[#3e1d0b]'}`}>
          {[30, 60, 90].map(top => (
            <div key={top} style={{ top: `${top}%` }} className={`absolute w-full h-5 border-b-4 transition-colors duration-700 ${isNight ? 'bg-slate-900 border-black' : 'bg-[#5d2d12] border-[#2d1608]'}`} />
          ))}

          {items.map((item) => (
            <motion.div 
              key={item.id} 
              className="absolute p-1 z-20"
              style={{ left: item.x, top: item.y }}
              drag
              dragConstraints={constraintsRef}
              dragMomentum={false}
              onTap={() => setSelectedItem(item)}
            >
              {item.type === 'book' ? (
                <div className={`w-[65px] h-40 rounded-sm shadow-xl flex items-center justify-center border-l-[6px] border-black/30 text-white transform -translate-y-[100%] cursor-pointer ${isNight ? 'brightness-90' : ''}`} style={{ backgroundColor: item.color }}>
                  <span className="rotate-90 text-[10px] font-bold uppercase whitespace-nowrap tracking-widest">{item.label}</span>
                </div>
              ) : (
                <span className={`text-7xl select-none drop-shadow-xl transform -translate-y-[100%] block cursor-grab active:cursor-grabbing ${isNight ? 'brightness-90' : ''}`}>{item.content}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {isAddingBook && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs text-center">
              {tempBook.stage === 'title' ? (
                <>
                  <h2 className="text-xl font-bold mb-4 text-amber-900">Book Title</h2>
                  <input autoFocus className="w-full p-3 bg-amber-50 rounded-xl mb-6 border-2 border-amber-100 outline-none" 
                         onChange={(e) => setTempBook({...tempBook, title: e.target.value})} />
                  <button onClick={() => setTempBook({...tempBook, stage: 'rating'})} className="w-full bg-amber-900 text-white py-3 rounded-xl font-bold">Next</button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-4 text-amber-900 uppercase">{tempBook.title}</h2>
                  <div className="flex justify-center gap-1 text-4xl mb-8">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setTempBook({...tempBook, rating: star})} className={star <= tempBook.rating ? "text-yellow-400" : "text-gray-200"}>★</button>
                    ))}
                  </div>
                  <button onClick={finalizeBook} className="w-full bg-green-700 text-white py-3 rounded-xl font-bold">Finish</button>
                </>
              )}
            </motion.div>
          </div>
        )}

        {selectedItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs flex flex-col items-center">
              <h2 className="text-lg font-bold mb-2 text-amber-900 uppercase text-center">{selectedItem.label}</h2>
              {selectedItem.type === 'book' && (
                <div className="flex gap-1 text-3xl mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={star <= selectedItem.rating ? "text-yellow-400" : "text-gray-200"}>★</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 w-full">
                <button onClick={() => setSelectedItem(null)} className="flex-1 bg-gray-100 py-3 rounded-xl font-bold">Close</button>
                <button onClick={() => deleteItem(selectedItem.id)} className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold">Delete</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
