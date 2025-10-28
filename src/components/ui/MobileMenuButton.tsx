interface MobileMenuButtonProps {
  onClick: () => void;
}

const iconDefaults = {
  stroke: 'currentColor',
  fill: 'none',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const MenuIcon = ({ className = 'w-6 h-6 text-white' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconDefaults}>
    <path d="M4 5h16" />
    <path d="M4 12h16" />
    <path d="M4 19h16" />
  </svg>
);

const CloseIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconDefaults}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const SearchIconSvg = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconDefaults}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.34-4.34" />
  </svg>
);

const ChevronDownIconSvg = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconDefaults}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const StarIconSvg = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);

export function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="bg-none border-none cursor-pointer p-2 rounded-lg transition-colors duration-300 hover:bg-gold/20"
    >
      <MenuIcon />
    </button>
  );
}

interface CloseButtonProps {
  onClick: () => void;
}

export function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-gray-100"
    >
      <CloseIcon />
    </button>
  );
}

export function SearchIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <SearchIconSvg className={className} />;
}

export function StarIcon({ className = "w-6 h-6" }: { className?: string }) {
  return <StarIconSvg className={className} />;
}

export function ChevronDownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <ChevronDownIconSvg className={className} />;
}

export function ArrowUpRightIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...iconDefaults}>
      <path d="M7 17 17 7" />
      <path d="M17 7H7" />
      <path d="M17 7v10" />
    </svg>
  );
}
