'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkWrapperProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export default function LinkWrapper({ href, children, className }: LinkWrapperProps) {
    const pathname = usePathname();
    console.log(pathname);
    const isActive = (href: string) => pathname === href;
    return (
        <Link
            href={href}
            className={`${isActive(href) ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}
    block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
    ${className}
        `}
        >{children}</Link>
    );
}