import { Task } from "./Task";
import {parse, format, getDay} from "date-fns"
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
        currentTask.setDuedate = taskDueDate
        currentTask.setTriorityLevel = taskPriority
    }
    updateTaskStatus = (taskContainerIndex)=>{
        const currentTask = this.searchTask(taskContainerIndex)
        currentTask.getCompletionState === "Incomplete" ?  currentTask.setCompletionState="Complete" : currentTask.setCompletionState="Incomplete"
    }
    isDueToday(taskIndex){
        const todayDate = format(new Date(),'MM-dd-yyyy');
        const taskDueDate = this.searchTask(taskIndex).getDuedate
        if(taskDueDate === todayDate){
            return true
        }
    }
    isDueThisWeek(taskIndex){
        //Get current day in number
        const todayDate =  "12-30-2023"  //format(new Date(),'MM-dd-yyyy');
        const dateParts = todayDate.split('-')
        let day = parseInt(dateParts[1])
        let month = parseInt(dateParts[0])
        let year = parseInt(dateParts[2])
        //Get task due date day in number
        const taskDueDate = this.searchTask(taskIndex).getDuedate
        const taskDateParts = taskDueDate.split('-')
        let taskDay = parseInt(taskDateParts[1])
        let taskMonth = parseInt(taskDateParts[0])
        let taskYear =parseInt(taskDateParts[2])
        if(taskDay >= day  && taskDay <= day+6){  //Week spans same month
            return true
        }
        else if(taskDay <= day && taskMonth === month+1){  //Week spans into next month
            if((day === 30 && taskDay <= 5 || day === 31 && taskDay <= 6) && taskYear === year){
                return true
            }
        }
        else if(taskDay <= day && taskYear === year+1){
            return true
        }
        else{
            return false
        }
    }
    checkTaskImportance(taskIndex){
        const taskPriority = this.searchTask(taskIndex).getPriorityLevel
        if(taskPriority.toLowerCase() === "high"){
            return true
        }
    }
    checkTaskCompletionStatus(taskIndex){
        const checkTaskCompletionStatus = this.searchTask(taskIndex).getCompletionState
        if(checkTaskCompletionStatus.toLowerCase() === "complete"){
            return true
        }
    }
}

export{
    ToDoList
}