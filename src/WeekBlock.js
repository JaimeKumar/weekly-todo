import React from 'react'


export default function WeekBlock({day, i, routineTask, dayClick, hoverTP, leaveTP, progress, routineClick}) {
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
    var weekBlockClass = 'weekBlock';

    var routineText = '';    
    var progressPush = '0%';
    var progDisplay = 'none';
    if (day.today === true) {
        routineText = routineTask;
        console.log(routineTask);
        progressPush = (100 -(progress * 100)) + '%';
        progDisplay = 'flex';
    }

    if (day.selected) {
        weekBlockClass += ' selected'
    } else if (i !== 6) {
        weekBlockClass += ' bordered'
    }

    return (
    <div id={day.id} className={weekBlockClass} onDoubleClick={doubleClick} onClick={handleClick} onMouseOver={dayHover} onMouseLeave={dayLeave}>
        <div id={day.id + 'hover'} className='weekHover'></div>
        <div className='weekBlockProgress' style={{right: progressPush, display: progDisplay}}></div>
        <div className='weekText'>
            <span className='weekDate'>{day.date}</span>
            <div className="weekDay">{day.day}</div>
            <span className='routineText'>
                {routineText}
            </span>
        </div>
    </div>
  )
}
