import { ZoomControls } from "./zoom-controls";

interface CanvasProps {
  className?: string;
  zoom?: number;
}

export const Canvas = ({ className = "", zoom = 100 }: CanvasProps) => {
  return (
    <section
      className={`flex-1 relative overflow-hidden bg-gray-50 min-h-75 ${className}`}
      aria-label="Architecture canvas"
    >
      <ZoomControls zoom={zoom} />

      <figure className="absolute inset-0 p-4">
        <canvas
          className="w-full h-full bg-white rounded-lg border border-gray-300"
          aria-label="Architecture diagram canvas"
        />
      </figure>
    </section>
  );
};

export default Canvas;
