/**
 * Validation Panel
 * Displays architecture validation results and feedback
 */

import { useAppStore } from '../store/app.store';
import type { ValidationSeverity } from '../core/rules';
import Search from '../assets/icons/search.svg';
import Error from '../assets/icons/error.svg';
import Warning from '../assets/icons/warning.svg';
import Info from '../assets/icons/info.svg';

/** Icon component for validation severity */
function SeverityIcon({ severity }: { severity: ValidationSeverity }) {
  switch (severity) {
    case 'error':
      return <img src={Error} alt="Error" className="w-5 h-5" />;
    case 'warning':
      return <img src={Warning} alt="Warning" className="w-5 h-5" />;
    case 'info':
      return <img src={Info} alt="Info" className="w-5 h-5" />;
  }
}

/** Badge for validation severity */
function SeverityBadge({ severity }: { severity: ValidationSeverity }) {
  const styles = {
    error: 'bg-red-100 text-red-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-sky-100 text-sky-600',
  };

  return (
    <span
      className={`px-2 py-0.5 text-[11px] font-semibold uppercase rounded ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

export function ValidationPanel() {
  const validations = useAppStore((s) => s.validations);

  // Placeholder validations for demonstration
  const placeholderValidations = [
    {
      id: '1',
      severity: 'warning' as ValidationSeverity,
      message: 'Services should be connected to at least one repository.',
    },
    {
      id: '2',
      severity: 'info' as ValidationSeverity,
      message: 'Consider adding caching for frequently accessed endpoints.',
    },
    {
      id: '3',
      severity: 'error' as ValidationSeverity,
      message: 'Endpoint "Get User" is missing a method definition.',
    }
  ];

  const items = validations.length > 0 ? validations : placeholderValidations;
  const issueCount = items.filter((v) => v.severity !== 'info').length;

  return (
    <footer className="h-45 bg-white border-t border-slate-200 flex flex-col">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-3">
        <img src={Search} alt="Search" className="w-5 h-5 text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-700">
          Validation & Feedback
        </h2>
        <div className="ml-auto bg-slate-100 px-2.5 py-0.5 rounded-full text-xs font-medium text-slate-600">
          {issueCount} {issueCount === 1 ? 'Issue' : 'Issues'} Found
        </div>
      </div>

      {/* Validation list */}
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className={`
              px-5 py-2.5 border-b border-slate-100 flex items-center gap-3
              ${item.severity === 'warning' ? 'bg-amber-50/50' : ''}
              ${item.severity === 'error' ? 'bg-red-50/50' : ''}
              hover:bg-slate-50 cursor-pointer transition-colors
            `}
          >
            <SeverityIcon severity={item.severity} />
            <span className="flex-1 text-sm text-slate-700">
              {item.message}
            </span>
            <SeverityBadge severity={item.severity} />
          </div>
        ))}
      </div>
    </footer>
  );
}
