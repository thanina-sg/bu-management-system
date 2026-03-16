// plain component, FC removed

export const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">System Settings</h3>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Borrowing Rules</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Maximum Borrow Duration (days)</span>
              <input type="number" defaultValue={30} className="border border-gray-300 rounded px-3 py-2 w-24" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Maximum Items per User</span>
              <input type="number" defaultValue={5} className="border border-gray-300 rounded px-3 py-2 w-24" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Fine per Day (currency)</span>
              <input type="number" step="0.01" defaultValue={2.5} className="border border-gray-300 rounded px-3 py-2 w-24" />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Email Notifications</h4>
          <div className="space-y-3">
            {[
              { label: 'Send Reminder on Due Date', checked: true },
              { label: 'Send Confirmation on Borrow', checked: true },
              { label: 'Send Alert for Overdue Items', checked: true },
              { label: 'Send Weekly Report', checked: false },
            ].map((setting, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={setting.checked} className="w-4 h-4" />
                <span className="text-gray-700">{setting.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
