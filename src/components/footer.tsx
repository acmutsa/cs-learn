import React from "react";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <nav className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/home" className="hover:text-neutral-900 dark:hover:text-white">About Us</Link>
              </li>              
            </ul>
          </nav>

          {/* Events & Activities Section */}
          <nav className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Events & Activities</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://portal.acmutsa.org/events" target="_blank" className="hover:text-neutral-900 dark:hover:text-white">Upcoming Events</Link>
              </li>
            </ul>
          </nav>

          {/* Get Involved Section */}
          <nav className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Get Involved</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://portal.acmutsa.org/" target="_blank" className="hover:text-neutral-900 dark:hover:text-white">Join ACM</Link>
              </li>
            </ul>
          </nav>

          {/* Resources Section */}
          <nav className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/home" className="hover:text-neutral-900 dark:hover:text-white">Terms of Service</Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-neutral-200 dark:border-neutral-800"></div>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                © {year} The University of Texas at San Antonio · Made by <span className="font-medium text-neutral-800 dark:text-neutral-200">ACM</span>
                {" "}x{" "}
                <span className="font-medium text-neutral-800 dark:text-neutral-200">Senior Design</span> Fall 2025
            </p>

          {/* Social Links and Repo */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
                href="https://github.com/acmutsa/cs-learn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-neutral-900 dark:hover:text-white"
            >
            {/* svg for github logo */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 opacity-80"
                aria-hidden="true"
              >
                <path
                    fillRule="evenodd"
                    d="M12 .5a11.5 11.5 0 0 0-3.637 22.41c.575.105.785-.25.785-.555 0-.274-.01-.999-.015-1.963-3.19.694-3.866-1.539-3.866-1.539-.523-1.327-1.277-1.681-1.277-1.681-1.043-.713.08-.699.08-.699 1.153.081 1.76 1.184 1.76 1.184 1.025 1.757 2.69 1.25 3.343.956.104-.742.4-1.25.727-1.538-2.548-.289-5.226-1.274-5.226-5.666 0-1.252.447-2.276 1.182-3.078-.119-.29-.512-1.454.112-3.03 0 0 .965-.309 3.164 1.176a10.96 10.96 0 0 1 2.881-.387c.978.004 1.964.132 2.882.387 2.198-1.485 3.162-1.176 3.162-1.176.625 1.576.232 2.74.114 3.03.737.802 1.18 1.826 1.18 3.078 0 4.402-2.683 5.374-5.24 5.66.41.353.775 1.05.775 2.116 0 1.527-.014 2.76-.014 3.134 0 .308.208.666.79.553A11.501 11.501 0 0 0 12 .5Z"
                    clipRule="evenodd"
                />
              </svg>
              <span>Repo</span>
            </a>

            <a
                href="https://discord.com/invite/NvjUxmR"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 dark:hover:text-white"
            >
                Discord
            </a>
            <a
                href="https://www.linkedin.com/company/acmutsa/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 dark:hover:text-white"
            >
                LinkedIn
            </a>
            <a 
                href="https://www.instagram.com/acmutsa/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-neutral-900 dark:hover:text-white">
                    Instagram
            </a>
            <a
              href="mailto:team@acmutsa.org"
              className="hover:text-neutral-900 dark:hover:text-white"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
