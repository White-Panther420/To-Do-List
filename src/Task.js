import {parse, format} from "date-fns"

class Task{
    constructor(title, description, dueDate, priority="Low", isComplete="Incomplete", taskIndex, taskSource ="general"){
        this.title = title
        this.description = description

        //Change date format
        if(dueDate !== ""){
            this.dueDate = this.formatDueDate(dueDate)
        }else{
            this.dueDate = "No due date"
        }
        
        this.priority = priority
        this.isComplete = isComplete
        //Additional attribute to help tie tasks to their respective lists when deleting tasks
        this.taskIndex = taskIndex 
        //Additional attribute to help differentiate project tasks from general tasks when deleting tasks from upper tabs
        this.taskSource = taskSource
    }

    //Getters
    get getTaskName(){
        return this.title
    }
    get getTaskDescr(){
        return this.description
    }
    get getDuedate(){
        return this.dueDate
    }
    get getPriorityLevel(){
        return this.priority
    }
    get getCompletionState(){
        return this.isComplete
    }
    get getTaskIndex(){
        return this.taskIndex
    }
    get getTaskSource(){
        return this.taskSource
    }

    //Setters
    set setTaskName(title){
        return this.title = title
    }
    set setTaskDescr(description){
        return this.description = description
    }
    set setDuedate(dueDate){
        if(dueDate !== ""){
            return this.dueDate = this.formatDueDate(dueDate)
        }else{
            return this.dueDate = "No due date"
        }
    }
    set setTriorityLevel(priority){
        return this.priority = priority
    }
    set setCompletionState(isComplete){
        return this.isComplete = isComplete
    }
    set setTaskIndex(taskIndex){
        return this.taskIndex = taskIndex
    }
    set setTaskSource(taskSource){
        return this.taskSource = taskSource
    }

    formatDueDate(dueDate){
        const dateString = dueDate
        const date = parse(dateString, "yyyy-MM-dd", new Date())  
        let formatedDate = format(date, "MM-dd-yyyy")
        return formatedDate
    }
}

export{
    Task,
}