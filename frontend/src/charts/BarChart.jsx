import React from "react";
import { Chart } from "react-chartjs-2";
import {
   Chart as ChartJS,
   LineController,
   LineElement,
   PointElement,
   LinearScale,
   CategoryScale,
   BarController,
   BarElement,
   Title,
} from "chart.js";

ChartJS.register(BarElement,BarController,CategoryScale,LineController, LineElement, PointElement, LinearScale, Title);

const BarChart = (props) => {
   return (
      <Chart
        type="bar"
        data={props.chartData}
        options={props.options}
      />
   );
};

export default BarChart;
