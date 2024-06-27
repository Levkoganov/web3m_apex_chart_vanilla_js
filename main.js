import { fetchData } from "./fetchData.js";

const initializeChart = async () => {
  const data = await fetchData();

  // Create new array for categories and series
  const categories = data.map(({ name }) => name);
  const seriesData = data.map(({ market_cap }) => market_cap);

  // Calculate max, min, and average market cap
  const maxMarketCap = Math.max(...seriesData); // Max
  const minMarketCap = Math.min(...seriesData); // Min
  const averageMarketCap =
    seriesData.reduce((sum, value) => sum + value, 0) / seriesData.length; // Avg

  // Set Range values based on market caps
  const customRangeElement = document.querySelector("#customRange");
  customRangeElement.value = minMarketCap;
  customRangeElement.max = maxMarketCap;
  let minRangeValue = (customRangeElement.min = minMarketCap);
  document.querySelector(".marketCap").textContent = minMarketCap;

  // Chart options
  let options = {
    chart: {
      type: "bar",
      id: "bar",
      height: "500",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: false,
      },
    },
    dataLabels: { enabled: false },
    annotations: {
      yaxis: [
        {
          y: maxMarketCap,
          borderColor: "#00E396",
          label: {
            borderColor: "#00E396",
            style: {
              color: "#fff",
              background: "#00E396",
            },
            text: "Highest market cap",
          },
        },
        {
          y: minMarketCap,
          borderColor: "#FF4560",
          label: {
            borderColor: "#FF4560",
            style: {
              color: "#fff",
              background: "#FF4560",
            },
            text: "Lowest market cap",
          },
        },
        {
          y: averageMarketCap,
          borderColor: "#5145ff",
          label: {
            borderColor: "#5145ff",
            style: {
              color: "#fff",
              background: "#5145ff",
            },
            text: `Average market cap`,
          },
        },
      ],
    },
    title: {
      text: "Cryptocurrency Market cap.",
      align: "center",
      margin: 20,
      offsetY: 20,
      style: { fontSize: "20px" },
    },
    xaxis: {
      categories: categories,
    },
    series: [
      {
        name: "Market Cap",
        data: seriesData,
      },
    ],
  };

  let chart = new ApexCharts(document.querySelector("#chart"), options); // Init Chart
  chart.render(); // Render chart

  function updateChartType(type) {
    chart.destroy(); // Destroy the existing chart
    options.chart.type = type; // Update the chart type
    options.dataLabels.enabled = type !== "bar"; // Update dataLabels based on the chart type
    chart = new ApexCharts(document.querySelector("#chart"), options); // Recreate the chart with updated options
    chart.render(); // Render chart
  }

  // Event Listeners for buttons
  document.querySelector("#buttonContainer").addEventListener("click", (e) => {
    if (e.target.id === e.target.value) {
      updateChartType(e.target.value);
    }
  });

  document.querySelector("#customRange").addEventListener("input", function () {
    document.querySelector(".marketCap").textContent = customRangeElement.value;
  });

  document.querySelector("#myForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let rangeValue = document.querySelector("#customRange").value;
    const filter = data.filter(
      ({ market_cap }) =>
        market_cap >= minRangeValue && market_cap <= rangeValue
    );

    chart.updateOptions({
      series: [
        {
          name: "Market cap",
          data: filter.map(({ market_cap }) => market_cap),
        },
      ],
      xaxis: { categories: filter.map(({ name }) => name) },
    });
  });
};

// Call the async function to initialize the chart
initializeChart();
