// Components.
import { Link } from 'react-router-dom'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Presentation Tool</h1>

        <nav>
          <Link to="/route1">Route 1</Link>{' '}
          <Link to="/route2">Route 2</Link>
        </nav>
      </header>
    </div>
  );
}

export default App;
