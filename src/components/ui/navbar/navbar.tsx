import BackArchLogo from "@/assets/logo/backarch-logo.svg";

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className = "" }: NavbarProps) => {
  return (
    <header
      className={`h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 shrink-0 ${className}`}
    >
      <a href="/" className="flex items-center gap-2" aria-label="BackArch Home">
        <img
          src={BackArchLogo.src}
          alt="BackArch Logo"
          className="h-8 w-auto sm:h-10"
        />
      </a>

      <nav className="flex items-center gap-2 sm:gap-3">
        <label htmlFor="stack-selector" className="sr-only">
          Select Technology Stack
        </label>
        <select
          id="stack-selector"
          className="w-36 sm:w-50 bg-gray-50 border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="node-express">Node.js + Express</option>
          <option value="python-django">Python + Django</option>
          <option value="python-fastapi">Python + FastAPI</option>
          <option value="java-spring">Java + Spring Boot</option>
          <option value="go-gin">Go + Gin</option>
          <option value="dotnet-core">.NET Core</option>
        </select>
      </nav>

      <button
        type="button"
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Generate
      </button>
    </header>
  );
};

export default Navbar;
