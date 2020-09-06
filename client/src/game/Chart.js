import React, { useState, useEffect } from "react";
import GoogleChart from "react-google-charts";
import OrderBox from "./OrderBox";
import Account from './Account';

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

const Chart = () => {
    const [priceData, setPriceData] = useState();
    const [volumeData, setVolumeData] = useState();
    const [nowPrice, setNowPrice] = useState(0);

    const stateRefresh = () => {
        callApi()
            .then(res => {
                const priceData = res.reduce((pre, val, index) => {
                    if(index < 50){
                        pre.push(val.price);
                    }
                    if(index === 49){
                        setNowPrice(val.price[3]);
                    }
                    return pre
                }, []);
                const concatPriceData = priceDataSetting.concat(priceData);
                setPriceData(concatPriceData);

                const volumeData = res.reduce((pre, val, index) => {
                    if(index < 50){
                        pre.push(val.volume);
                    }
                    return pre
                }, []);
                const concatVolumeData = volumeDataSetting.concat(volumeData);
                setVolumeData(concatVolumeData);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        callApi()
            .then(res => {
                const priceData = res.reduce((pre, val, index) => {
                    if(index < 50){
                        pre.push(val.price);
                    }
                    if(index === 49){
                        setNowPrice(val.price[3]);
                    }
                    return pre
                }, []);
                const concatPriceData = priceDataSetting.concat(priceData);
                setPriceData(concatPriceData);

                const volumeData = res.reduce((pre, val, index) => {
                    if(index < 50){
                        pre.push(val.volume);
                    }
                    return pre
                }, []);
                const concatVolumeData = volumeDataSetting.concat(volumeData);
                setVolumeData(concatVolumeData);
            })
            .catch(err => console.log(err));
    }, []);

    const callApi = async () => {
        const res = await fetch('/api/gameget');
        const body = await res.json();
        return body;
    }

    return (
        <div>
            <div style={{width: '50%', position: 'absolute', fontSize: 'small', margin: '10px 15%'}}>
                <div>
                    <GoogleChart
                        chartType="CandlestickChart"
                        width="100%"
                        height="350px"
                        data={priceData}
                        options={priceDataOptions}
                    />
                    <GoogleChart
                        chartType="ColumnChart"
                        width="95%"
                        height="150px"
                        margin="-100px"
                        data={volumeData}
                        options={volumeDataOptions}
                    />
                </div>
                <div>
                    <OrderBox stateRefresh={stateRefresh}/>
                </div>
            </div>
            <div style={{width: '26%', float: 'right', marginRight: '15%', position: 'relative', fontSize: 'small'}}>
                <Account nowPrice={nowPrice}/>
            </div>
        </div>
    );
};

export default Chart ;