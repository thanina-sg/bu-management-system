import type { Book } from '../../types/book';

export const BookCard = ({ book }: { book: Book }) => {
  const isAvailable = book.status === 'Available';
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Book Cover Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-72">
        <span className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full font-bold z-10 ${
          isAvailable 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-orange-100 text-orange-700'
        }`}>
          {book.status}
        </span>
        <img 
          src={book.imageUrl} 
          alt={book.titre} 
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" 
        />
      </div>

      {/* Book Info */}
      <div className="p-5 flex flex-col h-full">
        <p className="text-[11px] tracking-wider uppercase text-amber-700 font-bold mb-2">
          {book.categorie}
        </p>
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2 flex-grow">
          {book.titre}
        </h3>
        <p className="text-sm text-gray-600 mb-4 italic">
          {book.auteur}
        </p>

        {/* Action Button */}
        <button className="w-full py-2.5 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-md font-semibold text-sm hover:from-amber-800 hover:to-amber-900 transition-all duration-200 transform hover:scale-105 active:scale-95">
          View Details
        </button>
      </div>
    </div>
  );
};