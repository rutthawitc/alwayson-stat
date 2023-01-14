import React from "react";
import useSWR from "swr";
import { Bar } from "react-chartjs-2";
import reg6Con from "../r6config/reg6.config.json";
import SumArray from "@/utils/SumArray";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/* Write a fetcher function to wrap the native fetch function 
and return the result of a call to url in json format. */
const fetcher = (url) => fetch(url).then((res) => res.json());

function MonthlyStat() {
  //Set up SWR to run the fetcher function when calling "/api/staticdata"
  //There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const { data, error } = useSWR("/api/staticdata", fetcher);
  //Handle the error state
  if (error) return <div>Failed to load</div>;
  //Handle the loading state
  if (!data) return <div>Loading...</div>;
  //console.log(data);
  //PWA Target From JSON File
  const target = reg6Con.r6target;

  //Month Count
  const filecount = Object.keys(data).length;
  //console.log(filecount);

  //----- Sum Data----
  const suminv = SumArray(data[filecount - 1], "cnt_inv");
  //console.log(suminv);
  const sumother = SumArray(data[filecount - 1], "cnt_other");
  //console.log(sumother);

  //Calculate Reg6 Average %
  const r6average = ((sumother * 100) / suminv).toFixed(2);
  //console.log(r6average);

  //---Get Month Name---
  const date = new Date();
  const month = date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
  });

  // -----Setup Chart--------
  // Create Data Label  -----
  //Get Data Date
  const loadDate = data[filecount - 1].map((loadDate) => loadDate.data_date);
  //console.log(loadDate[0]);

  const labels = data[filecount - 1].map((jsondata) => jsondata.org_name);
  labels.push("ภาพรวมเขต");
  //console.log(labels);

  //Map Data from Jason Data to ChartData Object.
  const graphdat = data[filecount - 1].map((jsondata) =>
    ((jsondata.cnt_other * 100) / jsondata.cnt_inv).toFixed(2)
  );
  //Add Reg6 Average value to Data
  graphdat.push(r6average);
  //console.log(graphdat);

  //----Graph Data  ----
  const graph_data = {
    labels,
    datasets: [
      {
        label: reg6Con.reg6_percent_text,
        data: 0,
        backgroundColor: "rgba(255, 27, 49, 0.8)",
      },
      {
        label: reg6Con.branch_percent_text,
        data: graphdat,
        backgroundColor: graphdat.map((item, index) => {
          return index === graphdat.length - 1
            ? "rgba(255, 27, 49, 0.8)"
            : "rgba(39, 123, 245, 0.8)";
        }),
      },
    ],
  };
  //--------------------
  //------Options -----
  const options = {
    responsive: true,
  };
  //-------------------
  //Options & Target Line
  const plugins = {
    id: "targetLine",
    beforeDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { top, bottom, left, right, width, height },
        scales: { x, y },
      } = chart;
      ctx.save();

      //Target Line
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      /* y.getPixelForValue is for PWA Always On
      Target */
      ctx.strokeRect(left, y.getPixelForValue(target), width, 0);
      ctx.restore();

      //Target Background
      ctx.fillStyle = "rgb(0,200,0,0.2)";
      ctx.fillRect(left, top, width, y.getPixelForValue(target) - top);
      ctx.restore();

      //Target Text
      ctx.font = "12px Arial";
      ctx.fillStyle = "red";
      ctx.fillText(
        `เป้าหมายองค์กร ${target.toFixed(2)} %`,
        width / 2,
        y.getPixelForValue(target) - 10
      );
      ctx.textAlign = "center";
      ctx.restore();
    },
  };

  /* --------- Main Funtion ---------- */

  return (
    <div>
      <h2 className="font-semibold text-center font-lg">ประจำเดือน {month}</h2>
      <h5 className="text-xs text-center">ข้อมูล ณ {loadDate[0]}</h5>
      <br />
      <Bar
        height={600}
        width={800}
        data={graph_data}
        options={options}
        plugins={[plugins]}
      />
    </div>
  );
}

export default MonthlyStat;
