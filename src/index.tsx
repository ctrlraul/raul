import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import lockScreenOrientation from './lockScreenOrientation';
import wakeLock from './wakeLock';
import './assets/global.css';


ReactDOM.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <App />,
  document.getElementById('root')
);


lockScreenOrientation('landscape')
  .then(() => {
    console.log('Screen orientation locked!');
  })
  .catch(err => {
    console.warn('Failed to lock screen orientation:', err.message);
  });


wakeLock('screen')
  .then(() => {
    console.log('Screen WakeLock locked!');
  })
  .catch(err => {
    console.warn('Failed to lock screen WakeLock:', err.message);
  });
