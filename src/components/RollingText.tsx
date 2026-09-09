type RollingTextProps = {
  text: string;
  className?: string;
};

// Same "roll up and reveal a duplicate" hover reveal used by ProjectsList's
// title list, generalized as a plain CSS version (no per-item React state
// needed): the nearest ancestor with `group` triggers it, so it drops into
// any hoverable link/row.
export default function RollingText({ text, className = "" }: RollingTextProps) {
  return (
    <span className="relative block overflow-hidden">
      <span
        className={`block transition-transform duration-300 ease-out group-hover:-translate-y-full ${className}`}
      >
        {text}
      </span>
      <span
        aria-hidden
        className={`absolute top-full left-0 block w-full transition-transform duration-300 ease-out group-hover:-translate-y-full ${className}`}
      >
        {text}
      </span>
    </span>
  );
}
