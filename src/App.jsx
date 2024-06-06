import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Monthly from "./components/Monthly";
import Weekly from "./components/Weekly";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import axios from "axios";
import Flip from "gsap";
import Daily from "./components/Daily";

function App() {
  gsap.registerPlugin(Flip);

  const [count, setCount] = useState(0);
  const [graphData, setGraphData] = useState();

  const [graph, setCurrentGraph] = useState("monthly");
  useEffect(() => {
    const storedValue = localStorage.getItem("graphData");
    if (storedValue) {
      setGraphData(JSON.parse(storedValue));
    }

    const currentDateInSeconds = Math.floor(Date.now() / 1000);
    console.log(currentDateInSeconds);
    axios
      .get(
        `https://paal-ecosystem-backend.onrender.com/wallet/revenue?chain=1&token=eth&type=unique&date${currentDateInSeconds}`
      )
      .then((response) => {
        console.log(response.data.data);
        const rawData = response.data.data;
        rawData.month = Object.entries(rawData.month);
        rawData.week = Object.entries(rawData.week);
        rawData.day = Object.entries(rawData.day);
        console.log(rawData);
        localStorage.setItem("graphData", JSON.stringify(rawData));

        setGraphData(rawData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const allTabs = document.querySelectorAll(".graph-tab");
    allTabs.forEach((tab) => {
      tab.classList.remove("active");
    });

    allTabs.forEach((tab) => {
      if (tab.textContent.toLowerCase().includes("monthly")) {
        tab.classList.add("active");
      }
    });
  }, []);

  useGSAP(() => {}, [graph]);
  function changeGraph(e) {
    const allGraphs = gsap.utils.toArray(".graph");
    const name = e.currentTarget.textContent.toLowerCase();
    const allTabs = document.querySelectorAll(".graph-tab");
    allTabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    // let state = Flip.getState(allGraphs);
    setCurrentGraph(name);

    e.currentTarget.classList.add("active");

    // Flip.from(state, {
    //   absolute: true,
    //   ease: "power1.inOut",
    // });

    console.log(graphData);
  }

  return (
    <main className="min-h-[100vh] w-full flex justify-center items-center">
      <section className="w-full max-w-[800px] flex flex-col items-end">
        <div className="flex text-white gap-4 mr-5">
          <div
            className="graph-tab"
            onClick={(e) => {
              changeGraph(e);
            }}
          >
            Daily
          </div>
          <div
            className="graph-tab"
            onClick={(e) => {
              changeGraph(e);
            }}
          >
            Weekly
          </div>
          <div
            className="graph-tab"
            onClick={(e) => {
              changeGraph(e);
            }}
          >
            Monthly
          </div>
        </div>
        <div className="w-full h-[500px] bg-black p-5 py-10 border-[#6C4E93] border-2 rounded-2xl relative z-[20]">
          {graphData ? (
            <>
              {" "}
              <Monthly
                class={graph == "monthly" ? "block" : "hidden"}
                graphData={graphData.month}
              />
              <Weekly
                class={graph == "weekly" ? "block" : "hidden"}
                graphData={graphData.week}
              />
              <Daily
                class={graph == "daily" ? "block" : "hidden"}
                graphData={graphData.day}
              />
            </>
          ) : (
            <p className="text-white">Loading</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
