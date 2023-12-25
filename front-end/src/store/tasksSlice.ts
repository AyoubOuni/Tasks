

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';

interface Task {
  id: number;
  title: string;
  priority: string;
  status: string;
}

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    updateStatus(state, action: PayloadAction<{ taskId: number; newStatus: string }>) {
      const { taskId, newStatus } = action.payload;
      const taskToUpdate = state.tasks.find((task) => task.id === taskId);
      if (taskToUpdate) {
        taskToUpdate.status = newStatus;
      }
    },
  },
});




export const changeTaskStatus = (taskId: number, newStatus: string): AppThunk<void> => async (dispatch, getState) => {
  try {
 
      
        fetch(`http://localhost:4000/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status:newStatus }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error('Failed to update task status');
          }
          return response.json();
        });
    
  } catch (error) {
    console.error('Error updating task status:', error);
  }
};


export default tasksSlice.reducer;


