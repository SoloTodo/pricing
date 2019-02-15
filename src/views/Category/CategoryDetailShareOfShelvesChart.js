import React from 'react'
import {Pie} from 'react-chartjs-2'
import {Row, Col, Table} from "reactstrap";
import {
  chartColors
} from "../../react-utils/colors";

class CategoryDetailShareOfShelvesChart extends React.Component{
  render() {
    const aggs = this.props.results;

    if (!aggs){
      return <div/>
    }

    const labels = aggs.map(agg => agg.label);
    const countData = aggs.map(agg => agg.doc_count);
    const colors = [];

    for (let i=0; i<labels.length; ++i) {
      colors.push(chartColors[i%chartColors.length])
    }

    const data = {
      datasets: [{
        data: countData,
        backgroundColor: colors,
      }],

      labels: labels
    };

    const options = {
      legend: {
        position: 'bottom'
      }
    };

    return <Row>
      <Col sm="8">
        <br/>
        <div className='chart-container'>
          <Pie data={data} options={options}/>
        </div>
      </Col>
      <Col sm="4">
        <br/>
        <Table responsive striped>
          <thead>
          <tr>
            <th>{this.props.active_bucketing}</th>
            <th>Apariciones</th>
          </tr>
          </thead>
          <tbody>
          {countData.map((count, index) => <tr key={index}>
              <td>{labels[index]}</td>
              <td>{count}</td>
            </tr>
          )}
          </tbody>
        </Table>
      </Col>
    </Row>
  }
}

export default CategoryDetailShareOfShelvesChart;
