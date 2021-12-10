import React from 'react';
import Meme from '../../assets/image/spider_man_meme_admin.jpg';

const NotAllowed = () => {
    sessionStorage.setItem('Admin',false);
    return (
        <div style={{ textAlign: "center" }}>
            <h1>Only User ID Allowed</h1>
            <img src={Meme} alt="meme" />
        </div>
    )
}

export default NotAllowed
