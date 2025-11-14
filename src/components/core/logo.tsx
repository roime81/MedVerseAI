
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
            <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F97316"/>
                    <stop offset="100%" stopColor="#D946EF"/>
                </linearGradient>
            </defs>
            <g>
                <path d="M26.61,15.34a6.2,6.2,0,0,0-4.62-1.57H22c-2.45,0-4.63,1.01-6.19,2.67-1.7,1.8-2.65,4.2-2.65,6.82v0.02c0,3.31,1.52,6.23,3.88,8.12a5.1,5.1,0,0,0,4.27,1.96c0.05,0,0.1,0,0.15,0.02,0.75,0,1.47-.18,2.13-0.5,0.4-.19.78-0.42,1.13-0.69,1.94-1.51,3.1-3.86,3.1-6.49v-0.02c0-3.69-1.66-7.29-4.58-9.75Z" fill="url(#logo-gradient)"/>
                <g stroke="url(#logo-gradient)" strokeWidth="2">
                    <circle cx="22" cy="23" r="2.5" fill="none"/>
                    <circle cx="33" cy="20.5" r="2.5" fill="url(#logo-gradient)" stroke="none"/>
                    <path d="M28.5 20.5H31" fill="none"/>
                    <circle cx="33" cy="29.5" r="2.5" fill="url(#logo-gradient)" stroke="none"/>
                    <path d="M26 29.5H31" fill="none"/>
                    <circle cx="33" cy="38.5" r="2.5" fill="url(#logo-gradient)" stroke="none"/>
                    <path d="M28.5 38.5H31" fill="none"/>
                </g>
            </g>
        </svg>
        <span className="font-grotesk text-xl font-bold">MedVerseAI</span>
    </div>
  );
}
