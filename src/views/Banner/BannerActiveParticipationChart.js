import React from 'react'
import {chartColors} from "../../react-utils/colors";
import {Pie} from "react-chartjs-2";

class BannerActiveParticipationChart extends React.Component{
  render() {
    const aggs = this.props.data;

    if (!aggs) {
      return <div>Loading ...</div>
    }

    const labels = aggs.map(agg => agg.grouping_label);
    const participation = aggs.map(agg => agg.participation_score);
    const colors = [];

    for (let i=0; i<labels.length; ++i) {
      colors.push(chartColors[i%chartColors.length])
    }

    const data = {
      datasets: [{
        data:participation,
        backgroundColor:colors,
      }],
      labels: labels
    };

    const options = {
      legend: {
        position: 'bottom'
      }
    };

    return <div className='chart-container'>
      <br/>
      <Pie data={data} options={options}/>
    </div>
  }
}

export default BannerActiveParticipationChart