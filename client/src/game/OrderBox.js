import React, {Component} from 'react';
import styled from "styled-components";
import Button from '@material-ui/core/Button';
import * as Api from "./CallApi";


class OrderBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            time: 30
        }
    }

    componentDidMount(){
        Api.getDataLength()
            .then((res) => {
                this.setState({time:res-50});
            })
    }

    passClick = () => {
        Api.shiftData()
            .then((res) => {
                if(!res){

                }else{
                    this.props.stateRefresh();
                    this.setState({time:this.state.time-1});
                }
            })
    };

    render() {
        return (
            <Div>
                <BoxHead>
                    <span>주문</span><span style={{fontSize: 'small'}}> (남은횟수 : {this.state.time})</span>
                </BoxHead>
                <BoxBody>
                    <Button size="small" variant="contained" onClick={this.passClick}>
                        Pass
                    </Button>
                    <Button size="small" variant="contained" color="primary">
                        Buy
                    </Button>
                    <Button size="small" variant="outlined" style={{float: 'right'}}>
                        End Game
                    </Button>
                </BoxBody>
            </Div>
        );
    }
}

const Div = styled.div`
    margin-top: 30px;
    width: 50%;
`;

const BoxHead = styled.div`
    width: 100%;
    background-color: #cad6ff;
    padding: 10px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border: 1px solid transparent;
`;

const BoxBody = styled.div`
    width: 100%;
    padding: 10px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border: 1px solid;
    border-color: #b7b7b7;
    display="inline";
`;

export default OrderBox;