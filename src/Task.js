import {parse, format, isValid} from "date-fns"
class Task{
    constructor(title, description, dueDate, priority="Low", isComplete="Incomplete", taskSource ="general", taskID){
        this.title = title
        this.description = description

        //Change date format
        if(dueDate !== "" && dueDate !== "No due date"){
            this.dueDate = this.formatDueDate(dueDate)
        }else{
            this.dueDate = "No due date"
        }
        
        this.priority = priority
        this.isComplete = isComplete
        this.taskID = taskID   //Unique task ID
        this.taskSource = taskSource  //Unique ID of To Do List the task belongs to
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
    get getTaskID(){
        return this.taskID
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
    set setTaskId(taskID){
        return this.taskID = taskID
    }
    set setTaskSource(taskSource){
        return this.taskSource = taskSource
    }

    formatDueDate(dueDate){
        const dateString = dueDate
        if(isValid(parse(dateString, "MM-dd-yyyy", new Date()))){ //Check if date is already in MM-dd-yyyy format
            return dateString
        }
        const date = parse(dateString, "yyyy-MM-dd", new Date())  
        let formatedDate = format(date, "MM-dd-yyyy")
        return formatedDate
    }
}

export{
    Task,
}