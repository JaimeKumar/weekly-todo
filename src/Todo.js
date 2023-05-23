import React from 'react'

export default function Todo({todo, type, toggleTodo, taskClick, rightClickTodo, removeTask, editTodo, editFinished}) {

    function handleTodoClick() {
      toggleTodo(todo.id)
    }

		function handleTaskGrab(e) {
      if (e.button === 0 || e.nativeEvent.type === 'touchstart') {
        taskClick(e, {type: type, id: todo.id});
      }
		}

    function handleRightClick(e) {
      rightClickTodo({type: type, id: todo.id});
    }

    function removeTaskCTP() {
      removeTask(todo.id);
    }

    function editTask() {
      editTodo({type: type, id: todo.id});
    }

    function finishEdit() {
      editFinished({type: type, id: todo.id});
    }

    let checkClass = 'checkmark';
    if (todo.complete) {
      checkClass = 'checkmark checked'
    }
    
  return (
    <div id={todo.id + type + 'task'} className='taskBox' onContextMenu={handleRightClick}>
      <div id={todo.id + type + 'main'} className='taskInner'>
        <span id={todo.id + checkClass} className={checkClass} onClick={handleTodoClick}></span>
        <div id={todo.id + type + 'text'} className='taskText' onMouseDown={handleTaskGrab} onTouchStart={handleTaskGrab} onBlur={finishEdit}>
          {todo.txt}
        </div>
        <div className='taskBtn edit' onClick={editTask}>EDIT</div>
        <div className='taskBtn delete' onClick={removeTaskCTP}>DELETE</div>
      </div>
    </div>
  )
}
