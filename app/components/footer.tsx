import ThemeToggle from "./themeToggle";

export default function Footer() {
  return (
    <footer className="py-8 mt-8">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">
            Some of My Links (More found on GitHub)
          </h1>
          <ThemeToggle />
        </div>

        {/* Social Media Links */}
        <div className="mb-4">
          <ul className="flex justify-center space-x-6">
            <li>
              <a
                href="https://www.linkedin.com/in/roelf-pretorius-467551190/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Blaarslaai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>

        {/* Copyright Section */}
        <div className="text-sm">
          <p>&copy; {new Date().getFullYear()} MY-LMA. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
