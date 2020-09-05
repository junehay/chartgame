import React, { Component } from "react";
import GoogleChart from "react-google-charts";
import OrderBox from "./OrderBox";

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
        'height': '82%',
        'left': 0
    },
    series: [{
        targetAxisIndex: 1
    }],
    vAxis: {format: 'short'}
};

class Chart extends Component {
    constructor(props){
        super(props);
        this.state = {
            priceData: '',
            volumeData: ''
        }
    }

    stateRefresh = () => {
        this.callApi()
            .then(res => {
                const priceData = res.reduce((pre, val, index) => {
                    if(index < 50){
                        pre.push(val.price);
                    }
                    return pre
                }, []);
                const concatPriceData = priceDataSetting.concat(priceData);
                this.setState({priceData: concatPriceData});

                const volumeData = res.reduce((pre, val, index) => {
                    if(index < 50){
                        pre.push(val.volume);
                    }
                    return pre
                }, []);
                const concatVolumeData = volumeDataSetting.concat(volumeData);
                this.setState({volumeData: concatVolumeData});
            })
            .catch(err => console.log(err));
    }

    componentDidMount(){
        this.callApi()
            .then(res => {
                const priceData = res.reduce((pre, val, index) => {
                    if(index < 50){
                        pre.push(val.price);
                    }
                    return pre
                }, []);
                const concatPriceData = priceDataSetting.concat(priceData);
                this.setState({priceData: concatPriceData});

                const volumeData = res.reduce((pre, val, index) => {
                    if(index < 50){
                        pre.push(val.volume);
                    }
                    return pre
                }, []);
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
            <div ref={c => this.div = c}>
                <div>
                    <GoogleChart
                        chartType="CandlestickChart"
                        width="100%"
                        height="350px"
                        data={this.state.priceData}
                        options={priceDataOptions}
                    />
                    <GoogleChart
                        chartType="ColumnChart"
                        width="95%"
                        height="150px"
                        margin="-100px"
                        data={this.state.volumeData}
                        options={volumeDataOptions}
                    />
                </div>
                <div>
                    <OrderBox stateRefresh={this.stateRefresh}/>
                </div>
            </div>
        );
    }
};

export default Chart ;