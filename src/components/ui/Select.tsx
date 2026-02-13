/**
 * Reusable Select component
 */

import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function Select({
  options,
  value,
  onChange,
  label,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <label className="text-xs font-medium text-slate-500">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5
          text-sm font-medium text-slate-700
          focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300
          cursor-pointer appearance-none
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
