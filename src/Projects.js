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
        this.projectList.forEach(project => {
            console.log("THE TASK INFO: " + project.printTasks())
        });
    }
    deleteProject(projectIndex){
        if(projectIndex > -1){
            this.projectList.splice(projectIndex, 1)
        }
    }
    searchForProject(projectIndex){
        return this.projectList[projectIndex]
    }
    getProjectListLength(){
        return this.projectList.length
    }
}

export{
    Project
}