import { ToDoList } from "./List";

class Project{
    constructor(){
        this.projectList = []
    }
    addProject(toDoList){
        this.projectList.push(toDoList)
    }
    printProjectNames(){
        this.projectList.forEach(project => {
            console.log(project)
        });
    }
    printProjectTasks(){
        for(let key in obj){
            console.log("ALL TASKS: " + this.projectList[key])
        }
    }
    printSpecificProjectTask(projectName){
        for(let projectName in this.projectList){
            console.log("ALL TASKS: " + this.projectList[projectName])
        }
    }
    deleteProject(projectIndex){
        if(projectIndex > -1){
            this.projectList.splice(projectIndex, 1)
        }
    }
    searchForProject(projectIndex){
        return this.projectList[projectIndex]
    }
}

export{
    Project
}