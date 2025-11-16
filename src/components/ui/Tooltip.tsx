"use client";

import React from 'react';
import { FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900 dark:border-t-gray-700',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900 dark:border-b-gray-700',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900 dark:border-l-gray-700',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900 dark:border-r-gray-700',
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
          role="tooltip"
        >
          <div className="max-w-xs rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-gray-700">
            {content}
            <div className={`absolute h-0 w-0 border-4 ${arrowClasses[position]}`} />
          </div>
        </div>
      )}
    </div>
  );
}

// Help icon with tooltip
interface HelpTooltipProps {
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  iconClassName?: string;
}

export function HelpTooltip({ content, position = 'top', iconClassName = '' }: HelpTooltipProps) {
  return (
    <Tooltip content={content} position={position}>
      <FaQuestionCircle className={`h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help ${iconClassName}`} />
    </Tooltip>
  );
}

// Info icon with tooltip
export function InfoTooltip({ content, position = 'top', iconClassName = '' }: HelpTooltipProps) {
  return (
    <Tooltip content={content} position={position}>
      <FaInfoCircle className={`h-4 w-4 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 cursor-help ${iconClassName}`} />
    </Tooltip>
  );
}

// Field label with help tooltip
interface FieldLabelWithTooltipProps {
  label: string;
  tooltip: string | React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

export function FieldLabelWithTooltip({
  label,
  tooltip,
  required = false,
  htmlFor,
  className = '',
}: FieldLabelWithTooltipProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
    >
      <span>
        {label}
        {required && <span className="ml-1 text-error-500">*</span>}
      </span>
      <HelpTooltip content={tooltip} />
    </label>
  );
}
