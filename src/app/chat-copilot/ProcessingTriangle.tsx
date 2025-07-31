import React from 'react';

type ProcessingTriangleProps = {
  color?: string;
  size?: number;
}

const ProcessingTriangle: React.FC<ProcessingTriangleProps> = ({
  color = 'currentColor',
  size = 16,
}) => {
  // Calculate the center point (centroid) of the equilateral triangle


  return (
    <div
      className="relative animate-[spinAndZoom_3s_ease-in-out_infinite]"
      style={{ height: size, width: size }}
    >
      {/* Top dot */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 "
      >
        <div
          className="rounded-full"
          style={{
            backgroundColor: color,
            height: size / 4,
            width: size / 4,
          }}
        />
      </div>

      {/* Bottom left dot */}
      <div
        className="absolute bottom-0 left-0"
      >
        <div
          className="rounded-full"
          style={{
            backgroundColor: color,
            height: size / 4,
            width: size / 4,
          }}
        />
      </div>

      {/* Bottom right dot */}
      <div
        className="absolute bottom-0 right-0 "
      >
        <div
          className="rounded-full"
          style={{
            backgroundColor: color,
            height: size / 4,
            width: size / 4,
          }}
        />
      </div>
    </div>
  );
};

export default ProcessingTriangle;