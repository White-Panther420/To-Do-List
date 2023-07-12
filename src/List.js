import { Task } from "./Task";
import {parse, format, getDay, startOfWeek, endOfWeek, isWithinInterval} from "date-fns"
class ToDoList{
    constructor(){
        this.list = []
    }
    addTask(task){
        this.list.push(task)
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
        if(taskIndex > -1){
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
        if(currentTask.getCompletionState === "Incomplete"){
            currentTask.setCompletionState="Complete"
        }
        else{
            currentTask.setCompletionState="Incomplete"
        }
    }
    isDueToday(taskIndex){
        const todayDate = format(new Date(),'MM-dd-yyyy');
        const taskDueDate = this.searchTask(taskIndex).getDuedate
        if(taskDueDate === todayDate){
            return true
        }
    }
    isDueThisWeek(taskIndex){
        const taskDueDate = parse(this.searchTask(taskIndex).getDuedate, "MM-dd-yyyy", new Date())
        const startOfCurrentWeek = startOfWeek(new Date())
        const endOfCurrentWeek = endOfWeek(new Date())
        const isWithinCurrentWeek = isWithinInterval(taskDueDate, { start: startOfCurrentWeek, end: endOfCurrentWeek });
        if(isWithinCurrentWeek){
            return true
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