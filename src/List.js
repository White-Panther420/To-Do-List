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
            console.log("Task Name: " + task.taskName)
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
    createNewTask = (taskTitle, taskDescr, taskDueDate, taskPriority)=>{
        let newTask = new Task(taskTitle, taskDescr, taskDueDate, taskPriority, "Incomplete")
        this.addTask(newTask)
    }   
    updateTaskStatus = (taskContainerIndex)=>{
        const currentTask = this.searchTask(taskContainerIndex)
        currentTask.getCompletionState === "Incomplete" ?  currentTask.setCompletionState="Complete" : currentTask.setCompletionState="Incomplete"
    }
}

export{
    ToDoList
}