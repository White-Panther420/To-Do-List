import "./Styles/style.css"
import {ToDoList} from "./List.js" 
import { Project } from "./Projects"
import EditIcon from "./Assets/Edit.png"
import DeleteIcon from "./Assets/Delete.png"
import InfoIcon from "./Assets/Info.png"
import ProjectIcon from "./Assets/Project.png"
import { loadPage, loadTaskHeaderSection} from "./loadPage"
import { createAnElement, createAnImg, createInput, createForm, closeForm, createFormActionSection, createFormTitleSection, createProjectForm, createDeleteWarninMsg} from "./formAndElements"
import {format, parse} from "date-fns"

//Load the constant part of page (header, sidebar, and some of body)
const content = document.querySelector("#content")
const pageContent = loadPage()
content.appendChild(pageContent)
const modal = document.querySelector('.modal')

/******************** GUI FUNCTIONS *********************/
const GUI = (()=>{
    const createTaskGUI = (lastIndexInList, taskList)=>{ //Creates the GUI to display a tasj and its information
        const taskContainer = createAnElement("div", "taskContainer")
        taskContainer.setAttribute("data-state", lastIndexInList)  //Link each GUI task to console task stored in newList
        const currentTask = taskList.searchTask(lastIndexInList) 
    
        const leftTaskSideDiv = createAnElement("div", "leftTaskSideDiv")
        const completedCheckCircle = createInput("completed", "checkbox")
        completedCheckCircle.classList.remove("input")
        completedCheckCircle.classList.add("complete", `${currentTask.getPriorityLevel.toLowerCase()}`)

        const taskNameP = createAnElement("p", "taskNameP")
        taskNameP.textContent = currentTask.getTaskName
        leftTaskSideDiv.appendChild(completedCheckCircle)
        leftTaskSideDiv.appendChild(taskNameP)
    
        const rightTaskSideDiv = createAnElement("div", "rightTaskSideDiv")
        const dueDateP = createAnElement("p", "dueDateP")
        dueDateP.textContent = currentTask.getDuedate
        rightTaskSideDiv.appendChild(dueDateP)
    
        const editIcon = createAnImg(EditIcon, "taskOptionIcon")
        editIcon.addEventListener("click", ()=>{
            modal.style.display = "block"
            displayEditTaskGUI(currentTask.getTaskIndex, taskContainer, taskList)            
        })
        const deleteIcon = createAnImg(DeleteIcon, "taskOptionIcon")
        deleteIcon.addEventListener("click", ()=>{
            modal.style.display = "block"
            createDeleteGUI(currentTask.getTaskName, taskContainer, taskList)
        })
        const infoIcon = createAnImg(InfoIcon, "taskOptionIcon")
        infoIcon.addEventListener("click", ()=>{
            displayTaskInformation(taskList.searchTask(taskContainer.getAttribute("data-state")), taskContainer)
            modal.style.display = "block"
        })
        rightTaskSideDiv.appendChild(editIcon)
        rightTaskSideDiv.appendChild(deleteIcon)
        rightTaskSideDiv.appendChild(infoIcon)
    
        completedCheckCircle.addEventListener("click", ()=>{
            GUI.displayTaskStatus(completedCheckCircle, taskNameP)
            taskList.updateTaskStatus(taskContainer.getAttribute("data-state"))
        })

        //For completed tasks that need to be displayed as completed when loadng them in
        if(currentTask.getCompletionState === "Complete"){
            completedCheckCircle.checked = true
            GUI.displayTaskStatus(completedCheckCircle, taskNameP)
        }

        taskContainer.appendChild(leftTaskSideDiv)
        taskContainer.appendChild(rightTaskSideDiv)
        return taskContainer
    }
    
    const displayTaskGUI = (lastIndexInList, taskList)=>{
        return createTaskGUI(lastIndexInList, taskList)
    }

    const displayEditTaskGUI = (currentTaskIndex, currentTaskContainer, taskList)=>{  //Displays the form to allow user to edit task
        const editForm = createForm("Edit Task", "Edit")
        editForm.setAttribute('id', "EditForm")
        const taskContainerIndex = currentTaskContainer.getAttribute("data-state")
        //Specific eventListeners to delete forms when exited
        const exitBtn = editForm.querySelector(".exitBtn")
        exitBtn.addEventListener("click", ()=>{
            currentTaskContainer.removeChild(editForm)
        })
        const cancelBtn = editForm.querySelector(".cancelBtn")
        cancelBtn.addEventListener("click", ()=>{
            currentTaskContainer.removeChild(editForm)
        })
        const submitBtn = editForm.querySelector(".submitBtn")
        submitBtn.addEventListener("click", (e)=>{  //Giving each edit form their own event listeners
            const taskTitle = editForm.querySelector("#title").value
            const taskDescr = editForm.querySelector("#description").value
            const taskDueDate = editForm.querySelector("#due_date").value
            const taskPriority = editForm.querySelector("#priority").value

            if(currentTask.getPriorityLevel !== taskPriority){  //Prevent duplicate classes on element
                updatePriorityGUI(currentTaskContainer, currentTask.getPriorityLevel, taskPriority)
            }
            if(currentTask.getTaskSource !== "general"){
                //Grab data attribute from project container to ensure we select the correct project if more than one
                //with the same title exists
                const currentProjectDiv = document.querySelector("#selecetedOption")
                const currentProjectIndex = currentProjectDiv.getAttribute("data-state")
                const toDoList = newProjectList.searchForProjectByIndex(currentProjectIndex)
                toDoList.updateTaskInfo(taskTitle, taskDescr, taskDueDate, taskPriority, currentTaskIndex)  //Update Array
                storeToDoListInStorage(toDoList, toDoList.getToDoListTitle)

            }else{
                newList.updateTaskInfo(taskTitle, taskDescr, taskDueDate, taskPriority, currentTaskIndex)  //Update Array
                storeToDoListInStorage(newList, newList.getToDoListTitle)
            }
            if(tabName !== "Project"){
                //Update merged taskList
                taskList.updateTaskInfo(taskTitle, taskDescr, taskDueDate, taskPriority, taskContainerIndex) 
                storeToDoListInStorage(taskList, taskList.getToDoListTitle)
            }
            updateTaskGUI(currentTaskContainer, taskTitle, taskDueDate)  //Update task GUI

            closeForm()
            currentTaskContainer.removeChild(editForm)
            e.preventDefault();
        })
        currentTaskContainer.appendChild(editForm)

        //Give form current task values for user to edit
        let currentTask = taskList.searchTask(taskContainerIndex)
        const taskTitle = editForm.querySelector("#title")
        taskTitle.setAttribute("value", currentTask.getTaskName)
        const taskDescr = editForm.querySelector("#description")
        taskDescr.value = currentTask.getTaskDescr

        //Reformat date so form can recognize the value
        const taskDueDate = editForm.querySelector("#due_date")
        const currentTaskDueDate = currentTask.getDuedate
        taskDueDate.value = formatTaskDate(currentTaskDueDate, "MM-dd-yyyy", "yyyy-MM-dd")

        const taskPriority = editForm.querySelector("#priority")
        taskPriority.value = currentTask.getPriorityLevel
        editForm.style.display = "block"
    }
    const createDeleteGUI = (taskName, taskContainer, taskList)=>{
        const deleteGUI = createAnElement("div", "popUpForm")
        deleteGUI.setAttribute("id", "deleteGUI")

        //Top of form
        const deleteTitleDiv = createFormTitleSection("Dekete Task?")
        deleteTitleDiv.style.background = "rgb(243, 39, 39)"
        const deleteExitBtn = deleteTitleDiv.querySelector(".exitBtn")
        deleteExitBtn.addEventListener("click", ()=>{
            taskContainer.removeChild(deleteGUI)
            modal.style.display = "none"
        })

        //Form body
        const deleteWarningDiv = createDeleteWarninMsg("task", taskName)

        //Form options
        const formActionBtnsDiv = createFormActionSection("Delete")
        const cancelBtn = formActionBtnsDiv.querySelector(".cancelBtn")
        cancelBtn.addEventListener("click", ()=>{
            taskContainer.removeChild(deleteGUI)
            modal.style.display = "none"
        })
        const submitBtn = formActionBtnsDiv.querySelector(".submitBtn")
        submitBtn.addEventListener('click', ()=>{
            deleteTaskGUI(taskContainer)
            const currentTask = taskList.searchTask(taskContainer.getAttribute("data-state"))
            const currentTaskIndex = currentTask.getTaskIndex  //Index corresponding to task's original list
            const currentTaskSource = currentTask.getTaskSource
            const currentTaskName = currentTask.getTaskName
            if(currentTaskSource !== "general"){
                //Get project index
                const listResult = newProjectList.searchForPrjectByTitle(currentTaskSource)
                let projectToDoList
                if(listResult.length > 1){  //Check if more than one project with the same title exists
                    for(let i=0; i<listResult.length; i++){
                        if(listResult[i].searchTask(currentTaskIndex).getTaskName === currentTaskName){
                            projectToDoList = listResult[i]
                            break
                        }else{
                            continue
                        }
                    }
                }else{
                    projectToDoList = listResult[0]
                }
                deleteTaskFromStorage(projectToDoList, projectToDoList.getToDoListTitle, currentTaskIndex)
                projectToDoList.deleteTask(currentTaskIndex)
                projectToDoList.updateTaskIndicies()
            }else{
                deleteTaskFromStorage(newList, newList.getToDoListTitle, currentTaskIndex)
                newList.deleteTask(currentTaskIndex)
                newList.updateTaskIndicies()
            }
            if(tabName !== "Project"){
                //Update merged taskList
                taskList.deleteTask(taskContainer.getAttribute("data-state"))
                taskList.updateTaskIndicies()
            }

            updateNumTasksGUI()
            taskContainer.removeChild(deleteGUI)
            modal.style.display = "none"
        })

        deleteGUI.appendChild(deleteTitleDiv)
        deleteGUI.appendChild(deleteWarningDiv)
        deleteGUI.appendChild(formActionBtnsDiv)
        taskContainer.appendChild(deleteGUI)
        deleteGUI.style.display = "block"
    }
    const displayTaskInformation = (currentTaskIndex, currentTaskContainer)=>{  //Displays GUI for user to see task overcview
        const infoContainer = createAnElement("div", "infoContainer")
        const infoTitleDiv = createFormTitleSection("Task Overview")
        const infoExitBtn = infoTitleDiv.querySelector(".exitBtn")
        infoExitBtn.addEventListener("click", ()=>{
            currentTaskContainer.removeChild(infoContainer)
            modal.style.display = "none"
        })
        
        const infoSectionDiv = createAnElement("div", "infoSectionDiv")
        const infoCardTitles = ["Title" , "Description", "Due date", "Priority",  "Completion Status"]
        const infoCardContent = [currentTaskIndex.getTaskName, currentTaskIndex.getTaskDescr, currentTaskIndex.getDuedate, currentTaskIndex.getPriorityLevel, currentTaskIndex.getCompletionState]
        for(let i=0; i<5; i++){
            const infoDiv = createAnElement("div", "infoDiv")
            const cardTitle = createAnElement("h3", "cardTitle")
            cardTitle.textContent = infoCardTitles[i]
            const cardContent = createAnElement("p", "cardContent")
            cardContent.textContent = infoCardContent[i]
            infoDiv.appendChild(cardTitle)
            infoDiv.appendChild(cardContent)
            infoSectionDiv.appendChild(infoDiv)
        }
    
        const infoActionDiv = createAnElement("div", "infoActionDiv")
        const infoCancelBtn = createAnElement("button", "infoCancelBtn")
        infoCancelBtn.textContent = "Cancel"
        infoCancelBtn.addEventListener("click", ()=>{
            currentTaskContainer.removeChild(infoContainer)
            modal.style.display = "none"
        })
        infoActionDiv.appendChild(infoCancelBtn)

        infoContainer.appendChild(infoTitleDiv)
        infoContainer.appendChild(infoSectionDiv)
        infoContainer.appendChild(infoActionDiv)
    
        currentTaskContainer.appendChild(infoContainer)
        infoContainer.style.display = "block"
    }
    const deleteTaskGUI = (taskContainer)=>{
        toDoListDiv.removeChild(taskContainer)
        const tasks = document.querySelectorAll(".taskContainer")
        let taskIndex = 0
        //Reset attributes so they match with the array indixies
        tasks.forEach(task => {
            task.setAttribute("data-state", taskIndex)
            taskIndex++
        });
    }
    const displayTaskStatus = (checkButton, taskTitle)=>{
        if(checkButton.checked === true){  //Button currently not checked
            taskTitle.setAttribute("id", "completedTask")
            checkButton.setAttribute("id", "isCompleteBtn")
        }else{  //Uncheck button
            taskTitle.removeAttribute("id", "completedTask")
            checkButton.removeAttribute("id", "isCompleteBtn")
        }
    }
    const updateTaskGUI = (taskContainer, newTaskTitle, newTaskDueDate)=>{
        const taskTitle = taskContainer.querySelector(".taskNameP")
        taskTitle.textContent = newTaskTitle
        const taskDueDate = taskContainer.querySelector('.dueDateP')
        if(newTaskDueDate === ""){
            taskDueDate.textContent = "No due date"
        }else{
            taskDueDate.textContent = formatTaskDate(newTaskDueDate, "yyyy-MM-dd", "MM-dd-yyyy")
        }
    }
    const updatePriorityGUI = (taskContainer, currentPriority, newPriority)=>{
        const checkCircle = taskContainer.querySelector(".complete")
        checkCircle.classList.remove(currentPriority.toLowerCase())
        checkCircle.classList.add(newPriority.toLowerCase())
    }
    const updateNumTasksGUI = ()=>{
        const tasks = document.querySelectorAll(".taskContainer")
        const numTasksP = document.querySelector(".numTasks")
        numTasksP.textContent = `(${tasks.length})`
    }
    const displayListOfTasksGUI = (taskList, selecetedOption)=>{
        for(let i=0; i<taskList.getListLength(); i++){
            if(selecetedOption === "home"){
                toDoListDiv.appendChild(displayTaskGUI(i, taskList))
            }
            else if(selecetedOption === "today" && taskList.isDueToday(i)){
                toDoListDiv.appendChild(displayTaskGUI(i, taskList))
            }
            else if(selecetedOption === "week" && taskList.isDueThisWeek(i)){
                toDoListDiv.appendChild(displayTaskGUI(i, taskList))
            }
            else if(selecetedOption === "important" && taskList.checkTaskImportance(i)){
                toDoListDiv.appendChild(displayTaskGUI(i, taskList))
            }
            else if(selecetedOption === "completed" && taskList.checkTaskCompletionStatus(i)){
                toDoListDiv.appendChild(displayTaskGUI(i, taskList))
            }
            else{
                continue
            }
        }
    }
    return{displayTaskGUI, displayTaskInformation, displayTaskStatus, updateNumTasksGUI, displayListOfTasksGUI}
})()
/******************** GUI FUNCTIONS *********************/

