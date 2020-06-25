import React, { Component } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

class CardUrl extends Component{
  render(){

    let thumbs = this.props.thumbs;
    let items = thumbs.map((thumb, idx) =>
      <Col key={idx} className="mb-2"><img key={idx} alt="..." src={thumb} className="img-fluid" /></Col>
    );


    return (
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>
            <Alert variant="info">
              #{this.props.id} - {this.props.url}
            </Alert>
          </Card.Title>
          <Row md={4}>
            {items}
          </Row>
        </Card.Body>
      </Card>
    )
  }
}

export default CardUrl;