// plain component, no React.FC
import { StatCard } from '../Dashboard/StatCard';

export const LibrarianOverview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Available Books" value="892" icon="📚" color="green" />
        <StatCard title="Pending Reservations" value="23" icon="🔔" color="blue" />
        <StatCard title="Items to Return" value="34" icon="📤" color="orange" />
        <StatCard title="Overdue Items" value="8" icon="⚠️" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Tasks</h3>
          <div className="space-y-3">
            {[
              { task: 'Process 5 returns', completed: false },
              { task: 'Update 3 reservations', completed: true },
              { task: 'Verify 10 new books', completed: false },
              { task: 'Send 2 overdue reminders', completed: true },
              { task: 'Process returns from morning', completed: false },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 pb-3 border-b border-gray-200 last:border-b-0">
                <input type="checkbox" defaultChecked={item.completed} className="w-4 h-4" />
                <p className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                  {item.task}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Process Return
            </button>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Register Borrowing
            </button>
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
              Manage Reservations
            </button>
            <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium">
              View Overdue Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
