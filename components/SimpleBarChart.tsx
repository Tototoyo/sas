import React, { useState } from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  data: ChartData[];
  title: string;
  color: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, title, color }) => {
  const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);

  const chartHeight = 250;
  const chartWidth = 500; // Assuming a container will handle final width
  const barMargin = 4;
  const barWidth = (chartWidth / data.length) - barMargin;
  const maxValue = Math.max(...data.map(d => d.value), 0);

  const handleMouseOver = (e: React.MouseEvent, d: ChartData) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      content: `${d.label}: ${d.value.toFixed(2)}`,
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY - 10,
    });
  };

  const handleMouseOut = () => {
    setTooltip(null);
  };

  return (
    <div className="relative w-full">
      <h3 className="text-center font-semibold text-slate-600 mb-2">{title}</h3>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <g>
          {data.map((d, i) => {
            const barHeight = maxValue > 0 ? (d.value / maxValue) * (chartHeight - 30) : 0;
            const x = i * (barWidth + barMargin);
            const y = chartHeight - barHeight - 20;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  className="transition-opacity duration-200 opacity-70 hover:opacity-100"
                  onMouseOver={(e) => handleMouseOver(e, d)}
                  onMouseOut={handleMouseOut}
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 5}
                  textAnchor="middle"
                  className="text-[10px] fill-current text-slate-500"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      {tooltip && (
        <div
          className="absolute text-xs bg-slate-800 text-white px-2 py-1 rounded-md pointer-events-none"
          style={{ top: `${tooltip.y}px`, left: `${tooltip.x}px`, transform: 'translate(-50%, -100%)' }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default SimpleBarChart;