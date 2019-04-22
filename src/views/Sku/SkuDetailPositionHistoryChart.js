import React from 'react'
import {connect} from "react-redux";
import moment from "moment";

import {
  apiResourceStateToPropsUtils
} from "../../react-utils/ApiResource";
import {
  chartColors,
  lightenDarkenColor
} from "../../react-utils/colors";
import {Line} from "react-chartjs-2";

class SkuDetailPositionHistoryChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entityPositions: undefined
    }
  }

  preparePositionHistoryChartData = () => {
    let result = [];
    const convertedData = {};

    for (const position of this.props.chart.data) {
      const key = position.section.name;
      if (!convertedData[key]) {
        convertedData[key] = []
      }
      convertedData[key].push({
        timestamp: moment(position.entity_history.timestamp),
        value: position.value
      })
    }

    for (const section in convertedData) {
      let lastTimestampSeen = undefined;
      let positionHistory = [];

      for (const data of convertedData[section]) {
        const timestamp = data['timestamp'];

        if (lastTimestampSeen) {
          positionHistory = positionHistory.concat(this.fillTimeLapse(lastTimestampSeen, timestamp))
        }

        let value = data['value'];
        lastTimestampSeen = timestamp;
        positionHistory.push({
          section,
          value,
          timestamp
        })
      }
      result.push({
        section,
        positionHistory
      })
    }

    return result
  };

  makeEmptyDataPoint = (date) => {
    return {
      timestamp: date,
      value: NaN,
    }
  };

  fillTimeLapse = (startDate, endDate) => {
    const result = [];
    const targetDate = endDate.clone().startOf('day');
    let iterDate = startDate.clone().add(1, 'days').startOf('day');

    while (iterDate < targetDate) {
      result.push(this.makeEmptyDataPoint(iterDate.clone()));
      iterDate.add(1, 'days')
    }
    return result;
  };

  render() {
    if (!this.props.chart) {
      return <div/>
    }

    const entity = this.props.entity;
    const filledChartData = this.preparePositionHistoryChartData();

    const maxValue = filledChartData.reduce((acum, datapoint) => {
      const localMax = datapoint.positionHistory.reduce((localAcum, valuePoint) => Math.max(localAcum, valuePoint.value || 0), 0);
      return Math.max(acum, localMax)
    }, 0);

    const yAxes = [
      {id: 'value-axis',
        ticks: {
          suggestedMax: maxValue * 1.1,
          callback: function (value, index, values) {
            return value
          }
        }
      }
    ];

    const endDate = this.props.chart.endDate.clone().add(1, 'days');

    const datasets = filledChartData.map((dataset, idx) => {
      const color = chartColors[idx % chartColors.length];
      let datasetLabel = dataset.section;

      return {
        label: datasetLabel,
        data: dataset.positionHistory.map(datapoint => ({
          x: datapoint.timestamp,
          y: datapoint.value.toString(),
        })),
        fill: false,
        borderColor: color,
        backgroundColor: lightenDarkenColor(color, 40),
        lineTension: 0
      }
    });

    const chartOptions = {
      title: {
        display: true,
        text: entity.name
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            min: this.props.chart.startDate.format('YYYY-MM-DD'),
            max: endDate.format('YYYY-MM-DD'),
            displayFormats: {
              day: 'MMM DD'
            },
            unit: 'day'
          }
        }],
        yAxes: yAxes
      },
      legend: {
        position: 'bottom'
      },
      maintainAspectRatio:false
    };

    const chartData = {
      datasets: datasets
    };

    return <div id="chart-container" className="flex-grow">
      <Line data={chartData} options={chartOptions}/>
    </div>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
  }
}

export default connect(mapStateToProps)(SkuDetailPositionHistoryChart);