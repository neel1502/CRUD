import './App.css'
import UserDetail from './UserDetail'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddUser from './AddUser';
import Home from './Home';
import EditUser from './editUser';
import ThemeSignInPage from './ThemeSignInPage';
function App() {
  return ( 
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<ThemeSignInPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/users" element={<UserDetail />} />
            <Route path="/adduser" element={<AddUser />} />
            <Route path="/edituser/:id" element={<EditUser />} />
          </Routes>
        </Router>
      </div>
  )
}


export default App;
