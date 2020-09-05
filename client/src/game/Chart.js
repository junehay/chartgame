import React, { Component } from "react";
import GoogleChart from "react-google-charts";
import styled from "styled-components";

const priceDataSetting = [
    [{
        type: "string",
        id: ""
    },
    {
        type: "number"
    },
    {
        type: "number"
    },
    {
        type: "number"
    },
    {
        type: "number"
    },
    {
        type: 'string',
        role: 'tooltip'
    }]
];

const priceDataOptions = {
    colors: ['black'],
    backgroundColor: '',
    bar: {
        groupWidth: '60%'
    },
    candlestick: {
        risingColor: {
            fill: 'red',
            stroke: 'red'
        },
        fallingColor: {
            fill: 'blue',
            stroke: 'blue'
        }
    },
    vAxis: {
        textPosition: ''
    },
    legend: {
        position: 'none'
    },
    chartArea: {
        'width': '50%',
        'height': '82%',
        'left': 0
    },
    series: [{
        targetAxisIndex: 1,
        0: {color: 'red'},
        1: {color: 'blue'}
    }]
};


const volumeDataSetting = [
    ["Element", "거래량"]
];

const volumeDataOptions = {
    colors: ['#93bf85'],
    legend: {
        position: 'none'
    },
    chartArea: {
        'width': '50%',
        'height': '82%',
        'left': 0
    },
    series: [{
        targetAxisIndex: 1
    }],
    vAxis: {format: 'short'}
};

class Chart extends Component {
    state = {
        priceData : ''
    }

    componentDidMount(){
        this.callApi()
            .then(res => {
                const priceData = res.map((e, index) => {
                    return e.price;
                });
                const concatPriceData = priceDataSetting.concat(priceData);
                this.setState({priceData: concatPriceData});

                const volumeData = res.map((e, index) => {
                    return e.volume;
                });
                const concatVolumeData = volumeDataSetting.concat(volumeData);
                this.setState({volumeData: concatVolumeData});
                
            })
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const res = await fetch('/api/gameget');
        const body = await res.json();
        return body;
    }

    // componentDidUpdate(){
    //     setTimeout(() => {
    //         let sticks = document.querySelectorAll('rect[fill="#000000"]');
    //         sticks.forEach(e => {
    //             e.setAttribute('width', 1);
    //         })
    //     }, 1000); 
    // }

    render(){
        return (
            <Div ref={c => this.div = c}>
                <GoogleChart
                    chartType="CandlestickChart"
                    width="100%"
                    height="350px"
                    data={this.state.priceData}
                    options={priceDataOptions}
                />
                <GoogleChart
                    chartType="ColumnChart"
                    width="100%"
                    height="150px"
                    margin="-100px"
                    data={this.state.volumeData}
                    options={volumeDataOptions}
                />
            </Div>
        );
    }
};

const Div = styled.div`
    margin: 10px 15%;
`;

export default Chart ;