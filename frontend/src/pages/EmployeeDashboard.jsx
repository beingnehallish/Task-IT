import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Dashboard.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import io from 'socket.io-client';

Modal.setAppElement('#root');

// Connect Socket.IO
const socket = io('http://localhost:5000');

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [status, setStatus] = useState('');
  const [view, setView] = useState('myTasks');

  const [rooms, setRooms] = useState([
    { id: 'general', name: 'General Group' },
    { id: 'project-alpha', name: 'Project Alpha' },
    { id: 'team-sync', name: 'Team Sync' }
  ]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [alarmTime, setAlarmTime] = useState('09:00');

  const [currentTime, setCurrentTime] = useState(new Date());

  const chatEndRef = useRef(null);
  const audioRef = useRef(null);

  const employeeEmail = 'alice@taskit.com';

  useEffect(() => {
    fetchTasks();
    requestNotificationPermission();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    socket.emit('join_room', currentRoom);

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off('receive_message');
  }, [currentRoom]);

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

const fetchTasks = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/tasks/employee/${employeeEmail}`);
    console.log('Fetched tasks:', res.data);
    setTasks(res.data);
    const completed = res.data.filter(task => task.status === 'completed');
    console.log('Completed tasks:', completed);
    setCompletedTasks(completed);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};



  const openTaskModal = (task) => {
    setSelectedTask(task);
    setStatus(task.status);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  const updateStatus = async () => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/update-status/${selectedTask._id}`, { status });
      alert('Status updated successfully');
      fetchTasks();
      closeModal();
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const msgData = {
        room: currentRoom,
        sender: employeeEmail,
        text: newMessage,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('send_message', msgData);
      setMessages((prev) => [...prev, msgData]);
      setNewMessage('');
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleDateClick = (info) => {
    setEventDate(info.dateStr);
    setEventTitle('');
    setAlarmTime('09:00');
    setSelectedEvent(null);
  };

  const saveEvent = () => {
    if (eventTitle.trim() && eventDate) {
      const newEvent = {
        id: selectedEvent ? selectedEvent.id : Date.now(),
        title: eventTitle,
        date: eventDate,
        alarmTime
      };
      if (selectedEvent) {
        setEvents(events.map(e => e.id === selectedEvent.id ? newEvent : e));
      } else {
        setEvents([...events, newEvent]);
        scheduleAlarm(newEvent);
      }
      setEventTitle('');
      setEventDate('');
      setAlarmTime('09:00');
      setSelectedEvent(null);
    }
  };

  const handleEventClick = (clickInfo) => {
    const event = events.find(e => e.title === clickInfo.event.title && e.date === clickInfo.event.startStr);
    if (event) {
      setEventDate(event.date);
      setEventTitle(event.title);
      setAlarmTime(event.alarmTime || '09:00');
      setSelectedEvent(event);
    }
  };

  const deleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      setEventTitle('');
      setEventDate('');
      setAlarmTime('09:00');
      setSelectedEvent(null);
    }
  };

  const scheduleAlarm = (event) => {
    const alarmDateTime = new Date(`${event.date}T${event.alarmTime}:00`);
    const now = new Date();
    const diff = alarmDateTime.getTime() - now.getTime();

    if (diff > 0) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification(`Reminder: ${event.title} at ${event.alarmTime}`);
        }
        audioRef.current.play();
        alert(`Alarm: ${event.title} now!`);
      }, diff);
      alert(`Alarm set for ${event.title} at ${event.alarmTime}`);
    } else {
      alert('Alarm time already passed.');
    }
  };

  const tasksPendingOngoing = tasks.filter(t => t.status === 'pending' || t.status === 'ongoing').length;
  const eventsToday = events.filter(e => e.date === currentTime.toISOString().split('T')[0]);

  return (
    <div>
      <audio ref={audioRef} src="/alarm.mp3" preload="auto" />
      <nav className="navbar">
        <a href="#" onClick={() => setView('myTasks')}>My Tasks</a>
        <a href="#" onClick={() => setView('chats')}>Chats</a>
        <a href="#" onClick={() => setView('experience')}>Experience</a>
        <a href="#" onClick={() => setView('timetable')}>Calendar</a>
        <a href="/" onClick={() => window.location.href = '/'}>Logout</a>
      </nav>

      <div className="dashboard-content">
        {view === 'myTasks' && (
          <div>
            <div className="top-cards">
              <div className="card">
                <h4>Current Time</h4>
                <p>{currentTime.toLocaleTimeString()}</p>
                <p>{currentTime.toDateString()}</p>
              </div>
              <div className="card">
                <h4>Tasks Pending/Ongoing</h4>
                <p>{tasksPendingOngoing}</p>
              </div>
              <div className="card">
                <h4>Events Today</h4>
                {eventsToday.length === 0 ? <p>None</p> :
                  eventsToday.map(e => <p key={e.id}>{e.title} ({e.alarmTime})</p>)}
              </div>
            </div>

             <h2>My Tasks</h2>
    <div className="task-list">
      {tasks.length === 0 && <p>No tasks assigned.</p>}
      {tasks.filter(task => task.teammates.includes(employeeEmail)).map(task => (
  <div key={task._id} className="task-card" onClick={() => openTaskModal(task)}>
    <h3>{task.taskName}</h3>
    <p>Status: {task.status}</p>
    <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
  </div>
))}

    </div>
          </div>
        )}

        {view === 'chats' && (
          <div className="chat-container">
            <div className="chat-sidebar">
              <input type="text" placeholder="Search chats..." className="search-input" />
              {rooms.map(room => (
                <div
                  key={room.id}
                  className={`chat-room ${currentRoom === room.id ? 'active' : ''}`}
                  onClick={() => setCurrentRoom(room.id)}
                >
                  {room.name}
                </div>
              ))}
            </div>

            <div className="chat-main">
              <div className="chat-header">
                {rooms.find(r => r.id === currentRoom)?.name}
              </div>

              <div className="chat-box whatsapp-style">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`chat-bubble ${msg.sender === employeeEmail ? 'sent' : 'received'}`}>
                    <span>{msg.text}</span>
                    <small>{msg.time}</small>
                  </div>
                ))}
                <div ref={chatEndRef}></div>
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          </div>
        )}

        {view === 'experience' && (
          <div>
            <h2>Experience (Completed Tasks)</h2>
            <div className="task-list">
              {completedTasks.map(task => (
                <div key={task._id} className="task-card" onClick={() => openTaskModal(task)}>
                  <h3>{task.taskName}</h3>
                  <p>Completed on: {new Date(task.deadline).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'timetable' && (
          <div>
            <h2>Calendar</h2>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              dateClick={handleDateClick}
              events={events}
              eventClick={handleEventClick}
            />

            {eventDate && (
              <div className="event-form">
                <h3>{selectedEvent ? 'Edit Event' : 'Add Event'}</h3>
                <p>Date: {eventDate}</p>
                <input
                  type="text"
                  placeholder="Event Title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
                <input
                  type="time"
                  value={alarmTime}
                  onChange={(e) => setAlarmTime(e.target.value)}
                />
                <button onClick={saveEvent}>{selectedEvent ? 'Save Changes' : 'Add Event'}</button>
                {selectedEvent && <button onClick={deleteEvent}>Delete</button>}
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={selectedTask !== null}
        onRequestClose={closeModal}
        contentLabel="Task Details"
        className="modal"
        overlayClassName="overlay"
      >
        {selectedTask && (
          <div>
            <h2>{selectedTask.taskName}</h2>
            <p><strong>Team Lead:</strong> {selectedTask.teamLead}</p>
            <p><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleDateString()}</p>
            <p><strong>Task Details:</strong> {selectedTask.taskDetails}</p>
            <p><strong>Teammates:</strong> {selectedTask.teammates.join(', ')}</p>

            <div className="status-update">
              <label htmlFor="status">Update Status: </label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
              <button onClick={updateStatus}>Save</button>
            </div>

            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;
