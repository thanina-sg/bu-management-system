import { Header } from '../components/Header/Header';

type HomeProps = {
  onRoleChange?: (role?: string | null) => void;
};

export const Home = ({ onRoleChange }: HomeProps) => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* On appelle uniquement le Header. 
        C'est lui qui gère maintenant la recherche, 
        la grille de livres et le Footer.
      */}
      <Header onRoleChange={onRoleChange} />
    </div>
  );
};
