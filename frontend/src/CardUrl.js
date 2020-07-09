import React, { Component } from "react";
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import ColImage from './ColImage';

class CardUrl extends Component{ 

  render(){

    let thumbs = this.props.thumbs;
    let items = thumbs.map((thumb, idx) => 
      <ColImage key={idx} idx={idx} thumb={thumb} ></ColImage> 
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