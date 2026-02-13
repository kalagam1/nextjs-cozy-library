"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CozyLibrary() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newTitle, setNewTitle] = useState("");
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

  const addNewBook = () => {
    if (!newTitle.trim()) return;
    const colors = ["#b45309", "#78350f", "#451a03", "#92400e"];
    const newItem = {
      id: Date.now(),
      type: 'book',
      label: newTitle,
      color: colors[items.length % colors.length],
      rating: 0,
      x: 50, y: 50
    };
    setItems([...items, newItem]);
    setNewTitle("");
    setIsAddingBook(false);
  };

  const addPlant = (icon) => {
    setItems([...items, { id: Date.now(), type: 'plant', content: icon, x: 60, y: 60 }]);
  };

  const updateRating = (id, rate) => {
    const updated = items.map(item => item.id === id ? { ...item, rating: rate } : item);
    setItems(updated);
    setSelectedItem(updated.find(i => i.id === id));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItem(null);
  };

  const generateShareLink = () => {
    const data = btoa(JSON.stringify(items));
    const url = `${window.location.origin}${window.location.pathname}?data=${data}`;
    navigator.clipboard.writeText(url).then(() => alert("Share link copied!"));
  };

  // STRICTLY POTTED PLANTS ONLY
  const POTTED_PLANTS = ['🪴', '🌵', '🎍', '🪴', '🌵', '🎍', '🪴', '🌵', '🎍', '🪴'];

  return (
    <main className="min-h-screen flex font-serif overflow-hidden relative bg-cover bg-center" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop')` }}>
      
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

      {/* SHARE LINK - TOP RIGHT */}
      <button onClick={generateShareLink} className="absolute top-6 right-6 z-50 bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-700">
        SHARE LIBRARY
      </button>

      {/* LEFT SIDEBAR MENU */}
      <div className="relative z-10 w-24 flex flex-col items-center gap-6 bg-white/90 backdrop-blur-md border-r border-amber-200 p-4 h-screen shadow-2xl overflow-y-auto">
        <button onClick={() => setIsAddingBook(true)} className="w-16 h-16 bg-amber-800 text-white rounded-2xl text-2xl shadow-lg hover:scale-105 active:scale-95 transition">📖+</button>
        <div className="w-10 h-[2px] bg-amber-200" />
        {POTTED_PLANTS.map((p, idx) => (
          <button key={idx} onClick={() => addPlant(p)} className="text-5xl hover:scale-125 transition drop-shadow-md">
            {p}
          </button>
        ))}
      </div>

      {/* CENTERED SHELF AREA */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-12">
        <div ref={constraintsRef} className="relative w-full max-w-4xl h-[70vh] bg-white/5 backdrop-blur-sm border-x-[12px] border-[#3e1d0b] shadow-2xl rounded-sm">
          {/* Shelves */}
          {[30, 60, 90].map(top => (
            <div key={top} style={{ top: `${top}%` }} className="absolute w-full h-5 bg-[#5d2d12] border-b-4 border-[#2d1608] shadow-lg" />
          ))}

          {/* DRAGGABLE ITEMS */}
          {items.map((item) => (
            <motion.div
              key={item.id}
              drag dragConstraints={constraintsRef} dragMomentum={false}
              className="absolute cursor-grab active:cursor-grabbing p-1"
              onTap={() => setSelectedItem(item)}
            >
              {item.type === 'book' ? (
                <div className="w-12 h-40 rounded-sm shadow-xl flex items-center justify-center border-l-[6px] border-black/30 text-white" style={{ backgroundColor: item.color }}>
                  <span className="rotate-90 text-[10px] font-bold uppercase whitespace-nowrap tracking-widest">{item.label}</span>
                </div>
              ) : (
                <span className="text-7xl select-none drop-shadow-xl">{item.content}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {isAddingBook && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs">
              <h2 className="text-xl font-bold text-amber-950 mb-4">Add New Book</h2>
              <input autoFocus className="w-full p-3 bg-amber-50 rounded-xl mb-6 outline-none border-2 border-amber-100 focus:border-amber-500" 
                     value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <button onClick={addNewBook} className="w-full bg-amber-900 text-white py-3 rounded-xl font-bold">Add to Shelf</button>
            </motion.div>
          </div>
        )}

        {selectedItem && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs flex flex-col items-center">
              <h2 className="text-lg font-bold mb-4 text-amber-900">{selectedItem.label || "Potted Plant"}</h2>
              <div className="flex gap-1 text-3xl mb-8">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => updateRating(selectedItem.id, star)} className={star <= (selectedItem.rating || 0) ? "text-yellow-400" : "text-gray-200"}>★</button>
                ))}
              </div>
              <div className="flex gap-2 w-full">
                <button onClick={() => setSelectedItem(null)} className="flex-1 bg-gray-100 py-3 rounded-xl font-bold">Close</button>
                <button onClick={() => deleteItem(selectedItem.id)} className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
