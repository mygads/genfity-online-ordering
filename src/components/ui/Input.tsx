/**
 * Input Component
 * Reusable input field with validation states
 */

import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-semibold text-primary-dark dark:text-white"
          >
            {label}
            {props.required && <span className="text-[var(--color-danger)] ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary dark:text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              w-full h-12 rounded-lg border bg-white px-3
              text-sm text-primary-dark placeholder:text-tertiary
              transition-all duration-200
              dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500
              disabled:cursor-not-allowed disabled:bg-secondary disabled:text-tertiary
              dark:disabled:bg-gray-800
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${
                error
                  ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-2 focus:ring-[var(--color-danger)]/20"
                  : "border-primary focus:border-primary-focus focus:ring-2 ring-primary/20"
              }
              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary dark:text-gray-400">
              {rightIcon}
            </div>
          )}

          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-danger)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10 7C10.5523 7 11 7.44772 11 8V10C11 10.5523 10.5523 11 10 11C9.44772 11 9 10.5523 9 10V8C9 7.44772 9.44772 7 10 7ZM10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15H10.01C10.5623 15 11.01 14.5523 11.01 14C11.01 13.4477 10.5623 13 10.01 13H10Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>
        )}

        {!error && helperText && (
          <p className="mt-1.5 text-xs text-secondary dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
