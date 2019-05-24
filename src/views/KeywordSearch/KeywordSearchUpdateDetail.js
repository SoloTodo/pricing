import React from 'react'
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Card from "reactstrap/es/Card";
import CardHeader from "reactstrap/es/CardHeader";
import CardBody from "reactstrap/es/CardBody";
import KeywordSearchUpdateTable from "../../Components/KeywordSearch/KeywordSearchUpdateTable";


class KeywordSearchUpdateDetail extends React.Component {
  render() {
    const keywordSearchUpdate = this.props.apiResourceObject;
    return <Row>
      <Col sm="12">
        <Card>
          <CardHeader>Posiciones</CardHeader>
          <CardBody>
            <KeywordSearchUpdateTable
              updateUrl={keywordSearchUpdate.url}/>
          </CardBody>
        </Card>
      </Col>
    </Row>
  }
}

export default KeywordSearchUpdateDetail
