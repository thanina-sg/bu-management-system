import type { Book } from '../types/book';
import { BookCard } from '../components/Book/BookCard';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';

export const Home = () => {
  // Static mock data with random books
  const books: Book[] = [
    { 
      isbn: '978-0201896831', 
      titre: 'The Art of Computer Programming', 
      auteur: 'Donald E. Knuth', 
      categorie: 'COMPUTER SCIENCE', 
      status: 'Available' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/410vJkvW30L._SX365_BO1,204,203,200_.jpg' 
    },
    { 
      isbn: '978-0262033848', 
      titre: 'Introduction to Algorithms', 
      auteur: 'Thomas H. Cormen', 
      categorie: 'COMPUTER SCIENCE', 
      status: 'Borrowed' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/41T07nqZneL._SX404_BO1,204,203,200_.jpg' 
    },
    { 
      isbn: '978-0131103627', 
      titre: 'Structure and Interpretation of Computer Programs', 
      auteur: 'Harold Abelson', 
      categorie: 'COMPUTER SCIENCE', 
      status: 'Available' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/51Y9EunS6mL._SX322_BO1,204,203,200_.jpg' 
    },
    { 
      isbn: '978-0132350884', 
      titre: 'Clean Code: A Handbook of Agile Software Craftsmanship', 
      auteur: 'Robert C. Martin', 
      categorie: 'SOFTWARE ENGINEERING', 
      status: 'Available' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg' 
    },
    { 
      isbn: '978-0596007973', 
      titre: 'Design Patterns: Elements of Reusable Object-Oriented Software', 
      auteur: 'Gang of Four', 
      categorie: 'COMPUTER SCIENCE', 
      status: 'Available' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/51kuc8B5FeL._SX395_BO1,204,203,200_.jpg' 
    },
    { 
      isbn: '978-1491915325', 
      titre: 'Eloquent JavaScript: A Modern Introduction to Programming', 
      auteur: 'Marijn Haverbeke', 
      categorie: 'PROGRAMMING', 
      status: 'Available' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/51InjRPaIrL._SX376_BO1,204,203,200_.jpg' 
    },
    { 
      isbn: '978-0596517748', 
      titre: 'Head First HTML and CSS', 
      auteur: 'Elisabeth Freeman & Eric Freeman', 
      categorie: 'WEB DEVELOPMENT', 
      status: 'Borrowed' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/51rvVW6-rML._SX342_BO1,204,203,200_.jpg' 
    },
    { 
      isbn: '978-1491954553', 
      titre: 'You Don\'t Know JS: Async & Performance', 
      auteur: 'Kyle Simpson', 
      categorie: 'PROGRAMMING', 
      status: 'Available' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/51MYvlnGxCL._SX376_BO1,204,203,200_.jpg' 
    },
    { 
      isbn: '978-1617295652', 
      titre: 'The Pragmatic Programmer: Your Journey to Mastery', 
      auteur: 'David Thomas & Andrew Hunt', 
      categorie: 'SOFTWARE ENGINEERING', 
      status: 'Available' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/41as+WafrFL._SX408_BO1,204,203,200_.jpg' 
    },
    { 
      isbn: '978-1617291999', 
      titre: 'Refactoring: Improving the Design of Existing Code', 
      auteur: 'Martin Fowler', 
      categorie: 'COMPUTER SCIENCE', 
      status: 'Borrowed' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/51ZWrEXHx4L._SX376_BO1,204,203,200_.jpg' 
    },
    { 
      isbn: '978-1492078647', 
      titre: 'Machine Learning Basics: From Theory to Practice', 
      auteur: 'Andrew Ng & Kian Katanforoosh', 
      categorie: 'ARTIFICIAL INTELLIGENCE', 
      status: 'Available' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/41oQyU89cwL._SX397_BO1,204,203,200_.jpg' 
    },
    { 
      isbn: '978-0134494166', 
      titre: 'Effective Java', 
      auteur: 'Joshua Bloch', 
      categorie: 'PROGRAMMING', 
      status: 'Available' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/41cKRvqVHCL._SX408_BO1,204,203,200_.jpg' 
    }
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Header Component */}
      <Header />

      <main className="flex-grow w-full px-4 py-12">
        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-gray-100 mb-10 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Refine Results</span>
          </div>
          <div className="flex gap-4">
            <select className="bg-gray-50 border border-gray-200 rounded px-3 py-2 outline-none hover:border-gray-300 transition-colors">
              <option>All Categories</option>
              <option>Computer Science</option>
              <option>Programming</option>
              <option>Software Engineering</option>
              <option>Web Development</option>
              <option>Artificial Intelligence</option>
            </select>
            <select className="bg-gray-50 border border-gray-200 rounded px-3 py-2 outline-none hover:border-gray-300 transition-colors">
              <option>All Status</option>
              <option>Available</option>
              <option>Borrowed</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-6 font-medium">Showing {books.length} results</p>

        {/* Book Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {books.map(book => (
            <BookCard key={book.isbn} book={book} />
          ))}
        </section>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};