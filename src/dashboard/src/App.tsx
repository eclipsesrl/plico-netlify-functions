import React from 'react';
import './App.css';
import Checkout from './features/checkout/Checkout';
import FirebaseService from './app/firebase';

FirebaseService.login().then(() => {
  FirebaseService.getToken().then(console.log);
});

function App() {
  return (
    <div className="App">
      <Checkout></Checkout>
    </div>
  );
}

export default App;
