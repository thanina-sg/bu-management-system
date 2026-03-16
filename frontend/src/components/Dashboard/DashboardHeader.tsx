interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export const DashboardHeader = ({ title, description }: DashboardHeaderProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      {description && <p className="text-gray-600 mt-2">{description}</p>}
    </div>
  );
};