/******************** PROJECT GUI FUNCTIONS *********************/
const projectGUI = (()=>{
    const displayAddProjectGUI = ()=>{
        const projectsContainer = document.querySelector(".projectsContainer")
        const addProjectForm = createProjectForm("Add A Project", "Add")
        content.appendChild(addProjectForm)

        const exitBtn = addProjectForm.querySelector(".exitBtn")
        exitBtn.addEventListener("click", ()=>{
            content.removeChild(addProjectForm)
            modal.style.display = "none"        
        })

        const cancelBtn = addProjectForm.querySelector(".cancelBtn")
        cancelBtn.addEventListener("click", ()=>{
            content.removeChild(addProjectForm)
            modal.style.display = "none"
        })

        const submitBtn = addProjectForm.querySelector(".submitBtn")
        submitBtn.addEventListener('click', ()=>{
            //Update project list
            const projectTitle = addProjectForm.querySelector("#title").value
            const newToDoList = new ToDoList("",projectTitle, newProjectList.getProjectListLength()-1)  //Create new list for project
            newProjectList.addProject(newToDoList)

            //Update frontend
            const newProject = createProjectSideBarGUI(projectTitle, newProjectList)
            projectsContainer.appendChild(newProject)
            updateNumProjectsGUI()
            newProject.click()
            closeForm()
            content.removeChild(addProjectForm)
        })
        addProjectForm.style.display = "block"

    }
    const createProjectSideBarGUI = (projectName, projectList) =>{
        const projectDiv = createAnElement("div", "projectDiv")
        projectDiv.setAttribute("id", "unselectedOption")
        projectDiv.addEventListener("click", (e)=>{
            if(!e.target.closest("#deleteProjectGUI")) {  //Prevents div from being clicked if user clicks delete form body
                const styledOptionDiv = document.querySelector("#selecetedOption")
                styledOptionDiv.removeAttribute("id")
                projectDiv.setAttribute("id", "selecetedOption")

                currentProjectIndex = projectDiv.getAttribute("data-state")
                tabName = "Project"
                displayProjectGUI(projectDiv, projectList)
            }
        })
        projectDiv.setAttribute("data-state", `${projectList.getProjectListLength()-1}`)
        const leftSideDiv = createAnElement("div", "leftSideDiv")
        const projectIcon = createAnImg(ProjectIcon, "projectIconLeft")
        const projectNameP = createAnElement("p", "projectNameP")
        projectNameP.textContent = projectName
        leftSideDiv.appendChild(projectIcon)
        leftSideDiv.appendChild(projectNameP)
        
        const rightSideDiv = createAnElement("div", "rightSideDiv")

        const editIcon = createAnImg(EditIcon, "projectIcon")
        editIcon.addEventListener("click", ()=>{
            modal.style.display = "block"
            displayEditProjectGUI(projectDiv)
        })
        const deleteIcon = createAnImg(DeleteIcon, "projectIcon")
        deleteIcon.addEventListener("click", (e)=>{
            e.stopPropagation(); //Prevents projectDiv eventListener from triggering
            modal.style.display = "block"
            displayDeleteProjectGUI(projectDiv, projectName)
        })
        rightSideDiv.appendChild(editIcon)
        rightSideDiv.appendChild(deleteIcon)
    
        projectDiv.appendChild(leftSideDiv)
        projectDiv.appendChild(rightSideDiv)
        return projectDiv
    }
    const displayProjectGUI = (project, projectList)=>{ 
        swtichTaskHeaderContent(project)
        const projectIndex = project.getAttribute("data-state")
        const projectToDoList = projectList.searchForProjectByIndex(projectIndex)
        for(let i=0; i<projectToDoList.getListLength(); i++){
            toDoListDiv.appendChild(GUI.displayTaskGUI(i, projectToDoList))
        }
        GUI.updateNumTasksGUI()
    }
    const displayEditProjectGUI = (projectDiv)=>{
        const projectDivTitle = projectDiv.querySelector(".projectNameP")
        const projectDivIndex = projectDiv.getAttribute("data-state")
        const editProjectForm = createProjectForm("Edit Project", "Edit")
        content.appendChild(editProjectForm)
        editProjectForm.style.display = "block"

        const exitBtn = editProjectForm.querySelector(".exitBtn")
        exitBtn.addEventListener("click", ()=>{
            content.removeChild(editProjectForm)
            modal.style.display = "none"        
        })
        const cancelBtn = editProjectForm.querySelector(".cancelBtn")
        cancelBtn.addEventListener("click", ()=>{
            content.removeChild(editProjectForm)
            modal.style.display = "none"
        })
        const submitBtn = editProjectForm.querySelector(".submitBtn")
        submitBtn.addEventListener("click", ()=>{
            const newProjectTitle = editProjectForm.querySelector("#title").value
            const tabTitle = document.querySelector(".tabTitle")
            projectDivTitle.textContent = newProjectTitle
            tabTitle.textContent = newProjectTitle
            content.removeChild(editProjectForm)
            modal.style.display = "none"

            const toDoList = newProjectList.searchForProjectByIndex(projectDivIndex)
            toDoList.setToDoListTItle = newProjectTitle
            toDoList.updateTaskSources(newProjectTitle)
        })  

        const currentProjectTitle = projectDivTitle.textContent
        const titleField = editProjectForm.querySelector("#title")
        titleField.value = currentProjectTitle
    }
    const updateNumProjectsGUI = ()=>{
        const numProjectsP = document.querySelector(".numProjeccts")
        const numProjects = newProjectList.getProjectListLength()
        numProjectsP.textContent = `(${numProjects})`
    }
    const displayDeleteProjectGUI = (projectDiv, projectName)=>{  //deleteType = task or project and deleteTypeName = task/project name
        const deleteProjectGUI = createAnElement("div", "popUpForm")
        deleteProjectGUI.setAttribute("id", "deleteProjectGUI")
        //Top of form
        const deleteTitleDiv = createFormTitleSection("Dekete Project?")
        deleteTitleDiv.style.background = "rgb(243, 39, 39)"
        const deleteExitBtn = deleteTitleDiv.querySelector(".exitBtn")
        deleteExitBtn.addEventListener("click", (e)=>{
            e.stopPropagation(); //Prevents projectDiv eventListener from triggering
            projectDiv.removeChild(deleteProjectGUI)
            modal.style.display = "none"
        })

        //Form body
        const deleteWarningDiv = createDeleteWarninMsg("project", projectName)

        //Form options
        const formActionBtnsDiv = createFormActionSection("Delete")
        const cancelBtn = formActionBtnsDiv.querySelector(".cancelBtn")
        cancelBtn.addEventListener("click", (e)=>{
            e.stopPropagation(); //Prevents projectDiv eventListener from triggering
            projectDiv.removeChild(deleteProjectGUI)
            homeOption.click()
            modal.style.display = "none"
        })
        const submitBtn = formActionBtnsDiv.querySelector(".submitBtn")
        submitBtn.addEventListener('click', (e)=>{
            e.stopPropagation(); //Prevents projectDiv eventListener from triggering
            deleteProjectFromSideBarGUI(projectDiv)
            projectDiv.removeChild(deleteProjectGUI)
            homeOption.setAttribute("id", "selecetedOption")
            homeOption.click()
            modal.style.display = "none"
        })

        deleteProjectGUI.appendChild(deleteTitleDiv)
        deleteProjectGUI.appendChild(deleteWarningDiv)
        deleteProjectGUI.appendChild(formActionBtnsDiv)
        projectDiv.appendChild(deleteProjectGUI)
        deleteProjectGUI.style.display = "block"
    }
    const deleteProjectFromSideBarGUI = (projectDivToDelete)=>{
        //Delete project form frontend and backend
        const projectsContainer = document.querySelector(".projectsContainer")
        const projectTitle = projectDivToDelete.querySelector(".projectNameP").textContent
        projectsContainer.removeChild(projectDivToDelete)
        newProjectList.deleteProject(projectDivToDelete.getAttribute("data-state"))
        
        for(let i=0; i<allTasksList.getListLength(); i++){
            if(allTasksList.searchTask(i).getTaskSource === projectTitle){
                allTasksList.deleteTask(i)
                i-- //Account for shifted indexes after deletion
            }
        }
        updateNumProjectsGUI()
        
        let projectGUIIndex = 0;
        const projects = projectsContainer.querySelectorAll(".projectDiv")
        projects.forEach(project => {
            project.setAttribute("data-state", projectGUIIndex)
            projectGUIIndex++
        });
    }
    return{displayAddProjectGUI, displayProjectGUI, updateNumProjectsGUI, createProjectSideBarGUI, displayDeleteProjectGUI}
})()

