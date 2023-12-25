import React, { useEffect, useState } from 'react';
import { Typography, Container, Card, Stack, Button, Dialog, DialogTitle,Checkbox, DialogContent,Box, TextField,CircularProgress,Badge } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { store } from './../store/store';
import { useDispatch } from 'react-redux';
import { changeTaskStatus } from './../store/tasksSlice';
interface Task {
  id: number;
  title: string;
  priority: string;
  status: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [newTask, setNewTask] = useState<Task>({ id: 0, title: '', priority: '', status: 'To Do' });
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:4000/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const fetchedTasks: Task[] = await response.json();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = (taskId: number) => {
    try {
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          let updatedStatus = '';
  
          switch (task.status) {
            case 'To Do':
              updatedStatus = 'In Progress';
              break;
            case 'In Progress':
              updatedStatus = 'Done';
              break;
            case 'Done':
              updatedStatus = 'To Do';
              break;
            default:
              break;
          }
  
          dispatch(changeTaskStatus(taskId, updatedStatus));
          return { ...task, status: updatedStatus }; 
        }
        return task;
      });
  
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  
  

  const getProgress = (status: string): number => {
    switch (status) {
      case 'To Do':
        return 0;
      case 'In Progress':
        return 50;
      case 'Done':
        return 100;
      default:
        return 0;
    }
  };
  const [selectedPriority, setSelectedPriority] = useState('High'); 

  const priorities = ['High', 'Medium', 'Low'];

  const handlePriorityChange = (priority:any) => {
    setSelectedPriority(priority);
    setNewTask((prevTask) => ({
      ...prevTask,
      priority: priority,
    }));
  };
  



  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);


  const handleopenEditmodal = (taskId: number) => {
    const selectedTask = tasks.find((task) => task.id === taskId);
    if (selectedTask) {
      setSelectedTaskId(taskId);
      setNewTask(selectedTask);
      setSelectedPriority(selectedTask.priority);
      setOpenModal2(true);
    }
  };
  const handleAddTask = async () => {
    setOpenModal(false);
    setNewTask({ id: 0, title: '', priority: '', status: 'To Do' });
    try {
      setOpenModal(false);
      const response = await fetch('http://localhost:4000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
  
      const addedTask: Task = await response.json();
  
      setTasks([...tasks, addedTask]);
      setNewTask({ id: 0, title: '', priority: '', status: 'To Do' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };


  const handleDeleteTask = async () => {
    try {
      const response = await fetch(`http://localhost:4000/tasks/${selectedTaskId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
  
      const updatedTasks = tasks.filter((task) => task.id !== selectedTaskId);
      setTasks(updatedTasks);
      setOpenDeleteModal(false);
      setSelectedTaskId(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  


  const handleEditTask = async () => {
    try {
      const response = await fetch(`http://localhost:4000/tasks/${selectedTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
  
      const updatedTask = await response.json();
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      );
  
      setTasks(updatedTasks);
      setOpenModal2(false);
      setSelectedTaskId(null);
      setNewTask({ id: 0, title: '', priority: '', status: 'To Do' });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  
  const [openDeleteModal, setOpenDeleteModal] = useState(false);


  return (
    <React.Fragment>
          <Container maxWidth="xl" style={{marginTop:'20px'}}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>

      <Typography variant="h4">Tasks</Typography>


      <Button variant="contained" onClick={() => setOpenModal(true)}>
        Add Task
      </Button>
      </Stack>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            fullWidth
            margin="normal"
          />
            <Stack direction="column" spacing={1}>
      <Typography variant="body1">Priority</Typography>
      <Stack direction="row" justifyContent="space-between"  spacing={1}>
        {priorities.map((priority, index) => (
          <Box key={index} onClick={() => handlePriorityChange(priority)}>
            <Badge
              badgeContent={priority}
              color={ selectedPriority === priority ? 'success' : 'primary'}
              sx={{
                cursor: 'pointer',
                borderRadius: '5px',
                padding: '5px',
              }}
            />
          </Box>
        ))}
      </Stack>
    </Stack>
    <Stack direction="row" justifyContent="center" style={{marginTop:'15px'}}  spacing={1}>
          <Button variant="contained" color="primary" onClick={handleAddTask}>
            Add
          </Button>
          </Stack>

        </DialogContent>
      </Dialog>

      <Dialog open={openModal2} onClose={() => setOpenModal2(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            fullWidth
            margin="normal"
          />
            <Stack direction="column" spacing={1}>
      <Typography variant="body1">Priority</Typography>
      <Stack direction="row" justifyContent="space-between"  spacing={1}>
        {priorities.map((priority, index) => (
          <Box key={index} onClick={() => handlePriorityChange(priority)}>
            <Badge
              badgeContent={priority}
              color={ selectedPriority === priority ? 'success' : 'primary'}
              sx={{
                cursor: 'pointer',
                borderRadius: '5px',
                padding: '5px',
              }}
            />
          </Box>
        ))}
      </Stack>
    </Stack>
    <Stack direction="row" justifyContent="center" style={{marginTop:'15px'}}  spacing={1}>
          <Button variant="contained" color="primary" onClick={handleEditTask}>
            Edit
          </Button>
          </Stack>

        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
  <DialogTitle>Confirm Deletion</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to delete this task?</Typography>
    <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
      <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
      <Button variant="contained" color="error" onClick={handleDeleteTask}>
        Delete
      </Button>
    </Stack>
  </DialogContent>
</Dialog>



      <Stack direction="row" justifyContent="center" spacing={2}>
        {tasks.map((task) => (
          <Card variant="outlined" style={{ padding: '20px',width:'12%' }} key={task.id}>
            <Stack direction="column" alignItems="center" spacing={2}>
              <Typography style={{textAlign:'center'}} variant="body1">Title <Typography style={{textAlign:'center'}}>{task.title}</Typography></Typography>
              <Typography variant="body1">Priority  <Typography style={{color:task.priority==='Medium'?'yellow':task.priority==='Low'?'green':'red',textAlign:'center'}}>{task.priority}</Typography></Typography>
              <Badge
                badgeContent={task.status}
                color='primary'
                              onClick={() => handleStatusChange(task.id)}
                style={{ cursor: 'pointer', textWrap: 'nowrap' }}
              ></Badge>
              <CircularProgress
                variant="determinate"
                value={getProgress(task.status)}
                color='primary'
              />
              <Stack direction="row" alignItems="center" spacing={2}>
                <EditIcon style={{fontSize:'25px',cursor: 'pointer'}} onClick={() => handleopenEditmodal(task.id)} />
                <DeleteIcon  style={{color:'red',fontSize:'25px',cursor: 'pointer'}}     onClick={() => {
    setOpenDeleteModal(true);
    setSelectedTaskId(task.id);
  }}/>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
      </Container>

    </React.Fragment>
  );
};

export default Tasks;
