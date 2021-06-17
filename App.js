import React from 'react';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProvideAuth, PrivateRoute, LoginScreen } from './Login';
import LandingPage from './LandingPage.js';
import MainAppBar from "./MainAppBar"
import MainAppAccordion from "./MainAppAccordion"
import TaskList from './TaskList';
import TaskView from './TaskView';

export default function App() {
  return (
    
    <Container maxWidth="md">
      <ProvideAuth>
        <Router>
          <Switch>
            <Route path="/login">
            <LoginScreen />
            </Route>

            <PrivateRoute path="/listings">
              <div>
              <MainAppBar />
              <MainAppAccordion section="Listings"/>
              </div>
            </PrivateRoute>

            <PrivateRoute path="/tasks">
              <MainAppBar/>
              <TaskList/>
            <MainAppAccordion section="tasks"/>
            </PrivateRoute>

            <PrivateRoute path="/task/:taskId">
            <MainAppBar/>
            <TaskView/>
            </PrivateRoute>

            <PrivateRoute path="/customers">
              <MainAppBar/>
            <MainAppAccordion section="companies"/>
            </PrivateRoute>

            <Route path="/">
            <LandingPage />

            </Route>
          </Switch>
        </Router>
      </ProvideAuth>
    </Container> 
  )
}

/* <PrivateRoute path="/classes">
              <ClassList />
            </PrivateRoute>

            <PrivateRoute path="/projects/:classId">  
            <ProgressAppBar section="Classes" />
              <ProgressAppBar section="Projects" />
              <ProjectList />
            </PrivateRoute>` */