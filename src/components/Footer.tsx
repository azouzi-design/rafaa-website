import FooterLogo from "@/components/FooterLogo";

const links = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
  { label: "Substack", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function Footer() {
  return (
    <footer className="flex w-full snap-start flex-col gap-20 bg-primary p-4">
      <nav className="flex w-full items-center justify-between text-black uppercase">
        {links.map((link) => (
          <a key={link.label} href={link.href} className="text-subtitle">
            {link.label}
          </a>
        ))}
      </nav>
      <FooterLogo className="aspect-[410/87] w-full" />
    </footer>
  );
}
