import React from 'react'

export default function Timenode({node, deleteNode, currentTask}) {

  function removeNode() {
    deleteNode(node.id)
  }
 
  let halfStyle = 'nodeHalf';
  let deleteStyle = 'nodeDelete';
  if (currentTask.id === node.id) {
    halfStyle += ' highlighted'
    deleteStyle += ' highlighted'
  }

  return (
    <div className='nodeContainer'>
      <div className={halfStyle} style={{width: '100px'}}>{node.time}</div>
      <div className={halfStyle}>{node.task}</div>
      <div className={deleteStyle} onClick={removeNode}>X</div>
    </div>
  )
}
