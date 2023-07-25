import { Task } from "./Task";
import {parse, format, startOfWeek, endOfWeek, isWithinInterval} from "date-fns"
import uniqid from 'uniqid';

class ToDoList{
    constructor(newList, listTitle, listID){
        if(newList === ""){
            this.list = []
        }else{
            this.list = newList  //NewList is a deep copy form local storage
            for(let i=0; i<this.getListLength(); i++){
                this.list[i] = new Task(
                    this.list[i].title, 
                    this.list[i].description, 
                    this.list[i].dueDate, 
                    this.list[i].priority, 
                    this.list[i].isComplete, 
                    this.list[i].taskSource,
                    this.list[i].taskID
                )
            }
        }
        this.listTitle = listTitle
        this.listID = listID  //Give each list a unique identifier to easily delete task
    }
    get getToDoListID(){
        return this.listID
    }
    get getToDoListTitle(){
        return this.listTitle
    }

    set setToDoListID(listID){
        return this.listID = listID
    }
    set setToDoListTitle(listTitle){
        return this.listTitle = listTitle
    }
    

    addTask(task){
        this.list.push(task)
    }
    getListLength(){
        return this.list.length
    }
    searchTaskByIndex(taskIndex){
        return this.list[taskIndex]
    }
    searchTaskByUniqueID(taskID){
        return this.list.find(task => task.getTaskID == taskID)
    }
    deleteTask(taskID){
        let taskToBeDeleted = this.searchTaskByUniqueID(taskID)
        let indexOfTaskToBeDeleted = this.list.indexOf(taskToBeDeleted)
        this.list.splice(indexOfTaskToBeDeleted, 1)
    }
    createNewTask = (taskTitle, taskDescr, taskDueDate, taskPriority, taskSource)=>{
        let newTask = new Task(taskTitle, taskDescr, taskDueDate, taskPriority, "Incomplete", taskSource, uniqid())
        return newTask
    }   
    updateTaskInfo = (taskTitle, taskDescr, taskDueDate, taskPriority, taskID)=>{
        const currentTask = this.searchTaskByUniqueID(taskID)
        currentTask.setTaskName = taskTitle
        currentTask.setTaskDescr = taskDescr
        currentTask.setDuedate = taskDueDate
        currentTask.setTriorityLevel = taskPriority
    }
    updateTaskStatus = (taskID)=>{
        const currentTask = this.searchTaskByUniqueID(taskID)
        if(currentTask.getCompletionState === "Incomplete"){
            currentTask.setCompletionState="Complete"
        }
        else{
            currentTask.setCompletionState="Incomplete"
        }
    }
    updateTaskSources(newTitle){   //Update sources to continue matching them correctly to their list
        this.list.forEach(task =>{
            task.setTaskSource = newTitle
        })
    }
    isDueToday(taskIndex){
        const todayDate = format(new Date(),'MM-dd-yyyy');
        const taskDueDate = this.searchTaskByIndex(taskIndex).getDuedate
        if(taskDueDate === todayDate){
            return true
        }
    }
    isDueThisWeek(taskIndex){
        const taskDueDate = parse(this.searchTaskByIndex(taskIndex).getDuedate, "MM-dd-yyyy", new Date())
        const startOfCurrentWeek = startOfWeek(new Date())
        const endOfCurrentWeek = endOfWeek(new Date())
        const isWithinCurrentWeek = isWithinInterval(taskDueDate, { start: startOfCurrentWeek, end: endOfCurrentWeek });
        if(isWithinCurrentWeek){
            return true
        }
    }
    checkTaskImportance(taskIndex){
        const taskPriority = this.searchTaskByIndex(taskIndex).getPriorityLevel
        if(taskPriority.toLowerCase() === "high"){
            return true
        }
    }
    checkTaskCompletionStatus(taskIndex){
        const checkTaskCompletionStatus = this.searchTaskByIndex(taskIndex).getCompletionState
        if(checkTaskCompletionStatus.toLowerCase() === "complete"){
            return true
        }
    }
}

export{
    ToDoList
}