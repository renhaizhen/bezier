import './App.css';
import Bezier from './components/bezier';
const o = {
  point:{ p1: { x: 0, y: 600 }, p2: { x: 600, y: 0 }, cp1: { x: 100, y: 100 } ,cp2:{ x: 400, y: 400 }},
  x:0.23
}
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Bezier pointO={o}/>
      </header>
    </div>
  );
}

export default App;
