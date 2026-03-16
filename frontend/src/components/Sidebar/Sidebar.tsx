interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
  userRole: string;
  userName?: string;
}

export const Sidebar = ({
  items,
  activeItem,
  onItemClick,
  userRole,
  userName = 'User',
}: SidebarProps) => {
  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 min-h-screen text-white shadow-lg flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold">BU Library</h1>
        <p className="text-sm text-blue-200 mt-1 capitalize">{userRole}</p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item: SidebarItem) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
              activeItem === item.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-blue-100 hover:bg-blue-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-blue-700 bg-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-xs text-blue-200 capitalize">{userRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