/******************** HELPER FUNCTIONS *********************/
const formatTaskDate = (dueDate, currentFormat, newFormat)=>{
    if(dueDate === "No due date"){
        return dueDate
    }
    const date = parse(dueDate, currentFormat, new Date()) 
    const formattedDate = format(date, newFormat)
    return formattedDate
}
const swtichTaskHeaderContent = (optionElement)=>{
    const selecetedOption = optionElement.textContent
    let taskHeaderSection = document.querySelector(".taskHeaderSection")
    toDoMainContent.removeChild(taskHeaderSection)
    taskHeaderSection = loadTaskHeaderSection(selecetedOption)
    toDoMainContent.insertBefore(taskHeaderSection, toDoListDiv)
    
    toDoListDiv.textContent = ""

    //Update tab title and icon
    let optionIcon = optionElement.querySelector("img")
    let optionIconSrc = optionIcon.getAttribute("src")
    const tabIcon = document.querySelector(".tabIcon")
    tabIcon.setAttribute("src", optionIconSrc)
    const tabTitle = document.querySelector(".tabTitle")
    tabTitle.textContent = selecetedOption
}

const mergeTaskLists = (taskList, projectList) =>{
    const allTasks = new ToDoList("", "general", "")
    const taskListDeepCopyJSON = JSON.parse(JSON.stringify(taskList))
    let taskListDeepCopyList = new ToDoList(taskListDeepCopyJSON.list, taskListDeepCopyJSON.listTitle, "")
    for(let i=0; i<taskListDeepCopyList.getListLength(); i++){
        allTasks.addTask(taskListDeepCopyList.searchTask(i))
    }

    for(let i=0; i<projectList.getProjectListLength(); i++){
        const projectTaskListDeepCopyJSON = JSON.parse(JSON.stringify(projectList.searchForProjectByIndex(i)))
        let projectListDeepCopyList = new ToDoList(projectTaskListDeepCopyJSON.list, projectTaskListDeepCopyJSON.listTitle, "")
        for(let j=0; j<projectListDeepCopyList.getListLength(); j++){
            allTasks.addTask(projectListDeepCopyList.searchTask(j))
        }
    }
    return allTasks
}
/******************** HELPER FUNCTIONS *********************/

