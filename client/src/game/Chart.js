import React, { useState, useEffect } from "react";
import GoogleChart from "react-google-charts";
import OrderBox from "./OrderBox";
import Position from './Position';
import axios from 'axios';

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

const getGameData = async () => {
    const res = await axios.get('/api/gamedata');
    const data = res.data;
    return data;
};

const Chart = () => {
    const [priceData, setPriceData] = useState();
    const [volumeData, setVolumeData] = useState();
    const [nowPrice, setNowPrice] = useState(0);
    const [buyPrice, setBuyPrice] = useState(0);
    const [stocks, setStocks] = useState(0);
    const [gainPrice, setGainPrice] = useState(0);
    const [gainPercent, setGainPercent] = useState(0);
    const [nextButton, setNextButton] = useState();
    const [winCount, setWinCount] = useState(0);
    const [loseCount, setLoseCount] = useState(0);
    const [accGainPrice, setAccGainPrice] = useState(0);
    const [account, setAccount] = useState(0);

    useEffect(() => {
        getGameData()
            .then(res => {
                const positionData = res.position;
                const userData = res.user;
                setNextButton(positionData.next_btn);
                setBuyPrice(positionData.buy_price);
                setStocks(positionData.stocks);
                setAccount(userData.account);
                setAccGainPrice(userData.acc_gain_price);
                setWinCount(userData.win);
                setLoseCount(userData.lose);
            })
        drawChart();
    }, []);

    useEffect(() => {
        buyPrice === 0 ? setGainPrice(0) : setGainPrice(((nowPrice-buyPrice)*stocks));
        buyPrice === 0 ? setGainPercent(0) : setGainPercent((((nowPrice/buyPrice)-1)*100).toFixed(2));
    }, [buyPrice, nowPrice, stocks]);


    const drawChart = () => {
        getGameData()
            .then(res => {
                const chartData = res.chart;
                const priceData = chartData.reduce((pre, val, index) => {
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

                const volumeData = chartData.reduce((pre, val, index) => {
                    if(index < 50){
                        pre.push(val.volume);
                    }
                    return pre
                }, []);
                const concatVolumeData = volumeDataSetting.concat(volumeData);
                setVolumeData(concatVolumeData);
            })
            .catch(err => console.log(err));
    };
    const buy = async () => {
        const res = await axios.get('/api/buy');
        setBuyPrice(res.data.nowPrice);
        setNextButton('sell');
        setStocks(res.data.stocks);
        setAccount(res.data.account);
        return res;
    };

    const sell = async () => {
        const res = await axios.get('/api/sell');
        if (res.data.result === 'win') {
            setWinCount(winCount+1)
        } else {
            setLoseCount(loseCount+1)
        }
        setBuyPrice(0);
        setNextButton('buy');
        setStocks(0);
        setAccGainPrice(val => val += res.data.gainPrice);
        setAccount(res.data.account);
    };

    return (
        <div>
            <div style={{width: '49%', position: 'absolute', fontSize: 'small', margin: '10px 15%'}}>
                { !priceData ? '' :
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
                </div> }
                <div>
                    <OrderBox drawChart={drawChart} buy={buy} sell={sell} nextButton={nextButton}/>
                </div>
            </div>
            <div style={{width: '28%', float: 'right', marginRight: '15%', position: 'relative', fontSize: 'small'}}>
                <Position nowPrice={nowPrice} buyPrice={buyPrice} stocks={stocks} gainPrice={gainPrice} gainPercent={gainPercent} winCount={winCount} loseCount={loseCount} accGainPrice={accGainPrice} account={account} />
            </div>
        </div>
    );
};

export default Chart ;