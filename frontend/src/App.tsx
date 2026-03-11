import { Home } from './pages/Home';
// We remove the import './App.css' because it contains 
// styles that center everything and break the library layout.

function App() {
  return (
    <div className="w-full min-h-screen">
      <Home />
    </div>
  );
}

export default App;