/******************** LOCAL STORAGE FUNCTIONS *********************/
const storeToDoListInStorage = (toDoListToBeStored, toDoListTitle)=>{
    localStorage.setItem(toDoListTitle, JSON.stringify(toDoListToBeStored))
    console.log("toDoListToBeStored stringify: " + JSON.stringify(toDoListToBeStored))
}
const deleteTaskFromStorage = (toDoList, toDoListTitle, taskIndex)=>{
    let dataJSON = retrieveDataFromLocalStorage(toDoListTitle)
    let retrievedToDoList = dataJSON.list
    retrievedToDoList.splice(taskIndex, 1)
    for(let i=0; i<retrievedToDoList.length; i++){
        retrievedToDoList[i].taskIndex = i
    }
    storeToDoListInStorage(dataJSON, dataJSON.listTitle)
}
const retrieveDataFromLocalStorage = (itemKey) =>{
    let stringData = localStorage.getItem(itemKey)
    if(stringData == null){
        return null
    }
    return JSON.parse(stringData)
}
/******************** LOCAL STORAGE FUNCTIONS *********************/

//Dynamic portion that will be below task header
let toDoMainContent = document.querySelector(".toDoMainContent") 
let toDoListDiv = document.querySelector(".toDoListDiv") //Container to hold tasks

