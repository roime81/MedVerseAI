
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className, variant = 'light', ...props }: LogoProps) {
  const isDark = variant === 'dark';
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <svg
            width="32"
            height="32"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            >
            <rect width="56" height="56" rx="12" fill={isDark ? "url(#paint0_linear_pulse_logo_dark)" : "url(#paint0_linear_pulse_logo_light)"}/>
            <path d="M14 28H19.5L24 18L32 38L36.5 28H42" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
                <linearGradient id="paint0_linear_pulse_logo_light" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F97316"/>
                    <stop offset="1" stopColor="#F472B6"/>
                </linearGradient>
                 <linearGradient id="paint0_linear_pulse_logo_dark" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4f46e5"/>
                    <stop offset="1" stopColor="#7c3aed"/>
                </linearGradient>
            </defs>
        </svg>
        <div className="flex flex-col">
            <span className={cn("font-grotesk text-base font-bold leading-none", isDark && "text-foreground")}>MedVerse Access Hub</span>
            <span className={cn("text-xs leading-none", isDark ? "text-muted-foreground" : "text-white/80")}>
                Medical Affairs / Clinical Gov. Portal
            </span>
        </div>
    </div>
  );
}
