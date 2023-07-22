import { ToDoList } from "./List";

class Project{
    constructor(){
        this.projectList = []
    }
    addProject(toDoList){
        this.projectList.push(toDoList)
    }
    deleteProject(projectIndex){
        if(projectIndex > -1){
            this.projectList.splice(projectIndex, 1)
        }
    }
    searchForProjectByIndex(projectIndex){
        return this.projectList[projectIndex]
    }
    searchForPrjectByTitle(projectTitle){
        const result = this.projectList.filter(project => project.getToDoListTitle === projectTitle)
        return result
    }
    getProjectListLength(){
        return this.projectList.length
    }
}

export{
    Project
}