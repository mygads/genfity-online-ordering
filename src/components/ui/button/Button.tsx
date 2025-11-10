import React, { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; // Button text or content
  size?: "sm" | "md" | "lg"; // Button size (added lg for GENFITY)
  variant?: "primary" | "outline" | "secondary" | "ghost" | "danger"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  isLoading?: boolean; // Loading state (for GENFITY)
  isFullWidth?: boolean; // Full width option (for GENFITY)
  className?: string; // Additional classes
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      size = "md",
      variant = "primary",
      startIcon,
      endIcon,
      isLoading = false,
      isFullWidth = false,
      className = "",
      disabled = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Size Classes (GENFITY spec: sm=36px, md=44px, lg=48px)
    const sizeClasses = {
      sm: "h-9 px-4 text-sm", // 36px
      md: "h-11 px-5 text-sm", // 44px
      lg: "h-12 px-6 text-base", // 48px
    };

    // Variant Classes (Updated for GENFITY color palette)
    const variantClasses = {
      primary:
        "bg-primary text-white shadow-theme-xs hover:bg-primary-hover disabled:bg-[var(--color-primary-disabled)] disabled:cursor-not-allowed active:scale-[0.98]",
      secondary:
        "bg-secondary text-primary border-2 border-secondary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
      outline:
        "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed",
      ghost:
        "bg-transparent text-primary-dark hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
      danger:
        "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-hover)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={`inline-flex items-center justify-center font-semibold gap-2 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ring-primary focus:ring-offset-2 ${className} ${
          sizeClasses[size]
        } ${variantClasses[variant]} ${isFullWidth ? "w-full" : ""} ${
          disabled || isLoading ? "cursor-not-allowed" : ""
        }`}
        onClick={props.onClick}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!isLoading && startIcon && (
          <span className="flex items-center">{startIcon}</span>
        )}
        {children}
        {!isLoading && endIcon && (
          <span className="flex items-center">{endIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