let tabName = ""  //Allow us to know which tab we're in so we can update newList or the newProjectList correctly
let currentProjectIndex = ""  //Helps us find the current project we are on in newProjectList

let newList = new ToDoList("","general", "")  //New array to store task objects
let newProjectList = new Project() //New array to hold a list of projects, each containing a list of ToDoList objects
// newList.createNewTask("Task A", "dsadas", "2023-07-12", "Low", newList.getToDoListTitle)
// newList.createNewTask("Task B", "dsadas", "2023-07-14", "Low", newList.getToDoListTitle)
// newList.createNewTask("Task C", "dsadas", "2023-07-15", "Low", newList.getToDoListTitle)
// newList.createNewTask("Task D", "dsadas", "2023-07-16", "Low", newList.getToDoListTitle)

// const firstNewList = new ToDoList("Project 1")
// firstNewList.createNewTask("Task AP1", "dsadas", "2023-07-12", "Low", firstNewList.getToDoListTitle) 
// firstNewList.createNewTask("Task AP2", "dsadas", "2023-07-14", "Low", firstNewList.getToDoListTitle) 
// firstNewList.createNewTask("Task AP3", "dsadas", "2023-07-15", "Low", firstNewList.getToDoListTitle) 
// firstNewList.createNewTask("Task AP4", "dsadas", "2023-07-16", "Low", firstNewList.getToDoListTitle)  
// newProjectList.addProject(firstNewList)
// const projectsContainer = document.querySelector(".projectsContainer")
// projectsContainer.appendChild(projectGUI.createProjectSideBarGUI("Project 1", newProjectList))

