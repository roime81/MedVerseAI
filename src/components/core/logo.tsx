
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
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            >
            <rect width="56" height="56" rx="12" fill={isDark ? "#fff" : "url(#paint0_linear_logo)"}/>
            <path d="M14 28H19.5L24 18L32 38L36.5 28H42" stroke={isDark ? "#000" : "#fff"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
                <linearGradient id="paint0_linear_logo" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4f46e5"/>
                    <stop offset="1" stopColor="#7c3aed"/>
                </linearGradient>
            </defs>
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

    