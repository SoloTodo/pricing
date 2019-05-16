import React from 'react'
import {connect} from "react-redux";
import moment from 'moment';
import {Row, Col, Card, CardHeader, CardBody} from "reactstrap";

import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import {
  ApiForm,
  ApiFormChoiceField,
  ApiFormResultsTable,
  createOrderingOptionChoices
} from "../../react-utils/api_forms";
import KeywordSearchCreateButton from "../../Components/KeywordSearch/KeywordSearchCreateButton";


class KeywordSearchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      keywordSearches: undefined,
      endpoint: 'keyword_searches/'
    };
  }

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  setKeywordSearches = json => {
    this.setState({
      keywordSearches: json? json.payload : null
    })
  };

  updateEndpoint = () => {
    this.setState({
      endpoint: 'keyword_searches/?_='+moment().format()
    })
  };

  render() {
    const columns = [
      {
        label: 'Tienda',
        ordering: 'store',
        renderer: keywordSearch => keywordSearch.store.name
      },
      {
        label: 'Categoría',
        renderer: keywordSearch => keywordSearch.category.name

      },
      {
        label: 'Keyword',
        renderer: keywordSearch => keywordSearch.keyword
      },
      {
        label: 'Threshold',
        renderer: keywordSearch => keywordSearch.threshold
      },
    ];

    return <ApiForm
      endpoints={[this.state.endpoint]}
      fields={['ordering']}
      onResultsChange={this.setKeywordSearches}
      onFormValueChange={this.handleFormValueChange}>
      <ApiFormChoiceField
        name="ordering"
        choices={createOrderingOptionChoices(['store'])}
        initial='store'
        hidden={true}
        value={this.state.formValues.ordering}/>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">Keywords <KeywordSearchCreateButton/></CardHeader>
            <CardBody>
              <ApiFormResultsTable
                results={this.state.keywordSearches}
                columns={columns}
                ordering={this.state.formValues.ordering}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </ApiForm>;
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
    stores: filterApiResourceObjectsByType(state.apiResourceObjects, 'stores'),
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories')
  }
}

export default connect(mapStateToProps)(KeywordSearchList);