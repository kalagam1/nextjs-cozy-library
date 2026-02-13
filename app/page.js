"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CozyLibrary() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [tempBook, setTempBook] = useState({ title: "", rating: 0, stage: 'title' }); // 'title' or 'rating'
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

  // AUTOMATIC PLACEMENT LOGIC
  const finalizeBook = () => {
    const books = items.filter(i => i.type === 'book');
    const bookCount = books.length;
    
    // Calculate shelf (0, 1, or 2) and position (0-9)
    const shelfIndex = Math.floor(bookCount / 10);
    const posInShelf = bookCount % 10;

    if (shelfIndex > 2) {
      alert("Shelves are full!");
      return;
    }

    const colors = ["#b45309", "#78350f", "#451a03", "#92400e", "#5d2d12"];
    
    const newBook = {
      id: "book-" + Date.now(),
      type: 'book',
      label: tempBook.title,
      rating: tempBook.rating,
      color: colors[bookCount % colors.length],
      // Logic for grid-like placement
      x: 30 + (posInShelf * 75), // Equal spacing of 75px
      y: 15 + (shelfIndex * 30) + "%" // Correct shelf height percentage
    };

    setItems(prev => [...prev, newBook]);
    setIsAddingBook(false);
    setTempBook({ title: "", rating: 0, stage: 'title' });
  };

  const addPlant = (icon) => {
    const newItem = {
      id: "plant-" + Date.now(),
      type: 'plant',
      content: icon,
      x: Math.random() * 500, // Plants stay free-drag
      y: 300
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
    navigator.clipboard.writeText(url).then(() => alert("Library Link Copied!"));
  };

  const POTTED_PLANTS = ['🪴', '🌵', '🎍', '🪴', '🌵', '🎍'];

  return (
    <main className="min-h-screen flex font-serif overflow-hidden relative bg-[#fefce8]">
      
      <button onClick={generateShareLink} className="absolute top-6 right-6 z-50 bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg">SHARE LIBRARY</button>

      {/* SIDEBAR */}
      <div className="relative z-10 w-24 flex flex-col items-center gap-6 bg-white/90 border-r-2 border-amber-100 p-4 h-screen shadow-xl overflow-y-auto">
        <button onClick={() => setIsAddingBook(true)} className="w-16 h-16 bg-amber-700 text-white rounded-2xl text-2xl shadow-lg hover:scale-105 active:scale-95 transition">📖+</button>
        <div className="w-10 h-[2px] bg-amber-100" />
        {POTTED_PLANTS.map((p, idx) => (
          <button key={idx} onClick={() => addPlant(p)} className="text-5xl hover:scale-110 transition drop-shadow-sm">{p}</button>
        ))}
      </div>

      {/* SHELF AREA */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-12">
        <div ref={constraintsRef} className="relative w-full max-w-4xl h-[70vh] bg-[#fffcf0] border-x-[12px] border-[#3e1d0b] shadow-xl rounded-sm overflow-hidden">
          {[30, 60, 90].map(top => (
            <div key={top} style={{ top: `${top}%` }} className="absolute w-full h-5 bg-[#5d2d12] border-b-4 border-[#2d1608]" />
          ))}

          {items.map((item) => (
            <motion.div
              key={item.id}
              drag dragConstraints={constraintsRef} dragMomentum={false}
              className="absolute cursor-grab active:cursor-grabbing p-1"
              style={{ left: item.x, top: item.y }}
              onTap={() => setSelectedItem(item)}
            >
              {item.type === 'book' ? (
                <div className="w-[60px] h-36 rounded-sm shadow-xl flex items-center justify-center border-l-[6px] border-black/30 text-white" style={{ backgroundColor: item.color }}>
                  <span className="rotate-90 text-[10px] font-bold uppercase whitespace-nowrap tracking-widest">{item.label}</span>
                </div>
              ) : (
                <span className="text-7xl select-none drop-shadow-xl">{item.content}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ADD BOOK FLOW (Title -> Rating -> Place) */}
      <AnimatePresence>
        {isAddingBook && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs text-center">
              {tempBook.stage === 'title' ? (
                <>
                  <h2 className="text-xl font-bold mb-4">Enter Book Title</h2>
                  <input autoFocus className="w-full p-3 bg-amber-50 rounded-xl mb-6 border-2 border-amber-100" 
                         onChange={(e) => setTempBook({...tempBook, title: e.target.value})} />
                  <button onClick={() => setTempBook({...tempBook, stage: 'rating'})} className="w-full bg-amber-900 text-white py-3 rounded-xl font-bold">Next: Rate it</button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-4 text-amber-900 uppercase">{tempBook.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">Give it a rating:</p>
                  <div className="flex justify-center gap-1 text-4xl mb-8">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setTempBook({...tempBook, rating: star})} className={star <= tempBook.rating ? "text-yellow-400" : "text-gray-200"}>★</button>
                    ))}
                  </div>
                  <button onClick={finalizeBook} className="w-full bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg">Add to Shelf</button>
                </>
              )}
              <button onClick={() => setIsAddingBook(false)} className="mt-4 text-gray-400 text-sm">Cancel</button>
            </motion.div>
          </div>
        )}

        {/* VIEW/DELETE POPUP */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs flex flex-col items-center">
              <h2 className="text-lg font-bold mb-2 text-amber-900 uppercase text-center">{selectedItem.label || "Potted Plant"}</h2>
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
