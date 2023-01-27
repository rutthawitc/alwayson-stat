import React from "react";
import useSWR from "swr";
import { Bar } from "react-chartjs-2";
import reg6Con from "../r6config/reg6.config.json";
import SumArray from "@/utils/SumArray";
import SumByKey from "@/utils/SumByKey";
import CalculateSum from "@/utils/CalculateSum";

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

function MonthAverage() {
  //Set up SWR to run the fetcher function when calling "/api/staticdata"
  //There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const { data, error } = useSWR("/api/staticdata", fetcher);
  //Handle the error state
  if (error) return <div>Failed to load</div>;
  //Handle the loading state
  if (!data) return <div>Loading...</div>;

  //PWA Target From JSON File
  const target = reg6Con.r6target;

  //Month Count
  const filecount = Object.keys(data).length;
  //console.log(filecount);

  //------Re constract Data of json to one array--
  // @param 'json_data' is a one array of all month data
  //----------------------------------------------
  const array_obj = [];
  const json_data = [];
  for (let i = filecount - 1; i >= 0; i--) {
    array_obj[i] = data[i];
    //* Re-Struct Json Array
    Array.prototype.push.apply(json_data, array_obj[i]);
  }
  //console.log(json_data);

  //*-----------------------------------------------
  //* Summary Data Function [Data of branch summary ]
  //* The resualt is an array of sumdata (by branch)|
  //*-----------------------------------------------
  const res_other = SumByKey(json_data, "ba_code", "cnt_other");
  const res_inv = SumByKey(json_data, "ba_code", "cnt_inv");
  //console.log(res_other);
  //console.log(res_inv);
  //*------------- End Sum Function ----------------
  //*-----------------------------------------------

  //*------- Percent (%) Calculate-----------------
  //*-- The Resualt is an array of % (by branch) --

  const percent_result = res_other.map((item1) => {
    const item2 = res_inv.find((i) => i.ba_code === item1.ba_code);
    return {
      ba_code: item1.ba_code,
      value: ((item1.cnt_other * 100) / item2.cnt_inv).toFixed(2),
    };
  });
  //console.log(percent_result);

  //---Get Month Name---
  const date = new Date();
  const month = date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
  });

  // -----Setup Chart--------
  // Create Data Label  -----
  const labels = data[0].map((jsondata) => jsondata.org_name);
  labels.push("ภาพรวมเขต");
  //console.log(labels);

  //Map Data from array to ChartData Object.
  const graphdat = percent_result.map((data) => data.value);
  //----- Calculate for Reg6 Average Value
  const suminv = CalculateSum(res_inv, "cnt_inv");
  const sumother = CalculateSum(res_other, "cnt_other");
  const r6average = ((sumother * 100) / suminv).toFixed(2);
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

  return (
    <div>
      <h2 className="font-semibold text-center font-lg">
        ข้อมูลเฉลี่ยย้อนหลัง {filecount} เดือน
      </h2>
      <h5 className="text-sm text-center">
        ตั้งแต่ {reg6Con.start_month}
        {month}
      </h5>
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

export default MonthAverage;
