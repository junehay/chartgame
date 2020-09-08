import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './Header.css';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1
    },
}));

const Header = () => {
    const classes = useStyles();
  
    return (
      <div>
        <AppBar position="static" style={{backgroundColor: 'black', marginBottom: '50px'}}>
            <Toolbar>
                <TrendingUpIcon style={{marginLeft: '15%', marginRight: '5px'}}/>
                <Typography variant="h6" className={classes.title}>
                    <Link to="/" style={{color: 'white'}}>K-Chart Game</Link>
                </Typography>
                <Button color="inherit" style={{marginRight: '15%'}}>
                    <Link to="/" style={{color: 'white'}}>Home</Link>
                </Button>
            </Toolbar>
        </AppBar>
      </div>
    );
}

export default Header;