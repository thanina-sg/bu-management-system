import type { SystemRule } from '../../types/admin';

interface AdminRuleCardProps {
  rule: SystemRule;
  onToggle: (ruleId: string, nextState: boolean) => void;
}

export const AdminRuleCard = ({ rule, onToggle }: AdminRuleCardProps) => {
  return (
    <article className="rounded-2xl bg-white shadow-md border border-slate-100 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{rule.title}</h3>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            rule.active ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {rule.active ? 'Activée' : 'Désactivée'}
        </span>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed">{rule.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-slate-400">Paramètre système</span>
        <button
          onClick={() => onToggle(rule.id, !rule.active)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            rule.active
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {rule.active ? 'Désactiver' : 'Activer'}
        </button>
      </div>
    </article>
  );
};
