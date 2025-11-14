
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
            <rect width="48" height="48" rx="8" fill="url(#paint0_linear_logo)"/>
            <path d="M14 18V31H18V24.2L21.8 28.4L24 26L28 31H34V18H30V24.8L26.2 20.6L24 23L20 18H14Z" fill="white"/>
            <defs>
                <linearGradient id="paint0_linear_logo" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F472B6"/>
                    <stop offset="1" stopColor="#F97316"/>
                </linearGradient>
            </defs>
        </svg>
        <span className="font-grotesk text-xl font-bold">MedVerseAI</span>
    </div>
  );
}
