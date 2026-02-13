"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CozyLibrary() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [rating, setRating] = useState(0);

  // Sample data to start with
  const books = [
    { id: 1, title: "The Great Gatsby", color: "#f87171" },
    { id: 2, title: "Little Women", color: "#60a5fa" },
    { id: 3, title: "Harry Potter", color: "#34d399" },
  ];

  return (
    <main className="min-h-screen bg-[#fefce8] p-8 flex flex-col items-center font-serif">
      <h1 className="text-4xl text-amber-900 mb-12">My Cozy Library</h1>

      {/* THE SHELF */}
      <div className="w-full max-w-3xl">
        <div className="relative flex items-end justify-center gap-2 px-4 pb-1 border-b-[12px] border-amber-800 bg-amber-100/30 h-48 rounded-t-lg">
          {books.map((book) => (
            <motion.div
              key={book.id}
              layoutId={`book-${book.id}`}
              onClick={() => setSelectedBook(book)}
              className="w-10 h-32 rounded-sm cursor-pointer shadow-md flex items-center justify-center border-r border-black/10"
              style={{ backgroundColor: book.color }}
              whileHover={{ y: -10 }}
            >
              <span className="rotate-90 text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap">
                {book.title}
              </span>
            </motion.div>
          ))}
          
          {/* A STARTER PLANT */}
          <div className="text-4xl ml-8 pb-1 cursor-grab active:cursor-grabbing">🪴</div>
          <div className="text-4xl pb-1 cursor-grab active:cursor-grabbing">🐱</div>
        </div>
      </div>

      {/* THE POP-UP RATING MODAL */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              layoutId={`book-${selectedBook.id}`}
              className="bg-white p-8 rounded-3xl shadow-2xl w-80 flex flex-col items-center relative"
            >
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 text-2xl hover:text-red-500"
              >✕</button>
              
              <div className="w-16 h-24 mb-4 rounded shadow-lg" style={{ backgroundColor: selectedBook.color }} />
              <h2 className="text-xl text-amber-950 mb-2">{selectedBook.title}</h2>
              
              <div className="flex gap-2 text-3xl mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className={star <= rating ? "text-yellow-400" : "text-gray-200"}
                  >★</button>
                ))}
              </div>
              <p className="text-sm text-gray-400">Rating: {rating}/5</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <p className="mt-12 text-amber-800/50 italic text-sm">Tap a book to rate it!</p>
    </main>
  );
}
