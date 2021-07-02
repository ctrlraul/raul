import React, { useEffect, useState } from 'react';
import { Route, HashRouter, Redirect } from "react-router-dom";
import Menu from './pages/Menu';
import Battle from './pages/Battle';
import Editor from './pages/Editor';
import Loading from './pages/Loading';
import Nort from './nort/Nort';

import hullsSheet from './assets/sheets/hulls.png';
import turretsSheet from './assets/sheets/turrets.png';
import RouteNames from './pages/RouteNames';


function App() {

  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    if (!loaded) {
      Nort.init({
        canvas: document.getElementById('nort-canvas') as HTMLCanvasElement,
        spriteSheets: {
          hulls: hullsSheet,
          turrets: turretsSheet,
        }
      }).then(() => {
        setLoaded(true);
      });
    }
  });


  if (!loaded) {
    return <Loading />;
  }


  return (
    <HashRouter>
      <Route exact path={RouteNames.menu} component={Menu}/>
      <Route path={RouteNames.battle} component={Battle}/>
      <Route path={RouteNames.editor} component={Editor}/>
      <Redirect to={RouteNames.menu} />
    </HashRouter>
  );
}


export default App;
