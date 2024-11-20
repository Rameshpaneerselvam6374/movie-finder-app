import React, { useState } from 'react';
import '../Components/styles/darkmode.css';
import { MdModeNight , MdOutlineModeNight } from "react-icons/md";

const DarkMode = () => {
    const [isToggle, setIsToggle] = useState(false);

    const toggle = () => {
        setIsToggle(previous => ! previous);
    }
  return (
    <>
    <div className={`container ${isToggle ? "on":"off"}`}>
        <button onClick={toggle} className='toggle-button'>
            {isToggle ? "<MdModeNight />" : "<MdOutlineModeNight />"}
        </button>
    </div>
    </>
  )
}

export default DarkMode;