import React, { Component } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

class CardUrl extends Component{
  render(){
    return (
      <Card className="mb-1">
        <Card.Body>
          <Card.Title>{this.props.url}</Card.Title>
          <Row md={4}>
            <Col>
              <img src="http://rafaelkeller.com.br/wp-content/themes/rk2018/images/intro-bg.jpg" class="img-fluid" />
            </Col>
            <Col>
              <img src="http://rafaelkeller.com.br/wp-content/themes/rk2018/images/intro-bg.jpg" class="img-fluid" />
            </Col>
            <Col>
              <img src="http://rafaelkeller.com.br/wp-content/themes/rk2018/images/intro-bg.jpg" class="img-fluid" />
            </Col>
            <Col>
              <img src="http://rafaelkeller.com.br/wp-content/themes/rk2018/images/intro-bg.jpg" class="img-fluid" />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    )
  }
}

export default CardUrl;