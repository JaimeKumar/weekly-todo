import React from 'react'

export default function DayTask({task, deleteDayTask, taskCheck, taskGrab, taskDrop}) {

    function handleRightClick() {
        document.getElementById(task.id + 'dayDelete').classList.toggle('removable');
    }

    function handleClick() {
        deleteDayTask(task.id);
    }

    function checkClick() {
        taskCheck(task.id);
    }

    function handleGrab(e) {
      if (e.button == 0) {
        taskGrab(e, task.id);
      }
    }

    function handleEdit() {

    }

    let checkClass = 'checkmark';
    if (task.complete) {
      checkClass = 'checkmark checked'
    }

  return (
    <div id={task.id + 'dayTask'} className='taskBox' onContextMenu={handleRightClick}>
      <div id={task.id + 'dayDelete'} className='taskInner'>
        <span id={task.id + 'dayCheck'} className={checkClass} onClick={checkClick}></span>
        <div className='taskText' onMouseDown={handleGrab}>
          {task.txt}
        </div>
        <div className='taskBtn edit' onClick={handleEdit}>EDIT</div>
        <div className='taskBtn delete' onClick={handleClick}>DELETE</div>
      </div>
    </div>
  )
}
