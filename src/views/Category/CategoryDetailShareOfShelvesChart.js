import React from 'react'
import {Pie} from 'react-chartjs-2'
import Select from "react-select";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import connect from "react-redux/es/connect/connect";

class CategoryDetailShareOfShelvesChart extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      param: 'brands'
    }
  }

  render() {
    const current_param = this.state.param;
    const choice_dict = this.props.chartChoices[current_param];
    const agg = this.props.data[current_param];

    if(!choice_dict || !agg){
      return <div/>
    }

    const labels = agg.map(choice => {
      const label = choice_dict.choices.filter(choice_data => choice_data.id === choice.id);
      return label[0].name;
    });

    const count_data = agg.map(choice => choice.doc_count);

    const data = {
      datasets: [{
        data: count_data
      }],

      labels: labels
    };

    const options = {
      legend: {
        position: 'bottom'
      }
    };

    console.log(this.props.chartChoices);

    const select_options = [];

    for(const param in this.props.chartChoices){
      select_options.push({value: param, label:this.props.chartChoices[param].label})
    }

    console.log(select_options);

    return <div className='chart-container'>
      <Select className="react-select"
              options={select_options}/>
      <Pie data={data} options={options}/>
    </div>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth
  }
}

export default connect(mapStateToProps)(CategoryDetailShareOfShelvesChart);
