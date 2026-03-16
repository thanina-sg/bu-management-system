import { Header } from '../components/Header/Header';

export const Home = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* On appelle uniquement le Header. 
        C'est lui qui gère maintenant la recherche, 
        la grille de livres et le Footer.
      */}
      <Header />
    </div>
  );
};