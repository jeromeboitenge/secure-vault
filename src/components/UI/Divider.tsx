export function Divider({ className = '' }: DividerProps) {
  return <hr className={`divider ${className}`} aria-hidden="true" />;
}

interface DividerProps {
  className?: string;
}
