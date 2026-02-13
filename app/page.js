"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CozyLibrary() {
  const [items, setItems] = useState<any[]>([]);
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

  const addItem = (type: string, icon: string, label: string = "") => {
    const newItem = {
      id: Date.now(),
      type,
      content: icon,
      label: label,
      x: 50, // Starts in the middle
      y: 50,
    };
    setItems([...items, newItem]);
    setIsAddingBook(false);
    setNewTitle("");
  };

  const generateShareLink = () => {
    const data = btoa(JSON.stringify(items));
    const url = `${window.location.origin}${window.location.pathname}?data=${data}`;
    navigator.clipboard.writeText(url);
    alert("Library link copied to clipboard!");
  };

  const PLANTS = ['🌿', '🌵', '🪴', '🎋', '🌴', '🍀', '🍃', '🍄', '🌲', '🎍'];
  const ANIMALS = ['🐱', '🐶', '🐸', '🦊', '🐰', '🐼', '🐨', '🐥', '🦎', '👻'];

  return (
    <main className="min-h-screen bg-[#fefce8] p-4 flex flex-col items-center font-serif overflow-hidden">
      <div className="text-center mb-6">
        <h1 className="text-4xl text-amber-900 font-bold drop-shadow-sm">My Cozy Library</h1>
        <p className="text-sm text-amber-700 italic">Drag and drop anything to your shelves</p>
        {typeof window !== 'undefined' && window.location.search.includes('data') && (
          <a href="/" className="inline-block mt-2 text-xs bg-white border border-amber-200 px-4 py-1 rounded-full text-amber-800 shadow-sm">Create Your Own</a>
        )}
      </div>

      {/* THE ROOM / SHELF AREA */}
      <div ref={constraintsRef} className="relative w-full max-w-5xl h-[65vh] bg-[#fffcf0] border-x-[16px] border-amber-900 shadow-2xl rounded-xl overflow-hidden">
        {/* Three Wooden Shelves */}
        <div className="absolute top-[30%] w-full h-6 bg-amber-800 border-b-4 border-amber-950 shadow-md" />
        <div className="absolute top-[60%] w-full h-6 bg-amber-800 border-b-4 border-amber-950 shadow-md" />
        <div className="absolute top-[90%] w-full h-6 bg-amber-800 border-b-4 border-amber-950 shadow-md" />

        {/* DRAGGABLE ITEMS */}
        {items.map((item) => (
          <motion.div
            key={item.id}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.05}
            dragMomentum={false}
            initial={{ x: item.x, y: item.y, scale: 0 }}
            animate={{ scale: 1 }}
            whileDrag={{ scale: 1.1, zIndex: 50 }}
            className="absolute cursor-grab active:cursor-grabbing p-2"
          >
            {item.type === 'book' ? (
              <div className="w-12 h-36 rounded-md shadow-lg flex items-center justify-center border-l-4 border-black/20 text-white" style={{ backgroundColor: '#b45309' }}>
                <span className="rotate-90 text-[12px] font-bold uppercase whitespace-nowrap tracking-tighter">{item.label}</span>
              </div>
            ) : (
              <span className="text-6xl drop-shadow-md select-none">{item.content}</span>
            )}
            {/* Small delete button that appears on hover could go here */}
          </motion.div>
        ))}
      </div>

      {/* ITEM TRAY */}
      <div className="fixed bottom-4 w-full max-w-4xl px-4">
        <div className="bg-white/95 backdrop-blur shadow-2xl rounded-3xl p-4 border-2 border-amber-100">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {/* Add Book Button */}
            <button onClick={() => setIsAddingBook(true)} className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-2xl flex flex-col items-center justify-center text-amber-900 hover:bg-amber-200 transition">
              <span className="text-2xl">📖</span>
              <span className="text-[10px] font-bold">+BOOK</span>
            </button>

            <div className="h-12 w-[2px] bg-amber-100 mx-2" />

            {/* Plants */}
            {PLANTS.map(p => (
              <button key={p} onClick={() => addItem('plant', p)} className="text-4xl hover:scale-125 transition active:scale-90">{p}</button>
            ))}

            <div className="h-12 w-[2px] bg-amber-100 mx-2" />

            {/* Animals */}
            {ANIMALS.map(a => (
              <button key={a} onClick={() => addItem('animal', a)} className="text-4xl hover:scale-125 transition active:scale-90">{a}</button>
            ))}

            <button onClick={generateShareLink} className="ml-auto bg-green-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-green-700 transition">SHARE</button>
          </div>
        </div>
      </div>

      {/* BOOK POPUP */}
      <AnimatePresence>
        {isAddingBook && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl">
              <h2 className="text-xl font-bold text-amber-900 mb-4">Add a new book</h2>
              <input 
                autoFocus
                placeholder="Book Title..." 
                className="w-full p-4 bg-amber-50 border-2 border-amber-100 rounded-xl mb-6 outline-none focus:border-amber-500 text-lg"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('book', '', newTitle)}
              />
              <div className="flex gap-3">
                <button onClick={() => addItem('book', '', newTitle)} className="flex-1 bg-amber-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg">Add to Library</button>
                <button onClick={() => setIsAddingBook(false)} className="px-6 py-4 bg-gray-100 rounded-xl font-bold text-gray-500">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
