import React, {useState} from 'react';
import styled from "styled-components";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
    card: {
      minWidth: 350,
      minHeight: 400
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
}));

const Result = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    return (
        <>
        <Button size="small" variant="outlined" style={{float: 'right'}} onClick={handleOpen}>
            End Game
        </Button>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
                    <Div>
                    <Card className={classes.card}>
                        <TitleBox>
                            <Typography variant="h6" style={{fontFamily: 'auto', color:'white'}}>게임 결과</Typography>
                        </TitleBox>
                            <CardContent style={{display: 'flex', height: '280px'}}>
                                <div style={{width: '30%', float:'left'}}>
                                    <Typography variant="button" display="block" gutterBottom>랭킹 :</Typography>
                                    <Typography variant="button" display="block" gutterBottom>승률 :</Typography>
                                    <Typography variant="button" display="block" gutterBottom>평가손익 :</Typography>
                                    <Typography variant="button" display="block" gutterBottom>수익률 :</Typography>
                                    <Typography variant="button" display="block" gutterBottom>잔고 :</Typography>
                                    <br />
                                    <Typography variant="button" display="block" gutterBottom>종목 :</Typography>
                                    {/* <Typography variant="button" display="block" gutterBottom>기간 :</Typography> */}
                                    <br />
                                    <Typography variant="button" display="block" gutterBottom>랭킹 등록 :</Typography>
                                </div>
                                <div style={{width: '60%', float:'left'}}>
                                    <Typography variant="button" display="block" gutterBottom>1위</Typography>
                                    <Typography variant="button" display="block" gutterBottom>1234123</Typography>
                                    <Typography variant="button" display="block" gutterBottom>1234123</Typography>
                                    <Typography variant="button" display="block" gutterBottom>1234123</Typography>
                                    <Typography variant="button" display="block" gutterBottom>1234123</Typography>
                                    <br />
                                    <Typography variant="button" display="block" gutterBottom>1234123</Typography>
                                    {/* <Typography variant="button" display="block" gutterBottom>1234123</Typography> */}
                                    <br />
                                    <input style={{width:'100px'}}/><Button size="small" variant="outlined" style={{marginLeft: '10px'}}>등록</Button>
                                </div>
                            </CardContent>
                        <EndBox>
                        <Button size="small" variant="outlined" color="primary">
                            다시하기
                        </Button>
                        <Button size="small" variant="outlined" color="primary" style={{marginLeft: '170px'}}>
                            메인으로
                        </Button>
                        </EndBox>
                    </Card>
                </Div>
            </Fade>
          </Modal>
        </>
    );
}

const Div = styled.div`
    display: flex;
    justify-content: center;
`;

const TitleBox = styled.div`
    height: 49px;
    background-color: #6a8bff;
    display: flex;
    align-items: center;
    padding-left: 16px;
    border-bottom: 1px solid;
`;
const EndBox = styled.div`
    height: 47px;
    background-color: #e7edff;
    display: flex;
    align-items: center;
    padding-left: 16px;
    border-top: 1px solid;
`;


export default Result;