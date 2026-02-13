interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className = "" }: SidebarProps) => {
  return (
    <aside
      className={`w-full sm:w-56 lg:w-64 border-r border-gray-200 bg-gray-50 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 shrink-0 ${className}`}
    >
      <header className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 text-sm sm:text-base">
          Components
        </h2>
        <span className="text-xs text-gray-500 hidden sm:inline">
          Drag to canvas
        </span>
      </header>

      <ul className="flex flex-col gap-2" role="list" aria-label="Available components">
        <li>
          <article
            className="flex items-center gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-white cursor-move transition-all hover:shadow-md hover:border-blue-300 active:scale-95"
            draggable
            role="button"
            tabIndex={0}
            aria-label="Drag Service component"
          >
            <span className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
                />
              </svg>
            </span>
            <span className="font-medium text-sm sm:text-base">Service</span>
          </article>
        </li>
      </ul>

      <footer className="mt-auto pt-3 sm:pt-4 border-t border-gray-300">
        <p className="text-xs text-gray-600 leading-relaxed">
          Drag components to the canvas to design your backend architecture.
        </p>
      </footer>
    </aside>
  );
};

export default Sidebar;
