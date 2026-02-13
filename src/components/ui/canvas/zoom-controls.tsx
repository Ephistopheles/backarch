interface ZoomControlsProps {
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
}

export const ZoomControls = ({
  zoom = 100,
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps) => {
  return (
    <nav
      className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-col gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm"
      aria-label="Zoom controls"
    >
      <button
        type="button"
        onClick={onZoomIn}
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Zoom In"
        aria-label="Zoom in"
      >
        <svg
          className="w-4 h-4 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v12M6 12h12"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={onZoomOut}
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Zoom Out"
        aria-label="Zoom out"
      >
        <svg
          className="w-4 h-4 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 12h12"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={onReset}
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Reset View"
        aria-label="Reset zoom to 100%"
      >
        <svg
          className="w-4 h-4 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      </button>

      <output className="text-xs text-center text-gray-600 px-1 py-0.5">
        {zoom}%
      </output>
    </nav>
  );
};

export default ZoomControls;
