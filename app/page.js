"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AestheticUniverse() {
  const [activeApp, setActiveApp] = useState('home');
  const [items, setItems] = useState([]);
  const [libraryName, setLibraryName] = useState("My Cozy Library");
  const [isEditingName, setIsEditingName] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [tempBook, setTempBook] = useState({ title: "", rating: 0, stage: 'title' });
  const constraintsRef = useRef(null);

  // --- LIBRARY LOGIC ---
  useEffect(() => {
    const savedItems = localStorage.getItem('cozy-universe-items');
    const savedName = localStorage.getItem('cozy-universe-name');
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedName) setLibraryName(savedName);
  }, []);

  useEffect(() => {
    localStorage.setItem('cozy-universe-items', JSON.stringify(items));
    localStorage.setItem('cozy-universe-name', libraryName);
  }, [items, libraryName]);

  const getNextAvailableSlot = () => {
    const MAX_PER_SHELF = 10;
    const occupiedSlots = new Set(items.map(item => item.gridSlot));
    const shelfPositions = [18, 36, 54, 72, 90]; 
    for (let s = 0; s < 5; s++) {
      for (let p = 0; p < MAX_PER_SHELF; p++) {
        const slotId = `${s}-${p}`;
        if (!occupiedSlots.has(slotId)) return { slotId, x: 40 + (p * 80), y: shelfPositions[s] + "%" };
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

  const addDecor = (icon, label) => {
    const pos = getNextAvailableSlot();
    if (!pos) return alert("Shelves are full!");
    setItems(prev => [...prev, {
      id: "decor-" + Date.now(),
      type: 'decor',
      label: label,
      content: icon,
      gridSlot: pos.slotId,
      x: pos.x, y: pos.y
    }]);
  };

  const apps = [
    { id: 'photobooth', name: 'Photobooth', icon: '📸', color: 'bg-pink-100' },
    { id: 'library', name: 'Virtual Library', icon: '📚', color: 'bg-amber-100' },
    { id: 'moodboard', name: 'Mood Board', icon: '🎨', color: 'bg-purple-100' },
    { id: 'capsule', name: 'Time Capsule', icon: '✉️', color: 'bg-blue-100' },
    { id: 'habits', name: 'Plant Tracker', icon: '🌱', color: 'bg-green-100' },
  ];

  return (
    <main className={`min-h-screen font-serif overflow-hidden relative transition-colors duration-700 ${isNight ? 'bg-[#0f172a]' : 'bg-[#fdf6e3]'}`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
        .handwritten { font-family: 'Caveat', cursive; }
      `}</style>

      {/* GLOBAL HEADER */}
      <nav className="p-6 flex justify-between items-center bg-white/30 backdrop-blur-md border-b border-amber-100/20 sticky top-0 z-50">
        <h1 className="text-2xl font-bold handwritten cursor-pointer" onClick={() => setActiveApp('home')}>
          My Cozy Universe
        </h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsNight(!isNight)} className="text-xl p-2 rounded-full bg-white/50">{isNight ? '☀️' : '🌙'}</button>
        </div>
      </nav>

      <div className="p-4 h-[calc(100vh-88px)] flex items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* DASHBOARD */}
          {activeApp === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl">
              {apps.map((app) => (
                <button key={app.id} onClick={() => setActiveApp(app.id)} className={`${app.color} p-10 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center gap-4 group border-2 border-transparent hover:border-white`}>
                  <span className="text-6xl group-hover:scale-110 transition-transform">{app.icon}</span>
                  <span className="font-bold uppercase tracking-wider text-xs">{app.name}</span>
                </button>
              ))}
            </motion.div>
          )}

          {/* VIRTUAL LIBRARY APP */}
          {activeApp === 'library' && (
            <motion.div key="library" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full h-full bg-white/80 rounded-[3rem] shadow-2xl p-4 relative overflow-hidden flex">
              
              {/* BACK BUTTON */}
              <button onClick={() => setActiveApp('home')} className="absolute top-4 left-4 z-50 bg-amber-900 text-white px-4 py-2 rounded-full font-bold text-xs">← HOME</button>

              {/* LIBRARY SIDEBAR */}
              <div className="w-20 flex flex-col items-center gap-4 border-r p-2 mt-12">
                <button onClick={() => setIsAddingBook(true)} className="w-12 h-12 bg-amber-700 text-white rounded-xl text-lg shadow-lg">📖+</button>
                {['🪴', '🌵', '🎍', '🏺', '🍵'].map((d, i) => (
                   <button key={i} onClick={() => addDecor(d, 'Decor')} className="text-3xl hover:scale-110">{d}</button>
                ))}
              </div>

              {/* LIBRARY MAIN */}
              <div className="flex-1 flex flex-col items-center p-4">
                <div className="mb-4">
                   {isEditingName ? (
                     <input autoFocus className="text-4xl font-bold bg-transparent border-b-2 border-amber-500 outline-none handwritten text-center" value={libraryName} onChange={(e) => setLibraryName(e.target.value)} onBlur={() => setIsEditingName(false)} />
                   ) : (
                     <h2 onClick={() => setIsEditingName(true)} className="text-4xl font-bold handwritten cursor-pointer text-amber-900">{libraryName}</h2>
                   )}
                </div>

                <div ref={constraintsRef} className="relative w-full max-w-4xl h-[70vh] border-x-[10px] border-amber-900/10 bg-[#fffcf0] shadow-inner rounded-sm">
                  {[18, 36, 54, 72, 90].map(top => (
                    <div key={top} style={{ top: `${top}%` }} className="absolute w-full h-3 border-b-4 bg-[#5d2d12] border-[#2d1608]" />
                  ))}

                  {items.map((item) => (
                    <motion.div key={item.id} className="absolute z-20" style={{ left: item.x, top: item.y }} drag dragConstraints={constraintsRef} dragMomentum={false} onTap={() => setSelectedItem(item)}>
                      {item.type === 'book' ? (
                        <div className="w-[40px] h-24 rounded-sm shadow-md flex items-center justify-center border-l-[3px] border-black/20 text-white transform -translate-y-[100%] cursor-pointer" style={{ backgroundColor: item.color }}>
                          <span className="rotate-90 text-[8px] font-bold uppercase tracking-widest handwritten whitespace-nowrap">{item.label}</span>
                        </div>
                      ) : (
                        <span className="text-5xl select-none drop-shadow-md transform -translate-y-[100%] block cursor-grab active:cursor-grabbing">{item.content}</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* OTHER APPS PLACEHOLDER */}
          {activeApp !== 'home' && activeApp !== 'library' && (
             <motion.div key="other" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                <button onClick={() => setActiveApp('home')} className="mb-8 bg-slate-200 px-6 py-2 rounded-full font-bold uppercase text-xs tracking-widest">Back to Desk</button>
                <h2 className="text-6xl">🚧</h2>
                <p className="handwritten text-3xl mt-4 italic">The {activeApp} is being built...</p>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {isAddingBook && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200]">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs text-center border-2 border-amber-500/10">
              {tempBook.stage === 'title' ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 handwritten">New Book Title</h2>
                  <input autoFocus className="w-full p-2 bg-amber-50 rounded-lg mb-4 text-center font-bold" onChange={(e) => setTempBook({...tempBook, title: e.target.value})} />
                  <button onClick={() => setTempBook({...tempBook, stage: 'rating'})} className="w-full bg-amber-900 text-white py-2 rounded-lg font-bold">Next</button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-1 handwritten">{tempBook.title}</h2>
                  <div className="flex justify-center gap-1 text-3xl mb-6">
                    {[1,2,3,4,5].map(s => <button key={s} onClick={() => setTempBook({...tempBook, rating: s})} className={s <= tempBook.rating ? "text-yellow-500" : "text-gray-200"}>★</button>)}
                  </div>
                  <button onClick={finalizeBook} className="w-full bg-green-700 text-white py-2 rounded-lg font-bold">Add to Shelf</button>
                </>
              )}
              <button onClick={() => setIsAddingBook(false)} className="mt-4 text-xs text-gray-400">Cancel</button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
