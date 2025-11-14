
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
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            >
            <path d="M24.2 16C21.88 16 20 17.88 20 20.2V21.4C18.8 21.88 18.04 22.84 18 24C18 25.38 19.14 26.52 20.5 26.76V28H19V30H20.5V32H22.5V30H27.5V32H29.5V30H31V28H29.5V26.76C30.86 26.52 32 25.38 32 24C31.96 22.84 31.2 21.88 30 21.4V20.2C30 17.88 28.12 16 25.8 16H24.2ZM24.2 18H25.8C26.9 18 27.8 18.9 27.8 20V21H22.2V20C22.2 18.9 23.1 18 24.2 18Z M20.5 24C20.5 23.18 21.18 22.5 22 22.5V25.5C21.18 25.5 20.5 24.82 20.5 24Z M28 25.5V22.5C28.82 22.5 29.5 23.18 29.5 24C29.5 24.82 28.82 25.5 28 25.5Z" fill="url(#paint0_linear_logo_brain)"/>
            <defs>
                <linearGradient id="paint0_linear_logo_brain" x1="18" y1="16" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F97316"/>
                    <stop offset="1" stopColor="#F472B6"/>
                </linearGradient>
            </defs>
        </svg>
        <span className="font-grotesk text-xl font-bold">MedVerseAI</span>
    </div>
  );
}
