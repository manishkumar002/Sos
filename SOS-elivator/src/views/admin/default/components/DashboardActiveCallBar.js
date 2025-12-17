import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DashboardActiveCallBar = ({weekGraph}) => {

const data=weekGraph.data || []
  
    const [hoveredIndex, setHoveredIndex] = useState(null); // State to track hovered bar

    // Data for the bar chart
    // const data = [
    //   { calls: 190 },
    //   { calls: 130 },
    //   { calls: 250 },
    //   { calls: 170 },
    //   { calls: 210 },
    //   { calls: 270 },
    //   { calls: 100 },
    // ];
  
    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1" className="linearGradiantData">
              <stop offset="0%" stopColor="#11C078" stopOpacity={0.8} background="#ffffff" />
              <stop offset="100%" stopColor="#B7D5FD" stopOpacity={0.8} background="#ffffff" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0 1" background="#ffffff" />
          <XAxis dataKey="count" axisLine={false} tickLine={false} className="linearXasis" background="#ffffff" />
          <Tooltip className="tooltipDataBar" background="#ffffff" />
          <Bar
            dataKey="count"
            fill="url(#gradientColor)"
            barSize={22}
            radius={[10, 10, 0, 0]}
            background=''
            //onMouseEnter={(_, index) => setHoveredIndex(index)} // Update hover index
            //onMouseLeave={() => setHoveredIndex(null)} // Reset hover index
          >
            {data.map((entry, index) => (
              <Bar
                key={`bar-${index}`}
                dataKey="count"
                fill={hoveredIndex === index ? "white" : "url(#gradientColor)"} // White on hover
                radius={[10, 10, 0, 0]} // Round corners
                background="#ffffff"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

export default DashboardActiveCallBar;
