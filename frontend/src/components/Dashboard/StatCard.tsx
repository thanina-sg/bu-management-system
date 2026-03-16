interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const colorStyles = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  orange: 'bg-orange-100 text-orange-700',
  red: 'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
};

export const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`text-3xl ${colorStyles[color]} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
