const primaryLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const secondaryLinks = [
  { label: "Substack", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Copy Email", href: "#" },
];

export default function Navbar() {
  return (
    <nav className="absolute inset-x-0 top-0 z-10 mix-blend-difference flex items-center justify-between p-4 text-white uppercase">
      <ul className="flex items-center gap-6">
        {primaryLinks.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="text-subtitle">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <ul className="flex items-center gap-6">
        {secondaryLinks.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="text-subtitle">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
