export const shiftData = async () => {
    const res = await fetch('/api/shift');
    if(res){
        const json = await res.json();
        return json;
    }else{
        return false;
    }
}

export const getDataLength = async () => {
    const res = await fetch('/api/gameget');
    const json = await res.json();
    return json['chart'].length;
}