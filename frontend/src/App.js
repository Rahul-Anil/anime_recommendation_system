import { ThemeProvider } from "@mui/material";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";

import { Route, Router, Switch, Redirect, withRouter } from "react-router";

import { BrowserRouter } from "react-router-dom";

import "./App.css";
import Topbar from "./component/Topbar";
import store from "./store/store";
import { theme } from "./style/theme";
import MainPage from "./view/MainPage";
import SearchPage from "./view/SearchPage";
import UserSetting from "./view/UserSetting";
import LoginPage from "./view/LoginPage";
import SignupPage from "./view/SignupPage";
import SubscriptionPage from "./view/SubscritionPage";
import PaymentPage from "./view/PaymentPage";
import ConfirmPage from "./view/ConfirmPage";
import AdminPage from "./view/AdminPage";
import PreferencePage from "./view/PreferencePage";

var hist = createBrowserHistory();

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <BrowserRouter history={hist}>
            <Switch>
              <Route path="/login" component={LoginPage} />
              <Route path="/signup" component={SignupPage} />
              <Route path="/subscription" component={SubscriptionPage} />
              <Route path="/payment" component={PaymentPage} />
              <Route path="/confirm" component={ConfirmPage} />

              <Route path="/preference" component={PreferencePage} />

              <Route exact path="/" component={withRouter(LoginPage)} />
              <Route path="/admin" component={AdminPage} />
              <div>
                <Topbar router={hist} />
                <Route path="/userSetting" component={UserSetting} />
                <Route path="/main" component={MainPage} />

                <Route
                  exact
                  path="/search"
                  component={withRouter(SearchPage)}
                />
              </div>
            </Switch>
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