// const secondNewList = new ToDoList("Project 2")
// secondNewList.createNewTask("Task 1", "dsadas", "2023-07-12", "Low", secondNewList.getToDoListTitle)  
// secondNewList.createNewTask("Task 2", "dsadas", "2023-07-14", "Low", secondNewList.getToDoListTitle)  
// secondNewList.createNewTask("Task 3", "dsadas", "2023-07-15", "Low", secondNewList.getToDoListTitle)  
// secondNewList.createNewTask("Task 4", "dsadas", "2023-07-16", "Low", secondNewList.getToDoListTitle)  
// newProjectList.addProject(secondNewList)
// projectsContainer.appendChild(projectGUI.createProjectSideBarGUI("Project 2", newProjectList))
// projectGUI.updateNumProjectsGUI()

//Indicate we are on the home page
const homeOption = document.querySelector(".optionDiv")
homeOption.setAttribute("id", "selecetedOption")

//Load saved tasks
let allTasks
if(localStorage.length === 0){
}else{
    for(let i=0; i<localStorage.length; i++){
        let toDoListJSON = retrieveDataFromLocalStorage(localStorage.key(i))
        if(toDoListJSON == null){
        }else{
            if(toDoListJSON.listTitle === "general"){
                newList = new ToDoList(toDoListJSON.list, toDoListJSON.listTitle)
                //GUI.displayListOfTasksGUI(newList, "home")    
            }else{
                let newProjectToDoList = new ToDoList(toDoListJSON.list, toDoListJSON.listTitle, toDoListJSON.listIndex)
                newProjectList.addProject(newProjectToDoList)
                //GUI.displayListOfTasksGUI(newProjectToDoList, "home")    
                const projectsContainer = document.querySelector(".projectsContainer")
                projectsContainer.appendChild(projectGUI.createProjectSideBarGUI(newProjectToDoList.getToDoListTitle, newProjectList))
            }
            console.log("LALALA: " + toDoListJSON.list[0])
        }
    } 
}
allTasks = mergeTaskLists(newList, newProjectList)
GUI.displayListOfTasksGUI(allTasks, "home")   




    // let toDoListJSON = retrieveDataFromLocalStorage(newList.getToDoListTitle)
    // if(toDoListJSON == null){
    // }else{
    //     console.log("LALALA: " + toDoListJSON.list[0])
    //     newList = new ToDoList(toDoListJSON.list, toDoListJSON.listTitle)
    //     GUI.displayListOfTasksGUI(newList, "home")
    // }

    // let projectListJSON = retrieveDataFromLocalStorage(newList.getToDoListTitle)
    // if(projectListJSON == null){
    // }else{
    //     for(let i=0; i<projectListJSON.list.length; i++){
    //         let newProject = new ToDoList(projectListJSON.list[i].list, )
    //         GUI.displayListOfTasksGUI(newProject, "home")
    //     }
    // }

