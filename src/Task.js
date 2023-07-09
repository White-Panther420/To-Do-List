import {parse, format} from "date-fns"

class Task{
    constructor(title, description, dueDate, priority="Low", isComplete="Incomplete"){
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

    //Setters
    set setTaskName(title){
        return this.title = title
    }
    set setTaskDescr(description){
        return this.description = description
    }
    set setDuedate(dueDate){
        return this.dueDate = this.formatDueDate(dueDate)
    }
    set setTriorityLevel(priority){
        return this.priority = priority
    }
    set setCompletionState(isComplete){
        return this.isComplete = isComplete
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