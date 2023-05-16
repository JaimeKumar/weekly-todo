import React from 'react'

export default function Todo({todo, toggleTodo, taskClick, taskDelete, removeTask, editTodo, editFinished}) {

    function handleTodoClick() {
      toggleTodo(todo.id)
    }

		function handleTaskGrab(e) {
      if (e.button == 0) {
        taskClick(e, todo.id);
      }
		}

    function handleRightClick(e) {
      taskDelete(todo.id);
    }

    function removeTaskCTP() {
      removeTask(todo.id);
    }

    function editTask() {
      editTodo(todo.id);
    }

    function finishEdit() {
      editFinished(todo.id);
    }

    let checkClass = 'checkmark';
    if (todo.complete) {
      checkClass = 'checkmark checked'
    }
    
  return (
    <div id={todo.id + 'task'} className='taskBox' onContextMenu={handleRightClick}>
      <div id={todo.id + 'main'} className='taskInner'>
        <span id={todo.id + 'checkmark'} className={checkClass} onClick={handleTodoClick}></span>
        <div id={todo.id + 'text'} className='taskText' onMouseDown={handleTaskGrab} onBlur={finishEdit}>
          {todo.txt}
        </div>
        <div className='taskBtn edit' onClick={editTask}>EDIT</div>
        <div className='taskBtn delete' onClick={removeTaskCTP}>DELETE</div>
      </div>
    </div>
  )
}
