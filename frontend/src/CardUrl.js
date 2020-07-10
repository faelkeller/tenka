import React, { Component } from "react";
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import ColImage from './ColImage';

class CardUrl extends Component{ 

  render(){

    let urlObject = this.props.urlObject; 
    let url = urlObject.url;
    let thumbs = urlObject.thumbs;
    let id = urlObject.id;
    let hiddenMsg = (urlObject.thumbLoaded === true) ? true : false;
    
    let items = thumbs.map((thumb, idx) => 
      <ColImage key={idx} idx={idx} thumb={thumb} ></ColImage> 
    );


    return (
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>
            <Alert variant="info">
              #{id} - {url}
            </Alert>
          </Card.Title>
          {hiddenMsg === false &&
            <Alert variant="secondary">
              Carregando imagens ...
            </Alert>
          }
          <Row md={4}>
            {items}
          </Row>
        </Card.Body>
      </Card>
    )
  }
}

export default CardUrl;