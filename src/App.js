import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import WeekBlock from './WeekBlock';
import Todo from './Todo';
import DayTask from './DayTask';
import Timenode from './Timenode';

function App() {

  let d = new Date();
  let currentDay = d.getDay();
  let currentTime = (d.getHours() * 60) + d.getMinutes();
  
  const [dayProgress, setDayProgress] = useState(currentTime/1440);

  const [allRoutine, setRoutine] = useState([{time: '09:00', timeVal: 900, task: 'Wake Up', id: uuidv4()}, {time: '21:00', timeVal: 2100, task: 'Clock Off', id: uuidv4()}]) 

  const [sevenDays, setDays] = useState([
    {day: dayWrap(0), today: true, selected: true, date: dateWrap(0), id: uuidv4()}, 
    {day: dayWrap(1), today: false, selected: false, date: dateWrap(1), id: uuidv4()},
    {day: dayWrap(2), today: false, selected: false, date: dateWrap(2), id: uuidv4()}, 
    {day: dayWrap(3), today: false, selected: false, date: dateWrap(3), id: uuidv4()},
    {day: dayWrap(4), today: false, selected: false, date: dateWrap(4), id: uuidv4()},
    {day: dayWrap(5), today: false, selected: false, date: dateWrap(5), id: uuidv4()},
    {day: dayWrap(6), today: false, selected: false, date: dateWrap(6), id: uuidv4()}
  ]);
  
  var taskGrabbed;
  var dayGrabbed;
  var dayTaskGrabbed;
  
  const [todos, setTodos] = useState([]);
  const [daySelected, setDaySelected] = useState(sevenDays[0]);
  const [dayTasks, setDayTasks] = useState([...todos.filter(todo => todo.date===daySelected.date)]);
  const todoTxtRef = useRef();
  const dayTextRef = useRef();
  const newNodeRef = useRef();
  
  const [currentTask, setTask] = useState({task: ''});
  const [triggerTodoSave, triggerSave] = useState(uuidv4());

  // clock
  useEffect(() => {
    setInterval(() => {
      d = new Date();
      setDayProgress(((d.getHours() * 60) + d.getMinutes())/1440);
    }, 1000);
  }, [])
  
  // update current routine position
  useEffect(() => {
    let minutes = d.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    let realTimeVal = Number(d.getHours() + minutes);
      let tempCurrentTask = ''
      for (var j = allRoutine.length - 1; j >= 0; j--) {
        if (realTimeVal >= allRoutine[j].timeVal) {
          tempCurrentTask = allRoutine[j];
          break;
        }
      }
      if (tempCurrentTask !== currentTask) {
        setTask(tempCurrentTask)
        document.querySelector('.routineText').classList.add('pulseText')
        setTimeout(() => {
          document.querySelector('.routineText').classList.remove('pulseText')
        }, 5005);
      }
  }, [dayProgress, allRoutine])
  
  // load All tasks
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todoApp.todos'));
    if (storedTodos) setTodos(storedTodos);
  }, [])
  
  // load allRoutine
  useEffect(() => {
    const storedRoutine = JSON.parse(localStorage.getItem('todoApp.routine'));
    if (storedRoutine) setRoutine(storedRoutine);
  }, [])
  
  // save all tasks
  useEffect(() => {
    localStorage.setItem('todoApp.todos', JSON.stringify(todos));
    setDayTasks(todos.filter(todo => todo.date===daySelected.date));
  }, [todos, triggerTodoSave])
  
  // save allRoutine
  useEffect(() => {
    localStorage.setItem('todoApp.routine', JSON.stringify(allRoutine))
  }, [allRoutine])

  function dayWrap(i) {
    let weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    let dayIndex = currentDay + (i - 1);
    if (dayIndex > 6) {
      dayIndex = dayIndex - 7;
    }
    return weekDays[dayIndex];
  }

  function dateWrap(i) {
    let months = [{mon: 'JAN', length: 31}, {mon: 'FEB', length: 28}, {mon: 'MAR', length: 31}, {mon: 'APR', length: 30}, {mon: 'MAY', length: 31}, {mon: 'JUN', length: 30}, {mon: 'JUL', length: 31}, {mon: 'AUG', length: 31}, {mon: 'SEP', length: 30}, {mon: 'OCT', length: 31}, {mon: 'NOV', length: 30}, {mon: 'DEC', length: 31}];
    let thisDate = d.getDate() + i;
    let thisMonth = months[d.getMonth()].mon;
    if (thisDate > months[d.getMonth()].length) {
      thisDate = thisDate - months[d.getMonth()].length;
      thisMonth = months[d.getMonth() + 1].mon;
    }
    return thisDate + ' ' + thisMonth;
  }

  function toggleTodo(id) {
    var newTodos = [...todos];
    var newDayTasks = [...dayTasks];
    var isAllTask = newTodos.find(todo => todo.id === id);
    var isDayTask = dayTasks.find(task => task.id === id);
    if (isAllTask) {
      const todo = newTodos.find(todo => todo.id === id);
      todo.complete = !todo.complete
      let oldIndex = newTodos.indexOf(newTodos.find(todo => todo.id === id));
      if (oldIndex < (newTodos.length - 1)) {
        newTodos.splice(oldIndex, 1);
        newTodos.push(todo);
      }
      setTodos(newTodos)
    } 
    
    if (isDayTask) {
      const newDayTask = newDayTasks.find(todo => todo.id === id);
      newDayTask.complete = !newDayTask.complete;
      let oldIndex = newDayTasks.indexOf(newDayTasks.find(todo => todo.id === id));
      if (oldIndex < (newDayTasks.length - 1)) {
        newDayTasks.splice(oldIndex, 1);
        newDayTasks.push(newDayTask);
      }

      sevenDays.find(day => day.id === daySelected.id).tasks = [...newDayTasks];
      setDayTasks(newDayTasks)
    }

    if (document.getElementById(id + 'checkmark')) {
      document.getElementById(id + 'checkmark').classList.toggle('checked');
    }

    if (document.getElementById(id + 'dayCheck')) {
      document.getElementById(id + 'dayCheck').classList.toggle('checked');
    }
  }
  
  function addTodo() {
    var data = todoTxtRef.current.value;
    setTodos(prevTodos => {
      return [...prevTodos, {id: uuidv4(), txt: data, complete: false}]
    })
    todoTxtRef.current.value = null;
  }

  function moveTodo(task) {
    if (!todos.find(day => day.id === task.id)) {
      setTodos(prevTodos => {
        return [...prevTodos, task]
      })
    }
  }

  function addDayTask() {
    var data = dayTextRef.current.value;
    setTodos(prevTodos => {
      return [...prevTodos, {id: uuidv4(), txt: data, complete: false, date: daySelected.date}]
    })
    dayTextRef.current.value = null;
  }

  function handleKey(e) {
    if (e.key === 'Enter') {
      addTodo();
    }
  }

  function handleDayKey(e) {
    if (e.key === 'Enter') {
      addDayTask();
    }
  }

  function taskClick(e, id) {
    taskGrabbed = id;
    if (id) {
      document.getElementById(id + 'task').classList.add('floating');
      document.getElementById(taskGrabbed + 'task').style.left = e.clientX - 100 + 'px';
      document.getElementById(taskGrabbed + 'task').style.top = e.clientY - 225 + 'px';
    }
  }
  
  function handleMouseMove(e) {
    if (taskGrabbed) {
      document.getElementById(taskGrabbed + 'task').style.left = e.clientX - 100 + 'px';
      document.getElementById(taskGrabbed + 'task').style.top = e.clientY - 225 + 'px';
    } else if (dayTaskGrabbed) {
      document.getElementById(dayTaskGrabbed + 'dayTask').style.left = e.clientX - 1250 + 'px';
      document.getElementById(dayTaskGrabbed + 'dayTask').style.top = e.clientY - 230 + 'px';
    }
  }
  
  function taskDrop() {
    if (taskGrabbed) {
      if (dayGrabbed) {
        todos.find(task => task.id===taskGrabbed).date = sevenDays.find(day => day.id===dayGrabbed).date;
        triggerSave(uuidv4());
        if (dayGrabbed === daySelected.id) {
          setDayTasks([...todos.filter(todo => todo.date===daySelected.date)])
        }
        document.getElementById(dayGrabbed + 'hover').classList.remove('hovered');
      } 
      document.getElementById(taskGrabbed + 'task').classList.remove('floating');
      document.getElementById(taskGrabbed + 'task').style.left = 'auto';
      document.getElementById(taskGrabbed + 'task').style.top = 'auto';
    } else if (dayTaskGrabbed) {
      if (dayGrabbed) {
        todos.find(todo => todo.id===dayTaskGrabbed).date = sevenDays.find(day=>day.id===dayGrabbed).date;
        triggerSave(uuidv4());
        setDayTasks([...todos.filter(todo => todo.date===daySelected.date)])
        document.getElementById(dayGrabbed + 'hover').classList.remove('hovered');
      }
      document.getElementById(dayTaskGrabbed + 'dayTask').classList.remove('floating');
      dayTaskGrabbed = null;
    }

    dayGrabbed = null;
    taskGrabbed = null;
  }

  function dayClick(day) {
    if (day !== daySelected) {
      sevenDays.forEach((thisDay) => {
        if (thisDay) {
          thisDay.selected = false;
        }
      })

      day.selected = true;

      setDaySelected(day);
      
      setDayTasks([...todos.filter(todo => todo.date===day.date)]);
    }
  }

  function hoverTP(id) {
    dayGrabbed = id;
    if (taskGrabbed || dayTaskGrabbed) {
      document.getElementById(id + 'hover').classList.add('hovered');
    }
  }
  
  function leaveTP(id) {
    dayGrabbed = null;
    if (taskGrabbed || dayTaskGrabbed) {
      document.getElementById(id + 'hover').classList.remove('hovered');
    }
  }

  function handleRightClick(e) {
    e.preventDefault();
  }

  function taskDelete(id) {
    document.getElementById(id + 'main').classList.toggle('removable');
  }

  function removeTask(id) {
    todos.splice(todos.indexOf(todos.find(todo => todo.id === id)), 1);
    setTodos([...todos])
  }

  function removeTaskFromDay(id) {
    if (todos.find(todo => todo.id===id)) {
      todos.find(todo => todo.id===id).date = null;
    }
    setDayTasks([...todos.filter(task => task.date===daySelected.date)])
  }

  function taskCheck(id) {
    toggleTodo(id)
  }

  function editTask(id) {
    document.getElementById(id + 'main').classList.toggle('removable');
    document.getElementById(id + 'text').contentEditable = true;
    document.getElementById(id + 'text').focus();
  }

  function finishEdit(id) {
    document.getElementById(id + 'text').contentEditable = false;
    let prevTodos = [...todos];
    prevTodos.find(todo => todo.id===id).txt = document.getElementById(id + 'text').innerHTML;
    setTodos(prevTodos);
  }

  function routineClick() {
    document.getElementById('tasks').classList.toggle('hide');
    document.getElementById('routine').classList.toggle('hide');
  }

  function dayTaskGrab(e, id) {
    dayTaskGrabbed = id;
    if (id) {
      document.getElementById(id + 'dayTask').classList.add('floating');
      document.getElementById(id + 'dayTask').style.left = e.clientX - 1250 + 'px';
      document.getElementById(id + 'dayTask').style.top = e.clientY - 230 + 'px';
    }
  }

  function deleteNode(id) {
    let newRoutine = [...allRoutine];
    let nodeIndex = newRoutine.indexOf(newRoutine.find(node => node.id===id));
    newRoutine.splice(nodeIndex, 1);
    setRoutine(newRoutine)
  }

  function newNode() {
    let nodeText = newNodeRef.current.value;
    let nodeHour = document.getElementById('hourSelect').value;
    let nodeMin = document.getElementById('minSelect').value;
    let nodeTime = Number(nodeHour + nodeMin);


    let prevNodes = [...allRoutine];
    prevNodes.push({time: nodeHour + ':' + nodeMin, timeVal: nodeTime, task: nodeText, id: uuidv4()});
    prevNodes = prevNodes.sort((a, b) => a.timeVal - b.timeVal);

    setRoutine(prevNodes);
    newNodeRef.current.value = null;
  }

  useEffect(() => {
    document.getElementById('hourSelect').addEventListener('wheel', function(e) {
      if (this.hasFocus) {
          return;
      }
      if (e.deltaY < 0) {
          this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      }
      if (e.deltaY > 0) {
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.length - 1);
      }
    })

    document.getElementById('minSelect').addEventListener('wheel', function(e) {
      if (this.hasFocus) {
          return;
      }
      if (e.deltaY < 0) {
          this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      }
      if (e.deltaY > 0) {
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.length - 1);
      }
    });
  }, [])

  return (
    <div className="mainContainer" onMouseMove={handleMouseMove} onMouseUp={taskDrop} onMouseLeave={taskDrop} onContextMenu={handleRightClick}>
      <div className="weekBarContainer">
        {/* <ScrollButton direction='«'/> */}
        <div className="weekBar">
            {sevenDays.map(day => {
                return <WeekBlock key={day.id} day={day} routineTask={currentTask.task} dayClick={dayClick} hoverTP={hoverTP} leaveTP={leaveTP} progress={dayProgress} routineClick={routineClick}/>
            })}
        </div>
        {/* <ScrollButton direction='»'/> */}
      </div>
      <div className="bottomHalf">
        <div id='tasksMain' className="taskListContainer">
          <div id='tasks' className="taskListInner">
            <div className="titleBlock">
              Tasks
            </div>
            <div className='listBox'>
              {todos.map(todo => {
                if (todo) {
                  return <Todo key={todo.id} toggleTodo={toggleTodo} todo={todo} taskClick={taskClick} taskDelete={taskDelete} removeTask={removeTask} editTodo={editTask} editFinished={finishEdit}/>
                } else {
                  return null;
                }
              })}
            </div>
            <div className="taskInput">
              <input ref={todoTxtRef} onKeyDown={handleKey} type="text"/>
            </div>
          </div>

          <div id='routine' className="taskListInner hide">
            <div className="routineContainer">
              <div className="titleBlock" style={{top: '0px', position: 'absolute'}}>
                Routine
              </div>
              <div className="routineHalf" style={{height: '25%'}}>
                <div className="timeSelect">
                  <div className="custom-select">
                    <select id='hourSelect' defaultValue={'09'}>
                      <option value="00">00</option>
                      <option value="01">01</option>
                      <option value="02">02</option>
                      <option value="03">03</option>
                      <option value="04">04</option>
                      <option value="05">05</option>
                      <option value="06">06</option>
                      <option value="07">07</option>
                      <option value="08">08</option>
                      <option value="09">09</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="13">13</option>
                      <option value="14">14</option>
                      <option value="15">15</option>
                      <option value="16">16</option>
                      <option value="17">17</option>
                      <option value="18">18</option>
                      <option value="19">19</option>
                      <option value="20">20</option>
                      <option value="21">21</option>
                      <option value="22">22</option>
                      <option value="23">23</option>
                      <option value="24">24</option>
                    </select>
                  </div>
                  <div className="custom-select">
                    <select id='minSelect'>
                      <option value="00">00</option>
                      <option value="05">05</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="25">25</option>
                      <option value="30">30</option>
                      <option value="35">35</option>
                      <option value="40">40</option>
                      <option value="45">45</option>
                      <option value="50">50</option>
                      <option value="55">55</option>
                    </select>
                  </div>
                </div>
                <input ref={newNodeRef} type="text"/>
                <div className='newNodeBtn' onClick={newNode}>Add Node</div>
              </div>
              <div className="routineHalf">
                <div className="nodeList">
                  {allRoutine.map(node => {
                    return <Timenode key={node.id} node={node} deleteNode={deleteNode} currentTask={currentTask}/>
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="stepsContainer">
          <div className="stepListInner">
            <div className="titleBlock">
              {daySelected.day}
            </div>
            <div className="listBox">
              {dayTasks.map(task => {
                return <DayTask key={task.id} task={task} deleteDayTask={removeTaskFromDay} taskCheck={taskCheck} taskGrab={dayTaskGrab}/>
              })}
            </div>
            <div className="taskInput">
              <input ref={dayTextRef} onKeyDown={handleDayKey} type="text"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;