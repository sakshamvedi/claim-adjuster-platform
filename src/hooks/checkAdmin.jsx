import React, { useState, useEffect } from 'react';

function checkAdmin() {
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        const checkIfAdmin = localStorage.getItem('xxaabbxxttokenrightadsssdsdmkzzddd');
        if (checkIfAdmin == "true") {
            setIsAdmin(true);
        }
        else {
            setIsAdmin(false);
        }
    }, []);
    return isAdmin;
}

export default checkAdmin