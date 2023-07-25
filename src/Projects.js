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
    searchForProjectByIndex(projectToDoListIndex){
        return this.projectList[projectToDoListIndex]
    }
    searchForProjectByID(toDoListID){
        this.projectList.find(project => project.getToDoListID === toDoListID)
    }
    getProjectListLength(){
        return this.projectList.length
    }
}

export{
    Project
}