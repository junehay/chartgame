import React from 'react';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

  
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(25),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


const Submit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('/api/admin/login', {
            id: e.target.id.value,
            password: e.target.password.value
        });
        console.log('ddd : ', res.data)
        if (res.data === 'OK') {
            document.location.reload();
        }
    } catch(err) {
        if (err.response.data === 'INVALID ID') {
            alert('등록된 ID가 없습니다.');
        } else if(err.response.data === 'INVALID PWD') {
            alert('잘못된 비밀번호입니다.');
        } else {
            console.log('err: ', err)
        }
    }
};

const Login = () => {
    const classes = useStyles();

    return(
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <form className={classes.form} onSubmit={Submit}>
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="id"
                label="Id"
                name="id"
                autoFocus
                />
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                />

                <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                >
                Sign In
                </Button>
            </form>
            </div>
        </Container>
    );
};

export default Login;