import axios from 'axios';

export const shiftData = async () => {
  const res = await axios.get('/api/shift');
  if (res === 'end') {
    return false;
  } else {
    return res.data;
  }
};
