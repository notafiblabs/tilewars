import React, { useContext, useState } from 'react';
import '../style/App.scss'
import { TileContainer } from './TileContainer';
import { TileContextProvider } from './TileContext';
import { TileViewer } from './TileViewer';

function App() {
  let [zoom, setZoom] = useState(0);

  return (
    <TileContextProvider>
      <div className="App">      
          <TileViewer zoom={zoom} setZoom={setZoom}/>  
          <TileContainer rows={20} cols={20} zoom={zoom} setZoom={setZoom}/>
      </div>
    </TileContextProvider> 
  );
}

export default App;
