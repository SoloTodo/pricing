import React from 'react';
import {Card, CardHeader, CardBody, Col, Row} from 'reactstrap';

import {settings} from "../../settings";
import {formatDateStr} from "../../react-utils/utils";
import {
  ApiForm,
  ApiFormResultsTable,
  ApiFormPaginationField,
  ApiFormChoiceField
} from "../../react-utils/api_forms";

class StoreDetailUpdateLogs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      apiFormFieldChangeHandler: undefined,
      updateLogs: undefined
    }
  }

  setApiFormFieldChangeHandler = apiFormFieldChangeHandler => {
    this.setState({
      apiFormFieldChangeHandler
    })
  };

  setUpdateLogs = json => {
    this.setState({
      updateLogs: json ? json.payload : null
    })
  };

  handleFormValueChange = formValues => {
    this.setState({formValues})
  };

  render() {
    const statusDict = settings.statusDict;

    const columns = [
      {
        label: 'Estado',
        renderer: entry => statusDict[entry.status]
      },
      {
        label: 'Resultado',
        renderer: entry => entry.availableProductsCount
          ? `${entry.availableProductsCount} / ${entry.unavailableProductsCount} / ${entry.discoveryUrlsWithoutProductsCount}`
          : 'N/A'
      },
      {
        label: 'Ultima actualización',
        renderer: entry => formatDateStr(entry.lastUpdated)
      },
      {
        label: 'Categorías',
        renderer: entry => (
          <ul>
            {entry.categories.map(pt => (
              <li key={pt.url}>{pt.name}</li>
            ))}
          </ul>
        ),
        cssClasses: 'hidden-xs-down'
      },
      {
        label: 'Inicio',
        renderer: entry => formatDateStr(entry.creationDate),
        cssClasses: 'hidden-sm-down'
      }
    ];

    return (
      <ApiForm
        endpoints={[settings.apiResourceEndpoints.store_update_logs + '?store=' + this.props.apiResourceObject.id]}
        fields={['page', 'page_size']}
        onResultsChange={this.setUpdateLogs}
        onFormValueChange={this.handleFormValueChange}
        setFieldChangeHandler={this.setApiFormFieldChangeHandler}>

        <ApiFormChoiceField
          name="page_size"
          choices={[{id: 5, name: 5}]}
          required={true}
          hidden={true}
          onChange={this.state.apiFormFieldChangeHandler}
          value={this.state.formValues.page_size}
          urlField={null}
        />

        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>Registros de actualización</CardHeader>
              <CardBody>
                <div className="mb-3 float-right">
                  <ApiFormPaginationField
                    page={this.state.formValues.page}
                    pageSize={this.state.formValues.page_size}
                    resultCount={this.state.updateLogs && this.state.updateLogs.count}
                    onChange={this.state.apiFormFieldChangeHandler}/>
                </div>
                <ApiFormResultsTable
                  results={this.state.updateLogs && this.state.updateLogs.results}
                  columns={columns}
                  onChange={this.state.apiFormFieldChangeHandler}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ApiForm>
    )
  }
}

export default StoreDetailUpdateLogs;