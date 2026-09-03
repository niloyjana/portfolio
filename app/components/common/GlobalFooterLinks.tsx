import { usePortalStore } from "@stores";

export default function GlobalFooterLinks() {
  const activePortalId = usePortalStore((state) => state.activePortalId);

  return (
    <div
      className={`fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[340px] sm:max-w-[600px] flex justify-between sm:grid sm:grid-cols-4 items-center px-8 sm:px-0 z-50 transition-all duration-500 ${
        activePortalId ? "opacity-0 translate-y-5 pointer-events-none" : "opacity-100 translate-y-0 pointer-events-auto"
      }`}
    >
      {[
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/niloy-jana/' },
        { name: 'GitHub', url: 'https://github.com/niloyjana' },
        { name: 'Email', url: 'mailto:niloyjana2005@gmail.com' },
        { name: 'Resume', url: './_RESUME.pdf' },
      ].map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] sm:text-xs font-medium tracking-[0.1em] sm:tracking-[0.2em] uppercase text-white/50 hover:text-white transition-all duration-300 hover:tracking-[0.2em] sm:hover:tracking-[0.3em] cursor-pointer py-2 text-center"
        >
          {link.name}
        </a>
      ))}
    </div>
  );
}
