import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from '../admin/Login';
import Company from '../admin/Company';

const checkAdmin = async () => {
    const chk = await axios.post('/api/admin');
    return chk;
};

const Admin = () => {
    const [area, setArea] = useState();

    useEffect(() => {
        checkAdmin()
            .then(setArea(<Company />))
            .catch(err => {
                setArea(<Login />);
                console.log('err : ', err.response);
            })
    }, []);
    return (
        <div>
            {area}
        </div>
    );
}

export default Admin;