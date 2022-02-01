import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import {Home, Root} from './pages'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <Route path={'/'} component={Root} exact/>
          <Route path={'/result'} component={Home} exact/>
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App