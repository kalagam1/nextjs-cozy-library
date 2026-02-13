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

  // FIXED: Properly appends a new book without overwriting old ones
  const addNewBook = () => {
    if (!newTitle.trim()) return;
    const colors = ["#b45309", "#78350f", "#451a03", "#92400e"];
    const newItem = {
      id: "id-" + Math.random().toString(36).substr(2, 9),
      type: 'book',
      label: newTitle,
      color: colors[items.length % colors.length],
      rating: 0,
      x: 50, y: 50
    };
    setItems(prev => [...prev, newItem]); // Using functional update to prevent overwrites
    setNewTitle("");
    setIsAddingBook(false);
  };

  const addPlant = (icon) => {
    const newItem = {
      id: "id-" + Math.random().toString(36).substr(2, 9),
      type: 'plant',
      content: icon,
      x: 100, y: 100
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateRating = (id, rate) => {
    setItems(items.map(item => item.id === id ? { ...item, rating: rate } : item));
    setSelectedItem(prev => ({ ...prev, rating: rate }));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItem(null);
  };

  const generateShareLink = () => {
    const data = btoa(JSON.stringify(items));
    const url = `${window.location.origin}${window.location.pathname}?data=${data}`;
    navigator.clipboard.writeText(url).then(() => alert("Link copied!"));
  };

  const POTTED_PLANTS = ['🪴', '🌵', '🎍', '🪴', '🌵', '🎍'];

  return (
    <main className="min-h-screen flex font-serif overflow-hidden relative bg-[#fefce8]">
      
      {/* SHARE LINK - TOP RIGHT */}
      <button onClick={generateShareLink} className="absolute top-6 right-6 z-50 bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-700">
        SHARE LIBRARY
      </button>

      {/* LEFT SIDEBAR */}
      <div className="relative z-10 w-24 flex flex-col items-center gap-6 bg-white/90 border-r-2 border-amber-100 p-4 h-screen shadow-xl overflow-y-auto">
        <button onClick={() => setIsAddingBook(true)} className="w-16 h-16 bg-amber-700 text-white rounded-2xl text-2xl shadow-lg active:scale-95 transition">📖+</button>
        <div className="w-10 h-[2px] bg-amber-100" />
        {POTTED_PLANTS.map((p, idx) => (
          <button key={idx} onClick={() => addPlant(p)} className="text-5xl hover:scale-110 transition drop-shadow-sm">{p}</button>
        ))}
      </div>

      {/* SHELF AREA */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-12">
        <div ref={constraintsRef} className="relative w-full max-w-4xl h-[70vh] bg-[#fffcf0] border-x-[12px] border-[#3e1d0b] shadow-xl rounded-sm">
          {[30, 60, 90].map(top => (
            <div key={top} style={{ top: `${top}%` }} className="absolute w-full h-5 bg-[#5d2d12] border-b-4 border-[#2d1608]" />
          ))}

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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs">
              <h2 className="text-xl font-bold mb-4">Book Title:</h2>
              <input autoFocus className="w-full p-3 bg-amber-50 rounded-xl mb-6 outline-none border-2 border-amber-100 focus:border-amber-500" 
                     value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <button onClick={addNewBook} className="w-full bg-amber-900 text-white py-3 rounded-xl font-bold">Add to Shelf</button>
            </div>
          </div>
        )}

        {selectedItem && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs flex flex-col items-center text-center">
              <h2 className="text-lg font-bold mb-4 text-amber-900 uppercase tracking-tighter">{selectedItem.type === 'book' ? selectedItem.label : "Potted Plant"}</h2>
              
              {/* FIXED: Only show stars for Books */}
              {selectedItem.type === 'book' && (
                <div className="flex gap-1 text-3xl mb-8">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => updateRating(selectedItem.id, star)} className={star <= (selectedItem.rating || 0) ? "text-yellow-400" : "text-gray-200"}>★</button>
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
