import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './Header.css';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      marginLeft: '15%'
    },
}));

const Header = () => {
    const classes = useStyles();
  
    return (
      <div>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    <Link to="/">K-Chart Game</Link>
                </Typography>
                <Button color="inherit" style={{marginRight: '15%'}}>
                    <Link to="/">Home</Link>
                </Button>
            </Toolbar>
        </AppBar>
        
        <Link to="/game">게임</Link>
      </div>
    );
}

export default Header;