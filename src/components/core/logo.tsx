
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
            <rect width="48" height="48" rx="12" fill="url(#gradient)"/>
            <path d="M14 24H18L21 30L27 18L30 24H34" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M30 21V27" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F97316"/>
                    <stop offset="1" stopColor="#D946EF"/>
                </linearGradient>
            </defs>
        </svg>
        <span className="font-grotesk text-xl font-bold">MedVerseAI</span>
    </div>
  );
}
