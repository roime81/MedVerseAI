
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
        <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            >
            <rect width="56" height="56" rx="12" fill="url(#paint0_linear_m_plus_logo)"/>
            <path d="M22.866 18H18V38H22.4462V27.03L28.0002 33.4L33.5542 27.03V38H38.0004V18H33.1344L28.0002 23.82L22.866 18Z" fill="white"/>
            <defs>
                <linearGradient id="paint0_linear_m_plus_logo" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F97316"/>
                    <stop offset="1" stopColor="#F472B6"/>
                </linearGradient>
            </defs>
        </svg>
        <span className="font-grotesk text-xl font-bold">MedVerseAI</span>
    </div>
  );
}
