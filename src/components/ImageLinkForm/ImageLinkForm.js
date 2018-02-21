import React from 'react';
import "./ImageLinkForm.css";

const ImageLinkForm = ({onInputChange, onPictureSubmit}) => {
    return (
        <div>
            <p className="f3">
                {'Esta aplicacion va a reconocer las caras en sus imagenes. Intentelo!'}
            </p>
            <div className="center">
                <div className="center pa4 br3 shadow-5 form">
                    <input type="text" placeholder="Ingrese su imagen" className="f4 pa2 w-70 center" onChange={onInputChange}/>
                    <button className="w-30 grow f4 link ph3 pv2 dib white bg-dark-gray" onClick={onPictureSubmit}>Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;