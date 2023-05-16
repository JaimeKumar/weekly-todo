import React from 'react'

var selected = false;


export default function WeekBlock({day, routineTask, dayClick, hoverTP, leaveTP, progress, routineClick}) {
    function handleClick(e) {
        dayClick(day);
    }

    function dayHover() {
        hoverTP(day.id);
    }

    function dayLeave() {
        leaveTP(day.id);
    }

    function doubleClick() {
        if (day.today === true) {
            routineClick()
        }
    }

    var routineText = '';
    if (day.today===true) {
        routineText = routineTask;
    }

    var progressPush = '0%';
    if (day.today === true) {
        progressPush = (progress * 100) + '%';
    }

    var selectedDisplay = 'none';
    if (day.selected) {
        selectedDisplay = 'flex';
    }

    return (
    <div id={day.id} className='weekBlock' onDoubleClick={doubleClick} onClick={handleClick} onMouseOver={dayHover} onMouseLeave={dayLeave}>
        <div className='weekBlockSelected' style={{display: selectedDisplay}}></div>
        <div id={day.id + 'hover'} className='weekHover'></div>
        <div className='weekBlockProgress' style={{width: progressPush}}></div>
        <div className='weekText'>
            <span className='weekDate'>{day.date}</span>
            {day.day}
            <span className='routineText'>
                {routineText}
            </span>
        </div>
    </div>
  )
}
