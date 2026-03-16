// plain component, no React.FC

export const LibrarianSettings = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Librarian Settings</h3>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Personal Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Full Name</label>
              <input type="text" defaultValue="Nina Sg" className="border border-gray-300 rounded px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Employee ID</label>
              <input type="text" defaultValue="LIB-001" className="border border-gray-300 rounded px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Contact Phone</label>
              <input type="tel" defaultValue="+1 (555) 000-0000" className="border border-gray-300 rounded px-3 py-2 w-full" />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Work Schedule</h4>
          <div className="space-y-3">
            {['Monday - Friday', 'Saturday', 'Sunday'].map((day, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-gray-700">{day}</span>
                <select className="border border-gray-300 rounded px-3 py-2">
                  <option>Off</option>
                  <option>9:00 AM - 5:00 PM</option>
                  <option>10:00 AM - 6:00 PM</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
