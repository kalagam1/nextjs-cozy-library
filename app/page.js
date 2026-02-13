"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CozyLibrary() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [placedDecor, setPlacedDecor] = useState([]);
  const [rating, setRating] = useState(0);

  const books = [
    { id: 1, title: "The Great Gatsby", color: "#f87171" },
    { id: 2, title: "Little Women", color: "#60a5fa" },
    { id: 3, title: "Harry Potter", color: "#34d399" },
    { id: 4, title: "The Hobbit", color: "#fbbf24" },
  ];

  const DECOR_OPTIONS = [
    { id: 'p1', icon: '🌿', name: 'String of Pearls' }, { id: 'p2', icon: '🌵', name: 'Cactus' },
    { id: 'p3', icon: '🪴', name: 'Monstera' }, { id: 'p4', icon: '🌻', name: 'Sunflower' },
    { id: 'p5', icon: '🌳', name: 'Bonsai' }, { id: 'p6', icon: '🌷', name: 'Tulip' },
    { id: 'p7', icon: '🌸', name: 'Blossom' }, { id: 'p8', icon: '🍄', name: 'Mushroom' },
    { id: 'p9', icon: '🎋', name: 'Bamboo' }, { id: 'p10', icon: '🍀', name: 'Clover' },
    { id: 'a1', icon: '🐱', name: 'Cat' }, { id: 'a2', icon: '🐶', name: 'Dog' },
    { id: 'a3', icon: '🐸', name: 'Frog' }, { id: 'a4', icon: '🐥', name: 'Chick' },
    { id: 'a5', icon: '🐰', name: 'Bunny' }, { id: 'a6', icon: '🦊', name: 'Fox' },
    { id: 'a7', icon: '🐼', name: 'Panda' }, { id: 'a8', icon: '🐨', name: 'Koala' },
    { id: 'a9', icon: '🦎', name: 'Axolotl' }, { id: 'a10', icon: '👻', name: 'Ghostie' },
  ];

  const addDecor = (item) => {
    if (placedDecor.length < 15) {
      setPlacedDecor([...placedDecor, { ...item, instanceId: Date.now() }]);
    }
  };

  const removeDecor = (instanceId) => {
    setPlacedDecor(placedDecor.filter(d => d.instanceId !== instanceId));
  };

  return (
    <main className="min-h-screen bg-[#fefce8] p-4 flex flex-col items-center font-serif">
      <h1 className="text-3xl text-amber-900 my-8">My Cozy Library</h1>

      {/* THE SHELF */}
      <div className="w-full max-w-3xl mb-10">
        <div className="relative flex items-end justify-start gap-1 px-6 pb-1 border-b-[12px] border-amber-800 bg-amber-100/30 h-48 rounded-t-lg shadow-inner overflow-x-auto">
          {/* Render Books */}
          {books.map((book) => (
            <motion.div
              key={book.id}
              layoutId={`book-${book.id}`}
              onClick={() => setSelectedBook(book)}
              className="w-10 h-32 flex-shrink-0 rounded-sm cursor-pointer shadow-md flex items-center justify-center border-r border-black/10"
              style={{ backgroundColor: book.color }}
              whileHover={{ y: -10 }}
            >
              <span className="rotate-90 text-[10px] font-bold text-white uppercase whitespace-nowrap">{book.title}</span>
            </motion.div>
          ))}

          {/* Render Placed Decorations */}
          {placedDecor.map((item) => (
            <motion.span
              key={item.instanceId}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => removeDecor(item.instanceId)}
              className="text-5xl cursor-pointer hover:brightness-110 active:scale-90"
              title="Click to remove"
            >
              {item.icon}
            </motion.span>
          ))}
        </div>
      </div>

      {/* DECORATION MENU (The Tray) */}
      <div className="bg-white/80 backdrop-blur p-4 rounded-3xl shadow-xl max-w-xl w-full">
        <p className="text-center text-amber-800 text-sm mb-3">Tap to add items to your shelf</p>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {DECOR_OPTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => addDecor(item)}
              className="text-4xl hover:scale-125 transition-transform p-2 bg-amber-50 rounded-xl"
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>

      {/* STAR RATING POPUP */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div layoutId={`book-${selectedBook.id}`} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col items-center relative">
              <button onClick={() => setSelectedBook(null)} className="absolute top-4 right-4 text-2xl">✕</button>
              <div className="w-20 h-32 mb-4 rounded shadow-lg" style={{ backgroundColor: selectedBook.color }} />
              <h2 className="text-2xl text-amber-950 mb-4 text-center">{selectedBook.title}</h2>
              <div className="flex gap-2 text-4xl mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className={star <= rating ? "text-yellow-400" : "text-gray-200"}>★</button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
