export const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">University Library</h1>
            <p className="text-xs text-amber-700 font-semibold">Academic Collection</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-gray-700 hover:text-amber-700 font-medium transition">Home</a>
          <a href="#" className="text-gray-700 hover:text-amber-700 font-medium transition">Collections</a>
          <a href="#" className="text-gray-700 hover:text-amber-700 font-medium transition">Dashboard</a>
        </nav>

        {/* Sign In */}
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-amber-700 font-medium transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Sign In
        </button>
      </div>
    </header>
  );
};

