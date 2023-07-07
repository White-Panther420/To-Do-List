import { Task } from "./Task";

class ToDoList{
    constructor(){
        this.list = []
    }
    addTask(task){
        this.list.push(task)
    }
    printTask(){
        this.list.forEach(task => {
            console.log("Task Name: " + task.getTaskName)
        });
    }
    getListLength(){
        return this.list.length
    }
    getLastTask(){
        return this.list[this.list.length-1]
    }
    searchTask(taskIndex){
        return this.list[taskIndex]
    }
    deleteTask(taskIndex){
        if(index > -1){
            this.list.splice(taskIndex,1)
        }
    }
    createNewTask = (taskTitle, taskDescr, taskDueDate, taskPriority)=>{
        let newTask = new Task(taskTitle, taskDescr, taskDueDate, taskPriority, "Incomplete")
        this.addTask(newTask)
    }   
    updateTaskInfo = (taskTitle, taskDescr, taskDueDate, taskPriority, taskIndex)=>{
        const currentTask = this.searchTask(taskIndex)
        currentTask.setTaskName = taskTitle
        currentTask.setTaskDescr = taskDescr
        currentTask.setTuedate = taskDueDate
        currentTask.setTriorityLevel = taskPriority
    }
    updateTaskStatus = (taskContainerIndex)=>{
        const currentTask = this.searchTask(taskContainerIndex)
        currentTask.getCompletionState === "Incomplete" ?  currentTask.setCompletionState="Complete" : currentTask.setCompletionState="Incomplete"
    }
    sortTasks = (sortingOption)=>{
        //this.list
    }
}

export{
    ToDoList
}