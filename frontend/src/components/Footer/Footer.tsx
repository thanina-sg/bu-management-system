export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-lg">University Library</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Providing access to thousands of academic resources to support research and learning excellence.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Collections</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-amber-500 transition">Browse Catalog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-500 transition">Research Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-500 transition">Digital Archives</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-500 transition">Rare Books</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-amber-500 transition">Interlibrary Loan</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-500 transition">Reference Help</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-500 transition">Database Access</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-500 transition">E-Resources</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Contact</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.8c.22 1.394.406 2.858.553 4.32a1 1 0 01-.621 1.144l-1.798.798A11.988 11.988 0 0015.849 15.849l.798-1.798a1 1 0 011.144-.621c1.462.147 2.926.333 4.32.553a1 1 0 01.8.986v2.153a1 1 0 01-1 1H4a1 1 0 01-1-1V3z"/></svg>
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                <span>library@university.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00-.293.707l-.707.707a1 1 0 101.414 1.414l1-1A1 1 0 0011 9.414V6z" clip-rule="evenodd"/></svg>
                <span>Mon-Fri 8AM-8PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <div>
            <p>&copy; {currentYear} University Library. All rights reserved.</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-amber-500 transition">Privacy Policy</a>
            <a href="#" className="hover:text-amber-500 transition">Terms of Use</a>
            <a href="#" className="hover:text-amber-500 transition">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
