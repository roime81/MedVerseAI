
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
        <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            >
            <rect width="48" height="48" rx="12" fill="black"/>
            <path d="M24 14C21.7909 14 20 15.7909 20 18V20H18C16.8954 20 16 20.8954 16 22V26C16 27.1046 16.8954 28 18 28H20V30C20 32.2091 21.7909 34 24 34C26.2091 34 28 32.2091 28 30V28H30C31.1046 28 32 27.1046 32 26V22C32 20.8954 31.1046 20 30 20H28V18C28 15.7909 26.2091 14 24 14Z" stroke="url(#paint0_linear_1_2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24 14V11" stroke="url(#paint1_linear_1_2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24 37V34" stroke="url(#paint2_linear_1_2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 24H13" stroke="url(#paint3_linear_1_2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M35 24H32" stroke="url(#paint4_linear_1_2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
                <linearGradient id="paint0_linear_1_2" x1="16" y1="14" x2="32" y2="34" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F97316"/>
                    <stop offset="1" stopColor="#D946EF"/>
                </linearGradient>
                <linearGradient id="paint1_linear_1_2" x1="24.5" y1="11" x2="24.5" y2="14" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F97316"/>
                    <stop offset="1" stopColor="#D946EF"/>
                </linearGradient>
                <linearGradient id="paint2_linear_1_2" x1="24.5" y1="34" x2="24.5" y2="37" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F97316"/>
                    <stop offset="1" stopColor="#D946EF"/>
                </linearGradient>
                <linearGradient id="paint3_linear_1_2" x1="13" y1="24.5" x2="16" y2="24.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F97316"/>
                    <stop offset="1" stopColor="#D946EF"/>
                </linearGradient>
                <linearGradient id="paint4_linear_1_2" x1="32" y1="24.5" x2="35" y2="24.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F97316"/>
                    <stop offset="1" stopColor="#D946EF"/>
                </linearGradient>
            </defs>
        </svg>
        <span className="font-grotesk text-xl font-bold">MedVerseAI</span>
    </div>
  );
}
