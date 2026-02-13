"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CozyLibrary() {
  const [items, setItems] = useState([]);
  const [libraryName, setLibraryName] = useState("My Cozy Library");
  const [isEditingName, setIsEditingName] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [tempBook, setTempBook] = useState({ title: "", rating: 0, stage: 'title' });
  const constraintsRef = useRef(null);

  useEffect(() => {
    const savedItems = localStorage.getItem('cozy-library-items');
    const savedName = localStorage.getItem('cozy-library-name');
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedName) setLibraryName(savedName);

    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('data');
    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData));
        // Expecting { name, items }
        if (decoded.items) setItems(decoded.items);
        if (decoded.name) setLibraryName(decoded.name);
      } catch (e) { console.error("Load failed"); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cozy-library-items', JSON.stringify(items));
    localStorage.setItem('cozy-library-name', libraryName);
  }, [items, libraryName]);

  const getNextAvailableSlot = () => {
    const MAX_PER_SHELF = 10;
    const occupiedSlots = new Set(items.map(item => item.gridSlot));
    for (let s = 0; s < 3; s++) {
      for (let p = 0; p < MAX_PER_SHELF; p++) {
        const slotId = `${s}-${p}`;
        if (!occupiedSlots.has(slotId)) return { slotId, x: 40 + (p * 80), y: (s * 30) + 30 + "%" };
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
      gridSlot: pos.slotId,
      color: colors[items.length % colors.length],
      x: pos.x, y: pos.y 
    };
    setItems(prev => [...prev, newBook]);
    setIsAddingBook(false);
    setTempBook({ title: "", rating: 0, stage: 'title' });
  };

  const updateRating = (newRating) => {
    setItems(prev => prev.map(item => 
      item.id === selectedItem.id ? { ...item, rating: newRating } : item
    ));
    setSelectedItem(prev => ({ ...prev, rating: newRating }));
  };

  const addDecor = (icon, label) => {
    const pos = getNextAvailableSlot();
    if (!pos) return alert("Shelves are full!");
    const newItem = {
      id: "decor-" + Date.now(),
      type: 'decor',
      label: label,
      content: icon,
      gridSlot: pos.slotId,
      x: pos.x, y: pos.y
    };
    setItems(prev => [...prev, newItem]);
  };

  const generateShareLink = () => {
    const exportData = { name: libraryName, items: items };
    const data = btoa(JSON.stringify(exportData));
    const url = `${window.location.origin}${window.location.pathname}?data=${data}`;
    navigator.clipboard.writeText(url).then(() => alert("Share link copied with your library name!"));
  };

  return (
    <main className={`min-h-screen flex font-serif overflow-hidden relative transition-colors duration-700 ${isNight ? 'bg-[#0f172a]' : 'bg-[#fefce8]'}`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
        .handwritten { font-family: 'Caveat', cursive; }
      `}</style>

      {/* TOP CONTROLS */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <button onClick={() => setIsNight(!isNight)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-lg transition-all border-2 ${isNight ? 'bg-slate-800 text-amber-400 border-amber-400/30' : 'bg-white text-indigo-900 border-indigo-100'}`}>
          {isNight ? '☀️' : '🌙'}
        </button>
        <button onClick={generateShareLink} className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-700">SHARE</button>
      </div>

      {/* SIDEBAR */}
      <div className={`relative z-10 w-24 flex flex-col items-center gap-4 border-r-2 p-4 h-screen shadow-xl transition-colors duration-700 ${isNight ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-amber-100'}`}>
        <button onClick={() => setIsAddingBook(true)} className="w-14 h-14 bg-amber-700 text-white rounded-2xl text-xl shadow-lg mb-2 active:scale-95 transition-transform">📖+</button>
        {['🪴', '🌵', '🎍'].map((p, i) => <button key={i} onClick={() => addDecor(p, 'Plant')} className="text-4xl hover:scale-110 transition">{p}</button>)}
        <div className={`w-10 h-[2px] my-2 ${isNight ? 'bg-slate-700' : 'bg-amber-100'}`} />
        {['🏺', '🍵'].map((d, i) => <button key={i} onClick={() => addDecor(d, 'Decor')} className="text-4xl hover:scale-110 transition">{d}</button>)}
      </div>

      {/* SHELF AREA */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-12">
        <div className="mb-8 text-center">
          {isEditingName ? (
            <input 
              autoFocus
              className={`text-5xl font-bold bg-transparent border-b-2 border-amber-500 outline-none handwritten text-center ${isNight ? 'text-amber-400' : 'text-amber-900'}`}
              value={libraryName}
              onChange={(e) => setLibraryName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
            />
          ) : (
            <h1 onClick={() => setIsEditingName(true)} className={`text-6xl font-bold cursor-pointer hover:opacity-70 transition handwritten ${isNight ? 'text-amber-400' : 'text-amber-900'}`}>{libraryName}</h1>
          )}
        </div>

        <div ref={constraintsRef} className={`relative w-full max-w-4xl h-[60vh] border-x-[12px] shadow-2xl rounded-sm transition-colors duration-700 ${isNight ? 'bg-slate-800/40 border-slate-900' : 'bg-[#fffcf0] border-[#3e1d0b]'}`}>
          {[30, 60, 90].map(top => (
            <div key={top} style={{ top: `${top}%` }} className={`absolute w-full h-5 border-b-4 ${isNight ? 'bg-slate-900 border-black' : 'bg-[#5d2d12] border-[#2d1608]'}`} />
          ))}

          {items.map((item) => (
            <motion.div key={item.id} className="absolute p-1 z-20" style={{ left: item.x, top: item.y }} drag dragConstraints={constraintsRef} dragMomentum={false} onTap={() => setSelectedItem(item)}>
              {item.type === 'book' ? (
                <div className={`w-[65px] h-40 rounded-sm shadow-xl flex items-center justify-center border-l-[6px] border-black/30 text-white transform -translate-y-[100%] mt-[-5px] cursor-pointer ${isNight ? 'brightness-90' : ''}`} style={{ backgroundColor: item.color }}>
                  <span className="rotate-90 text-[11px] font-bold uppercase whitespace-nowrap tracking-widest handwritten leading-none">{item.label}</span>
                </div>
              ) : (
                <span className={`text-7xl select-none drop-shadow-xl transform -translate-y-[100%] block cursor-grab active:cursor-grabbing mt-[-5px] ${isNight ? 'brightness-90' : ''}`}>{item.content}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {isAddingBook && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-amber-950">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs text-center border-2 border-amber-100">
              {tempBook.stage === 'title' ? (
                <>
                  <h2 className="text-2xl font-black mb-4 handwritten">Book Title</h2>
                  <input autoFocus className="w-full p-3 bg-amber-50 rounded-xl mb-6 border-2 border-amber-200 outline-none text-black font-bold handwritten text-xl" placeholder="The Great Gatsby..." onChange={(e) => setTempBook({...tempBook, title: e.target.value})} />
                  <button onClick={() => setTempBook({...tempBook, stage: 'rating'})} className="w-full bg-amber-900 text-white py-3 rounded-xl font-bold">Next</button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-black mb-1 handwritten uppercase">{tempBook.title}</h2>
                  <div className="flex justify-center gap-1 text-4xl mb-8">
                    {[1, 2, 3, 4, 5].map(star => <button key={star} onClick={() => setTempBook({...tempBook, rating: star})} className={star <= tempBook.rating ? "text-yellow-500" : "text-gray-200"}>★</button>)}
                  </div>
                  <button onClick={finalizeBook} className="w-full bg-green-700 text-white py-3 rounded-xl font-bold">Finish</button>
                </>
              )}
              <button onClick={() => setIsAddingBook(false)} className="mt-4 text-gray-500 font-bold hover:text-red-600 transition-colors text-sm">Cancel</button>
            </motion.div>
          </div>
        )}

        {selectedItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-amber-950">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs flex flex-col items-center border-2 border-amber-100">
              <h2 className="text-3xl font-black mb-1 handwritten uppercase text-center">{selectedItem.label}</h2>
              {selectedItem.type === 'book' && (
                <>
                  <p className="text-xs uppercase font-bold text-amber-800 mb-2">Edit Rating</p>
                  <div className="flex gap-1 text-4xl mb-8">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => updateRating(star)} className={star <= selectedItem.rating ? "text-yellow-500" : "text-gray-200"}>★</button>
                    ))}
                  </div>
                </>
              )}
              <div className="flex gap-2 w-full">
                <button onClick={() => setSelectedItem(null)} className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-black">Close</button>
                <button onClick={() => { setItems(items.filter(i => i.id !== selectedItem.id)); setSelectedItem(null); }} className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-black">Delete</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
