class Task{
    constructor(title, description, dueDate, priority="Low", isComplete="Incomplete"){
        this.title = title
        this.description = description
        this.dueDate = dueDate
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
    set setTuedate(dueDate){
        return this.dueDate = dueDate
    }
    set setTriorityLevel(priority){
        return this.priority = priority
    }
    set setCompletionState(isComplete){
        return this.isComplete = isComplete
    }
}

export{
    Task
}