import { LocalDatabase } from "./localDatabase.js";

const database = new LocalDatabase('project_js', ['todos', 'users'], 4);

export const initTasks = (tasks = []) => {
    let newTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    
    if (newTasks.length === 0) {
        newTasks = tasks;
    }
    newTasks.forEach((task) => {
        database.addData(task, 'todos');
    });
    
   
    
    
    return newTasks;
};

export const getTasks = () => {
    let newTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    
  
  
    return newTasks;
};

export const saveTasks = (newTasks) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks));
   
    return newTasks;
};
