import React, { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
} from "recharts";

export default function Weekly(props) {
  const formatCurrency = (value) => `$${value.toLocaleString()}`;
  const [graphData, setGraphData] = useState([]);
  useEffect(() => {
    const days = props.graphData.map((item) => {
      const date = new Date(Number(`${item[0]}`));
      const actualDay = date.toLocaleString("en-US", { weekday: "long" });
      const formattedDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return {
        name: `${actualDay}`,
        day: `${formattedDate}`,
        TVL: 0,
        Fees: Math.floor(item[1].usd),
      };
    });

    setGraphData(days);
  }, []);
  let lastMonth = "";
  const formatTick = (tick) => {
    if (tick === lastMonth) {
      console.log(tick);
      return "";
    }
    lastMonth = tick;
    console.log(tick);
    return tick;
  };
  return (
    <ResponsiveContainer className={`${props.class} graph`}>
      <BarChart
        data={graphData}
        margin={{
          right: 30,
          left: 80,
        }}
      >
        <XAxis
          dataKey="name"
        //   tickFormatter={formatTick}
          label={{
            value: "Day",
            position: "insideBottom",
            offset: -20,
            fill: "white",
          }}
        />

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
            dy: 20,
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
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
      <div className="p-4 bg-white flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{day}</p>
        {/* <p className="text-sm text-blue-400">
          TVL:
          <span className="ml-2">${payload[0].value}</span>
        </p> */}
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
