import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Input from './Input.jsx';
import Button from './Button.jsx';
import { debounce } from '../../utils/api.js';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  debounceMs = 300,
  className = '',
  ...props 
}) => {
  const [localValue, setLocalValue] = useState(value || '');

  // Debounced onChange handler
  const debouncedOnChange = debounce(onChange, debounceMs);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative">
      <Input
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        icon={<Search size={20} />}
        iconPosition="left"
        className={className}
        {...props}
      />
      {localValue && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            icon={<X size={16} />}
            className="p-1 h-auto text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          />
        </div>
      )}
    </div>
  );
};

export default SearchInput;