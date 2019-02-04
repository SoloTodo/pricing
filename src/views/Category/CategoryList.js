import React from 'react';
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {Row, Col, Card, CardHeader, CardBody, Table} from "reactstrap"
import {
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";

class CategoryList extends React.Component {
  render() {
    return(
      <Row className="row">
        <Col sm="12">
          <Card>
            <CardHeader>Categorías</CardHeader>
            <CardBody>
              <Table responsive striped>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th/>
                  <th/>
                </tr>
                </thead>
                <tbody>
                {this.props.categories.filter(category => category.permissions.includes('view_category_reports'))
                  .map(category => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                      <td><NavLink to={'/categories/'+ category.id + '/current_prices'}>Precios actuales</NavLink></td>
                      <td><NavLink to={'/categories/'+ category.id + '/share_of_shelves'}>Share of shelves</NavLink></td>
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
    categories: filterApiResourceObjectsByType(state.apiResourceObjects, 'categories'),
  }
}

export default connect(mapStateToProps)(CategoryList);