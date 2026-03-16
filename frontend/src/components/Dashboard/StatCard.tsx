interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

export const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const gradients = {
    blue: 'from-blue-500 to-cyan-400',
    green: 'from-emerald-500 to-teal-400',
    orange: 'from-orange-500 to-amber-400',
    purple: 'from-purple-500 to-indigo-400',
    red: 'from-red-500 to-rose-400'
  };

  return (
    <div className="relative group">
      {/* Glow effect behind the card */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradients[color]} rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-500`}></div>
      
      {/* Main Glass Card */}
      <div className="relative bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/5 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">{title}</p>
          <h4 className="text-3xl font-bold text-white mt-2 tracking-tight">{value}</h4>
        </div>
        <div className="text-3xl bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  );
};