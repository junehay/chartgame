import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from '../admin/Login';
import Dashboard from '../admin/Dashboard';

const checkAdmin = async () => {
    const chk = await axios.get('/api/admin');
    return chk;
};

const Admin = () => {
    const [area, setArea] = useState();

    useEffect(() => {
        checkAdmin()
            .then(setArea(<Dashboard />))
            .catch(err => {
                setArea(<Login />);
            })
    }, []);
    return (
        <div>
            {area}
        </div>
    );
}

export default Admin;