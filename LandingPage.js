import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import TruckPhoto from "./usedsemitrucks.jpg"
import './LandingPage.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function LandingPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
        <Typography variant="h6" className={classes.title}>
            Trackin' Trucks
          </Typography>
          <Button color="inherit">
            <Link color="inherit" to="/login" className="loginBtnTxt">Login</Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Typography align="center" variant="h4" className={classes.title}>
            Trackin' Trucks Never Been Easier!
        </Typography>
        <img src={TruckPhoto} class="center"/> 
    </div>
  );
}