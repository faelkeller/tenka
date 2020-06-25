import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class App extends Component {

  constructor() {
    super();
    this.state = {
      urls: [],
      endpoint: "http://localhost:3000",
      url: ""
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("updateImages", data => this.setState({ response: data }));
  }

  pushUrl(data){
    console.log(this.state.urls);
  }

  handleChange(event){
    console.log(event);
    this.setState({url: event.target.value});
  }

  sendUrl(){
    let url = this.state.url;
    console.log(url);
    //socket.emit("sendUrl", url);
    this.setState((state) => {
      return {url: ""}
    }); 
  }

  render(){
    return (
      <div className="App">
        <input type="text" name="url" id="url" value={this.state.url} onChange={this.handleChange} />
        <button onClick={this.sendUrl} >Enviar</button>
      </div>
    );  
  }
  
}

export default App;
