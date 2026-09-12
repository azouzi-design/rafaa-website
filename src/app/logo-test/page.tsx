// TEMPORARY route for comparing footer-logo hover candidates side by side.
// Delete this whole directory once a variant is picked — see
// FooterLogoTest.tsx and Footer.tsx for the other half of this throwaway.

import FooterLogo from "@/components/FooterLogo";
import FooterLogoTest from "@/components/FooterLogoTest";

export default function LogoTestPage() {
  return (
    <main className="flex min-h-screen w-full flex-col gap-14 bg-primary p-4">
      <div className="flex flex-col gap-2">
        <p className="text-subtitle text-black/60">
          Current — letter morphs fully into blob
        </p>
        <FooterLogo className="aspect-[410/87] w-full" />
      </div>
      <FooterLogoTest className="aspect-[410/87] w-full" />
    </main>
  );
}
