import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface FormDropdownProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    required?: boolean;
    helpText?: string;
    disabled?: boolean;
    zIndex?: number;
    onFocus?: () => void;
    onBlur?: () => void;
}

const FormDropdown: React.FC<FormDropdownProps> = ({
    id,
    label,
    value,
    onChange,
    options,
    required = false,
    helpText,
    disabled = false,
    zIndex = 10,
    onFocus,
    onBlur
}) => {
    return (
        <div className={`mb-4 relative z-${zIndex}`}>
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center" htmlFor={id}>
                {label} {required && <span className="text-red-600">*</span>}
                {helpText && (
                    <Tooltip title={helpText} arrow>
                        <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                            <HelpOutlineIcon fontSize="small" className="text-blue-500" />
                        </IconButton>
                    </Tooltip>
                )}
            </label>
            <div className="relative">                <select
                    id={id}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-outline focus:border-blue-400 transition-all duration-200 bg-white cursor-pointer pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    required={required}
                    style={{ WebkitAppearance: 'none' }}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default FormDropdown;