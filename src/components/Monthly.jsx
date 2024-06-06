import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

export default function Monthly(props) {
  const formatCurrency = (value) => `$${value.toLocaleString()}`;
  const [graphData, setGraphData] = useState([]);
  useEffect(() => {
    const days = props.graphData.map((item) => {
      const date = new Date(Number(`${item[0]}`));
      const month = date.toLocaleString("en-US", { month: "long" });
      const formattedDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
      });

      return {
        name: `${month}`,
        day: `${formattedDate}`,
        TVL: 0,
        Fees: Math.floor(item[1].usd),
      };
    });

    setGraphData(days);
  }, []);
  return (
    <ResponsiveContainer
      className={`${props.class} graph`}
      width="100%"
      height="100%"
    >
      <BarChart
        data={graphData}
        margin={{
          right: 30,
          left: 80,
        }}
      >
        <XAxis dataKey="name">
          <Label
            value="Month"
            offset={-20}
            position="insideBottom"
            fill="white"
          />
        </XAxis>

        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={formatCurrency}
          domain={[0, 100]}
          label={{
            value: "USD",
            position: "insideLeft",
            angle: -90,
            dx: -70,
            fill: "white",
          }}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="left"
          wrapperStyle={{
            bottom: -10, // Adjust the top offset
          }}
        />
        <CartesianGrid stroke="gray" strokeDasharray="3 3" vertical={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent"}}   />
        {/* <Bar
          width={1}
          dataKey="TVL"
          fill="#5E29AC"
          shape={<CustomBarShape />}
        /> */}
        <Bar
          dataKey="Fees"
          fill="#9462E1"
          shape={<CustomBarShape />}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

const CustomBarShape = (props) => {
  const { x, y, width, height, fill } = props;
  const radius = 5; // Adjust this value to change the border radius

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      rx={radius}
      ry={radius}
    />
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { day } = payload[0].payload;
    return (
      <div className="p-4 bg-white flex flex-col gap-2 rounded-md">
        <p className="text-medium text-lg">{day}</p>
        {/* <div className="flex justify-center items-center gap-3">
          <span className="h-[10px] w-[10px] bg-[#5E29AC] rounded-[50%]"></span>
          <p className="text-sm text-[#5E29AC]">
            TVL:
            <span className="ml-2">${payload[0].value}</span>
          </p>
        </div> */}
        <div className="flex justify-center items-center gap-3">
          <span className="h-[10px] w-[10px] bg-[#9462E1] rounded-[50%]"></span>
          <p className="text-sm text-[#9462E1]">
            Fees:
            <span className="ml-2">${payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      </div>
    );
  }
};
