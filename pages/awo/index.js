import Head from "next/head";
import { Sarabun } from "@next/font/google";
import r6Con from "../../r6config/reg6.config.json";
import clsx from "clsx";
import MonthlyStat from "./MonthlyStat";
import MonthAverage from "./MonthAverage";

export const title_txt = Sarabun({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
});

export default function Home() {
  return (
    <div className="bg-slate-200">
      <Head>
        <title>{r6Con.reg6}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h2
          className={clsx(
            "max-w-2xl mx-auto bg-white rounded-md shadow-md overflow-hidden md:max-w text-center mb-8 pt-5 pb-3 lg:max-w-5xl",
            title_txt.className
          )}
        >
          {r6Con.header_txt}
        </h2>
      </div>
      <div
        className={clsx(
          "max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w mt-3 pr-3 pl-3 pt-2 lg:max-w-5xl",
          title_txt.className
        )}
      >
        <MonthlyStat />
      </div>
      <div
        className={clsx(
          "max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w mt-5 mb-8 pr-3 pl-3 pt-2 lg:max-w-5xl",
          title_txt.className
        )}
      >
        <MonthAverage />
      </div>
    </div>
  );
}