import { Menu, X, Search, Star, ChevronDown, ArrowUpRight } from 'lucide-react';

interface MobileMenuButtonProps {
  onClick: () => void;
}

export function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="bg-none border-none cursor-pointer p-2 rounded-lg transition-colors duration-300 hover:bg-gold/20"
    >
      <Menu className="w-6 h-6 text-white" />
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
      <X className="w-6 h-6" />
    </button>
  );
}

export function SearchIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <Search className={className} />;
}

export function StarIcon({ className = "w-6 h-6" }: { className?: string }) {
  return <Star className={className} fill="currentColor" strokeWidth={0} />;
}

export function ChevronDownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <ChevronDown className={className} />;
}

export function ArrowUpRightIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <ArrowUpRight className={className} />;
}

