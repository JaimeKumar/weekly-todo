import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import WeekBlock from './WeekBlock';
import Todo from './Todo';
import Timenode from './Timenode';
import $ from 'jquery';

function App() {

  let d = new Date();
  let currentDay = d.getDay();
  let currentTime = (d.getHours() * 60) + d.getMinutes();
  
  const [dayProgress, setDayProgress] = useState(currentTime/1440);

  const [allRoutine, setRoutine] = useState([
    {time: '09:00', timeVal: 900, task: 'Wake Up', id: uuidv4()},
    {time: '09:30', timeVal: 900, task: 'Work out', id: uuidv4()},
    {time: '10:00', timeVal: 1000, task: 'Eat', id: uuidv4()},
    {time: '10:20', timeVal: 1020, task: 'Shower', id: uuidv4()},
    {time: '10:40', timeVal: 1020, task: 'Coffee', id: uuidv4()},
    {time: '11:00', timeVal: 1100, task: 'Work', id: uuidv4()},
    {time: '13:30', timeVal: 1330, task: 'Lunch', id: uuidv4()},
    {time: '14:00', timeVal: 1400, task: 'walk', id: uuidv4()},
    {time: '15:00', timeVal: 1500, task: 'work', id: uuidv4()},
    {time: '18:30', timeVal: 1830, task: 'Dinner', id: uuidv4()},
    {time: '19:15', timeVal: 1915, task: 'Work', id: uuidv4()},
    {time: '21:00', timeVal: 2100, task: 'Clock Off', id: uuidv4()}]) 

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
  const [currentTask, setTask] = useState({task: ''});
  const todoTxtRef = useRef();
  const dayTextRef = useRef();
  const newNodeRef = useRef();
  const lastPos = useRef();
  
  // load tasks & routine, init currentRoutineTask, eventlisteners & clock
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todoApp.todos'));
    if (storedTodos) setTodos(storedTodos);

    const storedRoutine = JSON.parse(localStorage.getItem('todoApp.routine'));
    // if (storedRoutine) setRoutine(storedRoutine);

    $('#hourSelect').on('wheel', function(e) {
      if (this.hasFocus) {
        return;
      }
      if (e.originalEvent.deltaY < 0) {
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      }
      if (e.originalEvent.deltaY > 0) {
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.length - 1);
      }
    })

    $('#minSelect').on('wheel', function(e) {
      if (this.hasFocus) {
          return;
      }
      if (e.originalEvent.deltaY < 0) {
          this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      }
      if (e.originalEvent.deltaY > 0) {
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.length - 1);
      }
    });

    $(window).on('resize', resize);

    setInterval(() => {
      d = new Date();
      setDayProgress(((d.getHours() * 60) + d.getMinutes())/1440);
    }, 1000);

    resize();
  }, [])

  function resize() {
    $('#root').css({height: window.innerHeight + 'px'});
  }
  
  // update current routine position
  useEffect(() => {
    updateCurrentRoutineTask();
  }, [dayProgress])
  
  // save all tasks
  useEffect(() => {
    localStorage.setItem('todoApp.todos', JSON.stringify(todos));
    setDayTasks(todos.filter(todo => todo.date===daySelected.date));
  }, [todos])
  
  // save allRoutine
  useEffect(() => {
    localStorage.setItem('todoApp.routine', JSON.stringify(allRoutine));
    updateCurrentRoutineTask();
  }, [allRoutine])

  function updateCurrentRoutineTask() {
    let minutes = d.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    let realTimeVal = Number('' + d.getHours() + minutes);
    let tempCurrentTask = ''
    for (var j = allRoutine.length - 1; j >= 0; j--) {
      if (realTimeVal >= allRoutine[j].timeVal) {
        tempCurrentTask = allRoutine[j];
        break;
      }
    }
    if (tempCurrentTask !== currentTask) {
      setTask(tempCurrentTask)
      $('.routineText').addClass('pulseText')
      setTimeout(() => {
        $('.routineText').removeClass('pulseText')
      }, 5005);
    }
  }

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

    let clickedTodo = newTodos.indexOf(newTodos.find(todo => todo.id===id));
    if (clickedTodo >= 0) {
      newTodos[clickedTodo].complete = !newTodos[clickedTodo].complete;
    }

    setTodos(newTodos)
  }
  
  function addTodo() {
    var data = todoTxtRef.current.value;
    setTodos(prevTodos => {
      return [...prevTodos, {id: uuidv4(), txt: data, complete: false}]
    })
    todoTxtRef.current.value = null;
  }

  function addDayTask() {
    var data = dayTextRef.current.value;
    setTodos(prevTodos => {
      return [...prevTodos, {id: uuidv4(), txt: data, complete: false, date: daySelected.date, hide: true}]
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

  function checkRect(type) {
    let returnID = null;
    sevenDays.forEach(day => {
      let pos = {
        x: $('#' + day.id).position().left,
        y: $('#' + day.id).position().top,
        x2: $('#' + day.id).position().left + $('#' + day.id).width(),
        y2: $('#' + day.id).position().top + $('#' + day.id).height()
      }
      let touch = lastPos.current;
      if (touch.x > pos.x && touch.x < pos.x2 && touch.y > pos.y && touch.y < pos.y2) {
        returnID = day.id;
        if (type==='hover') $('#' + day.id).addClass('hovered')
      } else {
        if (type==='hover') $('#' + day.id).removeClass('hovered')
      }
      if (type==='drop') $('#' + day.id).removeClass('hovered')
    })
    return returnID;
  }

  function endTouch() {
    if (taskGrabbed) {
      dayGrabbed = checkRect('drop');
      taskDrop();
    }
  }

  function taskClick(e, args) {
    taskGrabbed = args;
    let x, y = 0;
    if(e.type == 'touchstart'){
      let evt = e;
      if (typeof e.touches === 'undefined') evt = e.originalEvent;
      var touch = evt.touches[0] || evt.changedTouches[0];
      x = touch.pageX;
      y = touch.pageY;
      lastPos.current = {x: x, y: y};
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    if (args.id) {
      $('#' + args.id + args.type + 'task').addClass('floating');
      $('.taskGrab').addClass('grab')
      $('.taskGrab').css({left: x - 14 + 'px', top: y + 'px'})
    }
  }
  
  function handleMouseMove(e) {
    if (!taskGrabbed) return;
    let x, y = 0;
    if(e.type === 'touchmove'){
      let evt = e;
      if (typeof e.touches === 'undefined') evt = e.originalEvent;
      var touch = evt.touches[0] || evt.changedTouches[0];
      x = touch.pageX;
      y = touch.pageY;
      lastPos.current = {x: x, y: y};
      checkRect('hover');
    } else if (e.type === 'mousemove') {
      x = e.clientX;
      y = e.clientY;
    }
    $('.taskGrab').css({left: x - 14 + 'px', top: y + 'px'})
  }
  
  function taskDrop(e) {
    if (taskGrabbed) {
      if (dayGrabbed) {
        let copyTodos = [...todos]
        copyTodos.find(task => task.id===taskGrabbed.id).date = sevenDays.find(day => day.id===dayGrabbed).date;
        setTodos(copyTodos)
      }
      $('#' + taskGrabbed.id + taskGrabbed.type + 'task').removeClass('floating');
    }
    
    $('.taskGrab').removeClass('grab')
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
      $('#' + id + 'hover').addClass('hovered');
    }
  }
  
  function leaveTP(id) {
    dayGrabbed = null;
    if (taskGrabbed || dayTaskGrabbed) {
      $('#' + id + 'hover').removeClass('hovered');
    }
  }

  function handleRightClick(e) {
    e.preventDefault();
  }

  function todoRightClick(args) {
    $('#' + args.id + args.type + 'main').toggleClass('removable');
  }

  function removeTask(id) {
    let copyTasks = [...todos];
    let thisTask = copyTasks.find(todo => todo.id === id);
    if (thisTask.hasOwnProperty('date')) {
      thisTask.hide = true;
    } else {
      copyTasks.splice(copyTasks.indexOf(thisTask), 1);
    }
    setTodos([...copyTasks])
  }

  function removeTaskFromDay(id) {
    let copyTasks = [...todos];
    let thisTask = copyTasks.find(todo => todo.id === id);
    if (thisTask.hide) {
      copyTasks.splice(copyTasks.indexOf(thisTask), 1);
    } else {
      thisTask.date = null;
    }
    setTodos(copyTasks)
  }

  function editTask(args) {
    $('#' + args.id + args.type + 'main').toggleClass('removable');
    $('#' + args.id + args.type + 'text').attr('contentEditable', 'true');
    $('#' + args.id + args.type + 'text').trigger('focus');
  }

  function finishEdit(args) {
    $('#' + args.id + args.type + 'text').attr('contentEditable', 'false');
    let prevTodos = [...todos];
    prevTodos.find(todo => todo.id===args.id).txt = $('#' + args.id + args.type + 'text').html();
    setTodos(prevTodos);
  }

  function routineClick() {
    $('#' + 'tasks').toggleClass('hide');
    $('#' + 'routine').toggleClass('hide');
  }

  function deleteNode(id) {
    let newRoutine = [...allRoutine];
    let nodeIndex = newRoutine.indexOf(newRoutine.find(node => node.id===id));
    newRoutine.splice(nodeIndex, 1);
    setRoutine(newRoutine)
  }

  function newNode() {
    let nodeText = newNodeRef.current.value;
    let nodeHour = $('#hourSelect').val();
    let nodeMin = $('#minSelect').val();
    let nodeTime = Number(nodeHour + nodeMin);


    let prevNodes = [...allRoutine];
    prevNodes.push({time: nodeHour + ':' + nodeMin, timeVal: nodeTime, task: nodeText, id: uuidv4()});
    prevNodes = prevNodes.sort((a, b) => a.timeVal - b.timeVal);

    setRoutine(prevNodes);
    newNodeRef.current.value = null;
  }

  return (
    <div className="mainContainer" onMouseMove={handleMouseMove} onTouchMove={handleMouseMove} onTouchEnd={endTouch} onMouseUp={taskDrop} onMouseLeave={taskDrop} onContextMenu={handleRightClick}>
      <div className="weekBarContainer">
        <div className="weekBar">
            {sevenDays.map((day, i) => {
                return <WeekBlock key={day.id} day={day} i={i} routineTask={currentTask.task} dayClick={dayClick} hoverTP={hoverTP} leaveTP={leaveTP} progress={dayProgress} routineClick={routineClick} />
            })}
        </div>
      </div>
      <div className="bottomHalf">
        <div id='tasksMain' className="taskListContainer">
          <div id='tasks' className="taskListInner">
            <div className="titleBlock">
              Tasks
            </div>
            <div className='listBox'>
              {todos.map(todo => {
                if (!todo.hide) {
                  return <Todo key={todo.id} type='todo' toggleTodo={toggleTodo} todo={todo} taskClick={taskClick} rightClickTodo={todoRightClick} removeTask={removeTask} editTodo={editTask} editFinished={finishEdit}/>
                } else {
                  return null;
                }
              })}
            </div>
            <div className="taskInput">
              <input ref={todoTxtRef} onKeyDown={handleKey} type="text" placeholder="Enter a task..." />
            </div>
          </div>

          <div id='routine' className="taskListInner hide">
              <div className="titleBlock">
                Routine
              </div>
            <div className="routineContainer">
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
                <input ref={newNodeRef} type="text" placeholder="Enter an activity..." />
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
                return <Todo key={task.id} type='dayTask' toggleTodo={toggleTodo} todo={task} taskClick={taskClick} rightClickTodo={todoRightClick} removeTask={removeTaskFromDay} editTodo={editTask} editFinished={finishEdit}/>
              })}
            </div>
            <div className="taskInput">
              <input ref={dayTextRef} onKeyDown={handleDayKey} type="text" placeholder="Enter a task..." />
            </div>
          </div>
        </div>
      </div>

      <div className="taskGrab"></div>
    </div>
  )
}

export default App;