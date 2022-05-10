import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Login from './pages/Login'
import Navibar from './components/Navibar'

function App() {
  return (
    <>
    <Router>
      <Navibar/>
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
