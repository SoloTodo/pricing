import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import {filterApiResourceObjectsByType} from "../../react-utils/ApiResource";
import {connect} from "react-redux";
import {Row, Col, Card, CardHeader, CardBody, Table} from 'reactstrap'

class ReportList extends Component {
  render() {
    const reports = this.props.reports;

    return (
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader>Reportes</CardHeader>
            <CardBody>
              <Table striped>
                <thead>
                <tr>
                  <th>Nombre</th>
                </tr>
                </thead>
                <tbody>
                {reports.map(report => (
                  <tr key={report.id}>
                    <td><NavLink to={`/reports/${report.slug}`}>{report.name}</NavLink></td>
                  </tr>
                ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state) {
  return {
    reports: filterApiResourceObjectsByType(state.apiResourceObjects, 'reports')
  }
}

export default connect(mapStateToProps)(ReportList);
