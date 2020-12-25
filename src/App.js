import './App.css';
import SignUp from './components/auth/SignUp'
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Login from './components/auth/Login'
import PrivateRoute from './components/PrivateRoute'
import ProjectPage from './components/ProjectPage';

//Set up routes
//Dashbord è settata su private per impedire l'accesso a chi non possiede un profilo


function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path ="/" component = {Dashboard}/>
          <Route path = "/signup" component = {SignUp} />
          <Route path = "/login" component = {Login} />
          <Route path = "/project" component = {ProjectPage} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
