export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-surface-light">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sheldonbarnes-logo.png" alt="" className="h-6 w-auto" aria-hidden="true" />
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Sheldon Barnes. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://linkedin.com/in/sheldonbarnes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-primary transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:sheldonbarnes@gmail.com"
            className="text-sm text-muted hover:text-primary transition-colors"
          >
            Email
          </a>
          <span className="text-xs text-surface-light">
            Built with AI
          </span>
        </div>
      </div>
    </footer>
  );
}
