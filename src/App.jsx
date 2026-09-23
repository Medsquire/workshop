import React from 'react';
import UI from './components/UI';

function App() {
  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, backgroundColor: 'rgba(0,0,0,0.6)' }} />
      <UI />
    </>
  );
}

export default App;
