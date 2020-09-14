import axios from 'axios';

export const shiftData = async () => {
    const res = await axios.post('/api/shift');
    if(res === 'end'){
        return false;
    }else{
        return res.data
    }
}

export const getDataLength = async () => {
    const res = await axios.post('/api/gameget');
    const data = res.data;
    return data['chart'].length;
}