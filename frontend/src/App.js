import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CardUrl from './CardUrl';

class App extends Component {

  constructor() {
    super();
    this.state = {
      urls: [],
      endpoint: "http://localhost:3000",
      url: "",
      processing: []
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("updateImages", data => this.pushUrl(data));
  }

  pushUrl(objectUrl){
    let urls = this.state.urls;

    var index = null;
    
    for (let i=0; i < urls.length; i++){
      if (objectUrl._id == urls[i]._id){
        index = i;  
      }
    }

    if (index !== null){
      urls.splice(index, 1);  
    }
    
    urls.push(objectUrl);
    
    this.setState((state) => {
      return {urls: urls}
    }); 
    
  }

  handleChange(event){
    this.setState({url: event.target.value});
  }

  sendUrl(){
    let url = this.state.url;
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('sendUrl', url)
    this.setState((state) => {
      return {url: ""}
    }); 
  }

  render(){

    let urls = this.state.urls;
    let items = urls.map((urlObject, idx) =>
      <CardUrl key={urlObject.id} id={urlObject.id} url={urlObject.url} thumbs={urlObject.thumbs}  />
    );

    return (
      <section>
        <Container className="p-3">
          <Form.Group>
            <Form.Control type="text" name="url" id="url" value={this.state.url} onChange={event=>this.handleChange(event)} placeholder="Insira uma url. ex.: http://rafaelkeller.com.br" />
          </Form.Group>

          <Button onClick={() => this.sendUrl()}>Enviar</Button>        
          
        </Container>

        <Container className="p-3">
          {items}    
        </Container>
      </section>
      
    );  
  }
  
}

export default App;
