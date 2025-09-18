import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select...',
  className = '',
  children,
  ...props
}, ref) => {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={clsx(
          'block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 bg-white',
          {
            'border-red-300 focus:border-red-500 focus:ring-red-500': hasError,
            'border-gray-300 focus:border-primary-500 focus:ring-primary-500': !hasError,
          },
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;