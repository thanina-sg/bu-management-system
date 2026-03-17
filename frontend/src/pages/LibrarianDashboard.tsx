import { useState } from 'react';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { DashboardHeader } from '../components/Dashboard/DashboardHeader';
import { LibrarianOverview } from '../components/Librarian/LibrarianOverview';
import { LibrarianReservations } from '../components/Librarian/LibrarianReservations';
import { LibrarianReturns } from '../components/Librarian/LibrarianReturns';
import { LibrarianCopies } from '../components/Librarian/LibrarianCopies';
import { LibrarianSettings } from '../components/Librarian/LibrarianSettings';

type LibrarianSection = 'overview' | 'reservations' | 'returns' | 'copies' | 'settings';

const librarianSidebarItems = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'reservations', label: 'Reservations', icon: '🔔' },
  { id: 'returns', label: 'Returns', icon: '📤' },
  { id: 'copies', label: 'Book Copies', icon: '📚' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

type LibrarianDashboardProps = {
  onLogout?: () => void;
};

export const LibrarianDashboard = ({ onLogout }: LibrarianDashboardProps) => {
  const [activeSection, setActiveSection] = useState<LibrarianSection>('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <>
            <DashboardHeader title="Librarian Dashboard" description="Welcome to your workspace" />
            <LibrarianOverview />
          </>
        );
      case 'reservations':
        return (
          <>
            <DashboardHeader title="Reservations Management" />
            <LibrarianReservations />
          </>
        );
      case 'returns':
        return (
          <>
            <DashboardHeader title="Returns Management" />
            <LibrarianReturns />
          </>
        );
      case 'copies':
        return (
          <>
            <DashboardHeader title="Book Copies Management" />
            <LibrarianCopies />
          </>
        );
      case 'settings':
        return (
          <>
            <DashboardHeader title="My Settings" />
            <LibrarianSettings />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar
        items={librarianSidebarItems}
        activeItem={activeSection}
        onItemClick={(id: string) => setActiveSection(id as LibrarianSection)}
        userRole="Librarian"
        onLogout={onLogout}
        userName="Nina Sg"
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};
