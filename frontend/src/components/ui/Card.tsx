import React from 'react';

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
    return (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className || ''}`}>
            {children}
        </div>
    );
}

export function CardHeader({ className, children }: CardProps) {
    return (
        <div className={`border-b border-gray-200 px-6 py-4 ${className || ''}`}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children }: CardProps) {
    return (
        <h3 className={`text-lg font-medium text-gray-900 ${className || ''}`}>
            {children}
        </h3>
    );
}

export function CardDescription({ className, children }: CardProps) {
    return (
        <p className={`text-sm text-gray-600 ${className || ''}`}>
            {children}
        </p>
    );
}

export function CardContent({ className, children }: CardProps) {
    return (
        <div className={`px-6 py-4 ${className || ''}`}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children }: CardProps) {
    return (
        <div className={`border-t border-gray-200 px-6 py-4 ${className || ''}`}>
            {children}
        </div>
    );
}