GUI.updateNumTasksGUI()

//FORM HANDLING FOR ADDING TASKS
const submitBtn = document.querySelector(".submitBtn")
submitBtn.addEventListener("click", (e)=>{
    if(submitBtn.textContent = "Add"){
        const taskTitle = document.getElementById("title").value
        const taskDescr = document.getElementById("description").value
        const taskDueDate = document.getElementById("due_date").value
        const taskPriority = document.getElementById("priority").value

        if(tabName === "Project"){ //Add to project's todo list
            const newToDoList = newProjectList.searchForProjectByIndex(currentProjectIndex)
            newToDoList.createNewTask(taskTitle, taskDescr, taskDueDate, taskPriority, newToDoList.getToDoListTitle)
            storeToDoListInStorage(newToDoList, newToDoList.getToDoListTitle)
            let currentListIndex = newToDoList.getListLength()-1
            toDoListDiv.appendChild(GUI.displayTaskGUI(currentListIndex, newToDoList))
        }else{ //Add tasks to general todo list
            allTasks.createNewTask(taskTitle, taskDescr, taskDueDate, taskPriority, allTasks.getToDoListTitle)
            newList.createNewTask(taskTitle, taskDescr, taskDueDate, taskPriority, newList.getToDoListTitle)
            storeToDoListInStorage(allTasks, allTasks.getToDoListTitle)
            let currentListIndex = allTasks.getListLength()-1
            toDoListDiv.appendChild(GUI.displayTaskGUI(currentListIndex, allTasks))
        }
        GUI.updateNumTasksGUI() 
        closeForm()
        e.preventDefault();  //Prevents form from sending data to backend by default
    }
})

//PAGE SWITCH HANDLING
const mainSidebarOptions = document.querySelectorAll(".optionDiv")
mainSidebarOptions.forEach(option => {
    option.addEventListener("click", ()=>{
        tabName = option.textContent
        const selecetedOption = option.textContent.toLocaleLowerCase()
        //Change page and style option to indicate that
        swtichTaskHeaderContent(option)
        const selectedDiv = document.querySelectorAll("#selecetedOption")
        selectedDiv.forEach(div => {
            div.removeAttribute("id")
        });
        option.setAttribute("id", "selecetedOption")   
        
        const allTasksList = mergeTaskLists(newList, newProjectList)//update list
        GUI.displayListOfTasksGUI(allTasksList, selecetedOption)
        GUI.updateNumTasksGUI()
    })
});

//PROJECT SECTION
const addProjectBtn = document.querySelector(".addProjectBtn")
addProjectBtn.addEventListener("click", ()=>{
    modal.style.display = "block"
    projectGUI.displayAddProjectGUI()
})

