import { Task } from "./Task";
import {parse, format, startOfWeek, endOfWeek, isWithinInterval} from "date-fns"
class ToDoList{
    constructor(newList, listTitle){
        if(newList === ""){
            this.list = []
        }else{
            this.list = newList
            for(let i=0; i<this.getListLength(); i++){
                this.list[i] = new Task(
                    this.list[i].title, 
                    this.list[i].description, 
                    this.list[i].dueDate, 
                    this.list[i].priority, 
                    this.list[i].isComplete, 
                    this.list[i].taskIndex, 
                    this.list[i].taskSource
                )
            }
            
        }
        this.listTitle = listTitle  //Give each list a unique identifier to help delete correct task from a project
    }
    get getToDoListTitle(){
        return this.listTitle
    }
    set setToDoListTItle(listTitle){
        return this.listTitle = listTitle
    }

    addTask(task){
        this.list.push(task)
    }
    getListLength(){
        return this.list.length
    }
    searchTask(taskIndex){
        return this.list[taskIndex]
    }
    deleteTask(taskIndex){
        if(taskIndex > -1){
            this.list.splice(taskIndex,1)
        }
    }
    createNewTask = (taskTitle, taskDescr, taskDueDate, taskPriority, taskSource)=>{
        const taskIndex = this.getListLength()  //Will help us when deleting project-based tasks
        let newTask = new Task(taskTitle, taskDescr, taskDueDate, taskPriority, "Incomplete", taskIndex, taskSource)
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
    updateTaskIdnicies = ()=>{
        //Update indicies to continue matching them correctly to their list
        let newTaskIndex = 0
        this.list.forEach(task => {
            task.setTaskIndex = newTaskIndex
            newTaskIndex++
        });
    }
    updateTaskSources(newTitle){   //Update sources to continue matching them correctly to their list
        this.list.forEach(task =>{
            task.setTaskSource = newTitle
        })
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