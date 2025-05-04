import { LogOutIcon, PowerCircleIcon } from 'lucide-react'
import React from 'react'


function Logout() {
    const handleLogout = () => {

        localStorage.clear();
        window.location.href = '/login';
    }
    return (
        <>
            <button className='flex items-center gap-2 text-white bg-red-500 rounded-full px-2 py-2' onClick={handleLogout}>
                <PowerCircleIcon className='w-6 h-6' />
            </button>
        </>
    )
}

export default Logout