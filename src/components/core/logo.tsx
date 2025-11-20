
'use client';

import { cn } from '@/lib/utils';
import type { User } from '@/lib/schemas';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  variant?: 'light' | 'dark';
  isSuperAdmin?: boolean;
  appUser?: User | null;
}

export function Logo({ className, variant = 'light', isSuperAdmin = false, appUser, ...props }: LogoProps) {
  const isDark = variant === 'dark';

  const getPortalTitle = () => {
    if (!appUser) return null;
    if (appUser.role !== 'admin') return null;

    switch (appUser.department) {
        case 'System':
            return 'Super Admin Portal';
        case 'HR/Credentialing':
            return 'HR & Credentialing Portal';
        case 'Medical Affairs/Clinical Gov':
            return 'Clinical Governance Portal';
        case 'Department Head':
            return 'HOD Portal';
        case 'IT/IAM':
            return 'IT & Access Management Portal';
        case 'Cybersecurity':
            return 'Cybersecurity Portal';
        case 'HIS/EMR':
            return 'HIS/EMR Application Team Portal';
        case 'Compliance/Audit':
            return 'Compliance & Internal Audit Portal';
        default:
            return 'Admin Portal';
    }
  };

  const portalTitle = getPortalTitle();
  const isSpecialAdmin = !!portalTitle;


  return (
    <div className={cn("flex items-center gap-3", className)}>
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect width="32" height="32" rx="8" fill={isDark ? "white" : "hsl(var(--primary))"} />
            <path d="M9 20C9 22.2091 10.7909 24 13 24H23V18C23 15.7909 21.2091 14 19 14H9V20Z" fill={isDark ? "hsl(var(--primary))" : "white"} />
            <path d="M23 12C23 9.79086 21.2091 8 19 8H9V14C9 12.5858 9.87325 11.341 11.2057 10.6322C12.5381 9.9234 14.1207 10.0333 15.3431 10.9161L23 16.5V12Z" fill={isDark ? "hsl(var(--primary))" : "white"} fillOpacity="0.8"/>
        </svg>
        {isSpecialAdmin ? (
            <div>
                <span className="font-grotesk text-lg font-bold text-white leading-tight">MedVerse Access Hub</span>
                {portalTitle && <p className="text-xs text-gray-400 leading-tight">{portalTitle}</p>}
            </div>
        ) : (
             <span className={cn("font-grotesk text-xl font-bold", isDark ? "text-white" : "text-foreground")}>MedVerseAI</span>
        )}
    </div>
  );
}
