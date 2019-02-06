import React from 'react'
import {Pie} from 'react-chartjs-2'
import Select from "react-select";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import connect from "react-redux/es/connect/connect";
import {Row, Col, Table} from "reactstrap";
import {
  chartColors
} from "../../react-utils/colors";

class CategoryDetailShareOfShelvesChart extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      param: 'brands'
    }
  }

  handleParamChange = param => {
    this.setState({
      param: param.value
    })
  };

  render() {
    const currentParam = this.state.param;
    const choiceDict = this.props.chartChoices[currentParam];
    const paramAggs = this.props.data[currentParam];

    if(!choiceDict || !paramAggs){
      return <div/>
    }

    const labels = paramAggs.map(agg => {
      const label = choiceDict.choices.filter(choice => choice.id === agg.id);
      return label[0].name;
    });

    const countData = paramAggs.map(agg => agg.doc_count);

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

    const selectOptions = [];

    for(const param in this.props.chartChoices){
      selectOptions.push({value: param, label:this.props.chartChoices[param].label})
    }

    return <Row>
      <Col sm="8">
        <div className='chart-container'>
          <label htmlFor="aggregation">Agrupado por</label>
          <Select className="react-select"
                  id = "aggregation"
                  name = "aggregation"
                  defaultValue = {selectOptions.filter(option => option.value === this.state.param)[0]}
                  options={selectOptions}
                  onChange={this.handleParamChange}
          />
          <br/>
          <Pie data={data} options={options}/>
        </div>
      </Col>
      <Col sm="4">
        <Table responsive striped>
          <thead>
          <tr>
            <th>{this.props.chartChoices[this.state.param].label}</th>
            <th>Apariciones</th>
          </tr>
          </thead>
          <tbody>
          {countData.map((count, index) => <tr>
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

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth
  }
}

export default connect(mapStateToProps)(CategoryDetailShareOfShelvesChart);
