import { InputHTMLAttributes, forwardRef, memo } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = memo(forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={twMerge(
              'block w-full h-[45px] px-4 rounded-lg border-2 border-gray-200',
              'text-gray-900 placeholder:text-gray-400 placeholder:text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
              'transition-all duration-200',
              error
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'hover:border-gray-300',
              className
            )}
            placeholder={placeholder}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
));

Input.displayName = 'Input';

export default Input;
