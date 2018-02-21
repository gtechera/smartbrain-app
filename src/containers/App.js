import React, { Component } from 'react';
import './App.css';
import Navigation from "../components/Navigation/Navigation";
import Logo from "../components/Logo/Logo";
import ImageLinkForm from "../components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "../components/FaceRecognition/FaceRecognition";
import Rank from "../components/Rank/Rank";
import Particles from 'react-particles-js';
import SignIn from "../components/SignIn/SignIn";
import Register from "../components/Register/Register";




const ParticlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      }
    },
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
}

const initialState = {
  input: '',
  imageURL: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''  
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow : clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayBox = (box) => {
    this.setState({box: box});
  }
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onPictureSubmit = (event) => {
    this.setState({imageURL: this.state.input});
    fetch('https://powerful-stream-47684.herokuapp.com/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => { 
        if (response) {
          fetch('https://powerful-stream-47684.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })

          }).then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
        }
        this.displayBox(this.calculateFaceLocation(response)) })
    .catch(err => console.log(err));
  }

onRouteChange = (route) => {
  if (route === 'signout' || route === 'signin' || route === 'register') {
    this.setState(initialState)
  }else if (route === 'home') {
    this.setState({ isSignedIn: true })
  }
  this.setState({route: route});
}


  render() {
    const {route, isSignedIn, imageURL, box} = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={ParticlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        {route === 'home' ? 
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition box={box} imageURL={imageURL} />
          </div>
          :(route === 'signin' ?
            <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />)
        }
      </div>
    );
  }
}

export default App;
