import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';

const SupervisorDashboard = () => {
  const [view, setView] = useState('addTask');
  const [taskData, setTaskData] = useState({
    taskName: '',
    taskDetails: '',
    deadline: '',
    teamLead: '',
    teammates: []
  });
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchStatus, setSearchStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('nearest');

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/employees');
      setEmployees(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleAddTeammate = (email) => {
    if (!taskData.teammates.includes(email)) {
      setTaskData({ ...taskData, teammates: [...taskData.teammates, email] });
    }
  };
const handleRemoveTeammate = (email) => {
  setTaskData({
    ...taskData,
    teammates: taskData.teammates.filter(teammate => teammate !== email)
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks/create', taskData);
      alert('Task created successfully');
      setTaskData({
        taskName: '',
        taskDetails: '',
        deadline: '',
        teamLead: '',
        teammates: []
      });
      fetchTasks(); // refresh task list after creation
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  // Filtered and sorted tasks
  const filteredTasks = tasks
    .filter(task =>
      searchStatus === '' || task.status.toLowerCase() === searchStatus.toLowerCase()
    )
    .sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return sortOrder === 'nearest' ? dateA - dateB : dateB - dateA;
    });
// Calculate efficiency for Progress Report
  const calculateEfficiency = (email) => {
    const employeeTasks = tasks.filter(task =>
      task.teammates.includes(email)
    );
    const completed = employeeTasks.filter(task => task.status === 'completed').length;
    const efficiency = employeeTasks.length > 0 ? (completed / employeeTasks.length) * 100 : 0;
    return efficiency.toFixed(1);
  };

  const renderProgressReport = () => {
    return (
      <div>
        <h2>Progress Report</h2>
        <div className="progress-report">
          {employees.map(emp => {
            const efficiency = calculateEfficiency(emp.email);
            return (
              <div key={emp._id} className="employee-progress-card">
                <h3>{emp.name}</h3>
                <p>{emp.email}</p>
                <div className="progress-meter">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${efficiency}%`,
                      backgroundColor:
                        efficiency >= 80 ? '#4caf50' :
                        efficiency >= 50 ? '#ff9800' : '#f44336'
                    }}
                  >
                    {efficiency}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (view === 'addTask') {
      return (
        <div className="add-task-container">
          <form className="add-task-form" onSubmit={handleSubmit}>
            <h2>Add Task</h2>
            <label>Task Name:</label>
            <input
              type="text"
              name="taskName"
              value={taskData.taskName}
              onChange={handleInputChange}
              required
            />

            <label>Task Details:</label>
            <textarea
              name="taskDetails"
              value={taskData.taskDetails}
              onChange={handleInputChange}
              required
            />

            <label>Deadline:</label>
            <input
              type="date"
              name="deadline"
              value={taskData.deadline}
              onChange={handleInputChange}
              required
            />

            <label>Team Lead Email:</label>
            <input
              type="email"
              name="teamLead"
              value={taskData.teamLead}
              onChange={handleInputChange}
              required
            />

            <label>Teammates:</label>
            <input
              type="text"
              value={taskData.teammates.join(', ')}
              readOnly
            />

            <button type="submit">Create Task</button>
          </form>

          <div className="employee-list">
            <h3>Employees</h3>
            {employees.map(emp => (
              <div key={emp._id} className="employee-card">
                <p>{emp.name}</p>
                <div className="email-copy">
                  <span>{emp.email}</span>
                  <button onClick={() => copyToClipboard(emp.email)}>📋</button>
                  <button onClick={() => handleAddTeammate(emp.email)}>Add</button>
                  {taskData.teammates.includes(emp.email) && (
      <button onClick={() => handleRemoveTeammate(emp.email)}>Remove</button>
    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (view === 'allTasks') {
      return (
        <div>
          <h2>All Tasks</h2>

          <div className="filters">
            <label>Filter by Status:</label>
            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>

            <label>Sort by Deadline:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="nearest">Nearest First</option>
              <option value="latest">Latest First</option>
            </select>
          </div>

          <div className="task-list">
            {filteredTasks.length === 0 && <p>No tasks found.</p>}
            {filteredTasks.map(task => (
              <div key={task._id} className="task-card">
                <h3>{task.taskName}</h3>
                <p>Status: {task.status}</p>
                <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                <p>Team Lead: {task.teamLead}</p>
                <p>Teammates: {task.teammates.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
 if (view === 'progressReport') {
      return renderProgressReport();
    }
    return null;
  };

  return (
    <div>
      <nav className="navbar">
        <a href="#" className={view === 'addTask' ? 'active' : ''} onClick={() => setView('addTask')}>Add Task</a>
        <a href="#" className={view === 'allTasks' ? 'active' : ''} onClick={() => setView('allTasks')}>All Tasks</a>
        <a href="#" className={view === 'progressReport' ? 'active' : ''} onClick={() => setView('progressReport')}>Progress Report</a>
        <a href="/" onClick={() => window.location.href = '/'}>Logout</a>
       </nav>

      <div className="dashboard-content">{renderContent()}</div>
    </div>
  );
};

export default SupervisorDashboard;
