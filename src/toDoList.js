import React from 'react'
import Todo from './Todo'

export default function toDoList({ todos, toggleTodo, taskClick, taskDrop, taskDelete, removeTask }) {
  return (
    <div className='listBox'>
      {todos.map(todo => {
        if (todo) {
          return <Todo key={todo.id} toggleTodo={toggleTodo} todo={todo} taskClick={taskClick} taskDrop={taskDrop} taskDelete={taskDelete} removeTask={removeTask}/>
        }
      })}
    </div>
  )
}
