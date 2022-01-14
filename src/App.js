// Components.
import { Link, Route, Routes } from 'react-router-dom'
import { Route1, Route2 } from './routes'

// Styles, utils, and other helpers.
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

      <Routes>
        <Route exact path="/route1" component={<Route1 />} />
        <Route exact path="/route2" component={<Route2 />} />
      </Routes>
    </div>
  );
}

export default App;
