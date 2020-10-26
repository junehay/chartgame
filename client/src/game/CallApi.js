import axios from 'axios';

export const shiftData = async () => {
    const res = await axios.get('/api/shift');
    if(res === 'end'){
        return false;
    }else{
        return res.data
    }
}

export const getDataLength = async () => {
    const res = await axios.get('/api/gamedata');
    const data = res.data;
    return data['chart'].length;
}