"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CozyLibrary() {
  const [items, setItems] = useState([]);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const constraintsRef = useRef(null);

  // Load shared data from URL
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

  const addItem = (type, content, label = "") => {
    const newItem = {
      id: Date.now(),
      type: type,
      content: content,
      label: label,
      x: 0,
      y: 0,
    };
    setItems([...items, newItem]);
    setIsAddingBook(false);
    setNewTitle("");
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const generateShareLink = () => {
    const data = btoa(JSON.stringify(items));
    const url = `${window.location.origin}${window.location.pathname}?data=${data}`;
    navigator.clipboard.writeText(url);
    alert("Share link copied! Send it to a friend.");
  };

  const PLANTS = ['🌿', '🌵', '🪴', '🎋', '🌴', '🍀', '🍃', '🍄', '🌲', '🎍'];
  const ANIMALS = ['🐱', '🐶', '🐸', '🦊', '🐰', '🐼', '🐨', '🐥', '🦎', '👻'];

  return (
    <main className="min-h-screen bg-[#fefce8] p-4 flex flex-col items-center font-serif overflow-hidden">
      <div className="text-center mb-6">
        <h1 className="text-4xl text-amber-900 font-bold">My Cozy Library</h1>
        {typeof window !== 'undefined' && window.location.search.includes('data') && (
          <a href="/" className="inline-block mt-2 text-sm bg-white border border-amber-200 px-4 py-1 rounded-full text-amber-800 shadow-sm">
            ✨ Create Your Own Library
          </a>
        )}
      </div>

      {/* THE THREE SHELVES AREA */}
      <div ref={constraintsRef} className="relative w-full max-w-5xl h-[70vh] bg-[#fffcf0] border-x-[16px] border-amber-900 shadow-2xl rounded-xl">
        {/* Shelf Planks */}
        <div className="absolute top-[30%] w-full h-6 bg-amber-800 border-b-4 border-amber-950 shadow-md" />
        <div className="absolute top-[60%] w-full h-6 bg-amber-800 border-b-4 border-amber-950 shadow-md" />
        <div className="absolute top-[90%] w-full h-6 bg-amber-800 border-b-4 border-amber-950 shadow-md" />

        {/* Start Hint */}
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-amber-900/30 text-2xl italic pointer-events-none">
            Tap the menu below to add books and plants...
          </div>
        )}

        {/* DRAGGABLE ITEMS */}
        {items.map((item) => (
          <motion.div
            key={item.id}
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            whileDrag={{ scale: 1.1, zIndex: 100 }}
            onDoubleClick={() => removeItem(item.id)}
            className="absolute cursor-grab active:cursor-grabbing p-2"
          >
            {item.type === 'book' ? (
              <div className="w-12 h-36 rounded-md shadow-lg flex items-center justify-center border-l-4 border-black/20 text-white bg-[#b45309]">
                <span className="rotate-90 text-[12px] font-bold uppercase whitespace-nowrap tracking-tighter">{item.label}</span>
              </div>
            ) : (
              <span className="text-6xl select-none drop-shadow-md">{item.content}</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* BOTTOM MENU */}
      <div className="fixed bottom-4 w-full max-w-5xl px-4">
        <div className="bg-white/95 backdrop-blur shadow-2xl rounded-3xl p-4 flex items-center gap-4 overflow-x-auto border-2 border-amber-100">
          <button onClick={() => setIsAddingBook(true)} className="flex-shrink-0 bg-amber-100 p-4 rounded-2xl text-amber-900 font-bold">📖 +Book</button>
          <div className="h-10 w-[2px] bg-amber-100" />
          {PLANTS.map(p => <button key={p} onClick={() => addItem('plant', p)} className="text-4xl hover:scale-125 transition">{p}</button>)}
          <div className="h-10 w-[2px] bg-amber-100" />
          {ANIMALS.map(a => <button key={a} onClick={() => addItem('animal', a)} className="text-4xl hover:scale-125 transition">{a}</button>)}
          <button onClick={generateShareLink} className="ml-auto bg-green-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">SHARE</button>
        </div>
      </div>

      {/* ADD BOOK POPUP */}
      <AnimatePresence>
        {isAddingBook && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">What's the book title?</h2>
              <input 
                className="w-full p-4 bg-amber-50 border rounded-xl mb-6 outline-none"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => addItem('book', '', newTitle)} className="flex-1 bg-amber-800 text-white py-3 rounded-xl font-bold">Add</button>
                <button onClick={() => setIsAddingBook(false)} className="flex-1 bg-gray-100 py-3 rounded-xl">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
