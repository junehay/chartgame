import React from "react";
import ReactDOM from "react-dom";
import Chart from "react-google-charts";

const data = [
  [
    {
      type: "string",
      id: "Date"
    },
    {
      type: "number"
    },
    {
      type: "number"
    },
    {
      type: "number"
    },
    {
      type: "number"
    },
    {
      type : 'string', 
      role : 'tooltip'
    }
  ],
  ["", 200, 208, 388, 450, '시가:200\n저가:230\n고가:300, 종가300'],
  ["", 301, 308, 505, 660, '33'],
  ["", 500, 505, 707, 800, '33'],
  ["", 707, 707, 606, 500, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 608, 606, 202, 105, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 707, 707, 606, 500, '33'],
  ["", 707, 707, 606, 500, '33'],
  ["", 707, 707, 606, 500, '33'],
  ["", 200, 208, 308, 450, '33'],
  ["", 500, 505, 707, 120, '33'],
  ["", 500, 505, 707, 120, '33'],
  ["", 500, 505, 707, 120, '33'],
  ["", 500, 505, 707, 120, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 707, 707, 606, 500, '33'],
  ["", 707, 707, 606, 500, '33'],
  ["", 707, 707, 606, 500, '33'],
  ["", 200, 208, 308, 450, '33'],
  ["", 500, 505, 707, 120, '33'],
  ["", 500, 505, 707, 120, '33'],
  ["", 500, 505, 707, 120, '33'],
  ["", 500, 505, 707, 120, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 608, 606, 202, 150, '33'],
  ["", 707, 707, 606, 500, '33'],
  ["", 707, 707, 606, 500, '33'],
  ["", 707, 707, 606, 500, '33'],
  ["", 200, 208, 308, 450, '33'],
  ["", 707, 707, 606, 500, '33'],
  ["", 707, 707, 606, 500, '33'],
  ["", 707, 707, 606, 500, '33'],
  ["12", 200, 208, 308, 450, '33']
];


const options = {
  width: 900,
  colors:['black'],
  backgroundColor: '',
  bar:{groupWidth:'60%'},
  candlestick:{
    risingColor:{fill:'red', stroke:'red'},
    fallingColor:{fill:'blue', stroke:'blue'}
  },
  vAxis:{textPosition:''},
  legend:{position:'none'},
  chartArea: {'width': '70%', 'height': '82%'},
};

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Chart
          chartType="CandlestickChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="200px"
          margin="-100px"
          data={data}
          options={options}
        />
      </div>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
