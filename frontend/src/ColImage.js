import React, { Component } from "react";
import Col from 'react-bootstrap/Col';

class ColImage extends Component{
  
  render(){
    return (
      <Col className="mb-2">
        <img alt="..." src={this.props.thumb} style={{border: "1px solid black"}} className="img-fluid" />
      </Col>
    )
  }
}

export default ColImage;