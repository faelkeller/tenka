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
      processing: [],
      socket: null
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("makeNew", data => this.makeNew(data));
    socket.on("updateImages", data => this.updateImages(data));
    socket.on("listUrls", data => this.listUrls(data));
    socket.emit("getUrls", {});
    this.setState((state) => {
      return {socket: socket}
    });
    
  }

  listUrls(arrayUrls){

  }

  makeNew(objectUrl){
    let urls = this.state.urls;
    urls.unshift(objectUrl); 
    this.setState((state) => {
      return {urls: urls}
    }); 
  }

  updateImages(objectUrl){
    let urls = this.state.urls;

    var index = null;

    for (let i=0; i < urls.length; i++){
      if (objectUrl.id == urls[i].id){
        index = i;  
      }
    }

    if (index !== null){
      let thumbs = objectUrl.thumbs;
      thumbs.map((thumb) => {
        urls[index].thumbs.push(thumb);
        urls[index].thumbLoaded = true;
      });
    }
    
    this.setState((state) => {
      return {urls: urls}
    }); 
    
  }

  handleChange(event){
    this.setState({url: event.target.value});
  }

  sendUrl(){
    let url = this.state.url;
    this.state.socket.emit('sendUrl', url)
    this.setState((state) => {
      return {url: ""}
    }); 
  }

  render(){

    let urls = this.state.urls;
    let items = urls.map((urlObject, idx) =>
      <CardUrl key={urlObject.id} urlObject={urlObject}   />
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
