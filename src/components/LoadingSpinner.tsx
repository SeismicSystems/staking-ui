import { Box } from "@mui/material";

interface LoadingSpinnerProps {
  size?: number;
}

export const LoadingSpinner = ({ size = 60 }: LoadingSpinnerProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Base logo - static */}
        <img
          src="/main.png"
          alt="Seismic Logo"
          style={{
            height: size,
            width: size,
            objectFit: "contain",
          }}
        />

        {/* Animated SVG overlay */}
        <svg
          width={size}
          height={size} // Maintain aspect ratio
          viewBox="0 0 145.56 209.96"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <defs>
            {/* Gradient definition */}
            <linearGradient
              id="strokeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
            </linearGradient>

            <style>
              {`
                .line-path {
                  fill: none;
                  stroke: url(#strokeGradient);
                  stroke-miterlimit: 10;
                  stroke-width: 3px;
                  stroke-dasharray: 60 840; /* 60px visible dash, 840px gap */
                  animation: travelingDash 2s linear infinite;
                }
              `}
            </style>
          </defs>

          {/* Your continuous traced path */}
          <path
            id="mainPath"
            d="M1.16,128.25L71.57,1.27l56.33,23.72,16.63,113.97-26.52,69.01-66.54.99L1.16,128.25ZM120.98,106.02l-69.5,102.94M1.16,128.25L69.43,38.99l2.14-37.72M69.43,38.99l74.88,98.47M127.89,24.99l-6.49,82.36"
            className="line-path"
          />
        </svg>
      </Box>

      <style>
        {`
          @keyframes travelingDash {
            from { 
              stroke-dashoffset: 1; 
            }
            to { 
              stroke-dashoffset: 900; /* Total dash + gap length */
            }
          }
        `}
      </style>
    </Box>
  );
};
