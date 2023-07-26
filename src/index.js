import "./Styles/style.css"
import {ToDoList} from "./List.js" 
import { Project } from "./Projects"
import EditIcon from "./Assets/Edit.png"
import DeleteIcon from "./Assets/Delete.png"
import InfoIcon from "./Assets/Info.png"
import ProjectIcon from "./Assets/Project.png"
import { loadPage, loadTaskHeaderSection} from "./loadPage"
import { createAnElement, createAnImg, createInput, createForm, closeForm, createFormActionSection, createFormTitleSection, createProjectForm, createDeleteWarninMsg} from "./formAndElements"
import uniqid from 'uniqid';
import {format, parse} from "date-fns"

//Load the constant part of page (header, sidebar, and some of body)
const content = document.querySelector("#content")
const pageContent = loadPage()
content.appendChild(pageContent)
const modal = document.querySelector('.modal')

/******************** GUI FUNCTIONS *********************/
const GUI = (()=>{
    const createTaskGUI = (lastIndexInList, taskList)=>{ //Creates the GUI to display a tasj and its information
        const currentTask = taskList.searchTaskByIndex(lastIndexInList) 
        const addedTaskID = currentTask.getTaskID
        const taskContainer = createAnElement("div", "taskContainer")
        taskContainer.setAttribute("data-state", lastIndexInList)  //Link each GUI task to console task stored in newList
    
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
            displayEditTaskGUI(taskContainer, addedTaskID, taskList)            
        })
        const deleteIcon = createAnImg(DeleteIcon, "taskOptionIcon")
        deleteIcon.addEventListener("click", ()=>{
            modal.style.display = "block"
            createDeleteGUI(currentTask.getTaskName, taskContainer, addedTaskID, taskList)
        })
        const infoIcon = createAnImg(InfoIcon, "taskOptionIcon")
        infoIcon.addEventListener("click", ()=>{
            displayTaskInformation(currentTask, taskContainer)
            modal.style.display = "block"
        })
        rightTaskSideDiv.appendChild(editIcon)
        rightTaskSideDiv.appendChild(deleteIcon)
        rightTaskSideDiv.appendChild(infoIcon)
    
        completedCheckCircle.addEventListener("click", ()=>{
            GUI.displayTaskStatus(completedCheckCircle, taskNameP)
            if(currentTask.getTaskSource !== "general"){
                const toDoList = newProjectList.searchForProjectByID(currentTask.getTaskSource)
                toDoList.updateTaskStatus(addedTaskID)
                storeToDoListInStorage(toDoList, toDoList.getToDoListID)
            }else{
                newList.updateTaskStatus(addedTaskID)
                storeToDoListInStorage(newList, newList.getToDoListID)
            }
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

    const displayEditTaskGUI = (currentTaskContainer, addedTaskID, taskList)=>{  //Displays the form to allow user to edit task
        const editForm = createForm("Edit Task", "Edit")
        editForm.setAttribute('id', "EditForm")
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
                const toDoList = newProjectList.searchForProjectByID(currentTask.getTaskSource)
                toDoList.updateTaskInfo(taskTitle, taskDescr, taskDueDate, taskPriority, addedTaskID)  //Update Array
                storeToDoListInStorage(toDoList, toDoList.getToDoListID)

            }else{
                newList.updateTaskInfo(taskTitle, taskDescr, taskDueDate, taskPriority, addedTaskID)  //Update Array
                storeToDoListInStorage(newList, newList.getToDoListID)
            }
            if(tabName !== "Project"){
                //Update merged taskList
                taskList.updateTaskInfo(taskTitle, taskDescr, taskDueDate, taskPriority, addedTaskID) 
            }
            console.log(newList)
            console.log(newProjectList)
            console.log(taskList)
            updateTaskGUI(currentTaskContainer, taskTitle, taskDueDate)  //Update task GUI

            closeForm()
            currentTaskContainer.removeChild(editForm)
            e.preventDefault();
        })
        currentTaskContainer.appendChild(editForm)

        //Give form current task values for user to edit
        let currentTask = taskList.searchTaskByUniqueID(addedTaskID)
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
    const createDeleteGUI = (taskName, taskContainer, addedTaskID, taskList)=>{
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
            const currentTask = taskList.searchTaskByUniqueID(addedTaskID)
            const currentTaskSource = currentTask.getTaskSource
            if(currentTaskSource !== "general"){
                const projectToDoList = newProjectList.searchForProjectByID(currentTaskSource)
                deleteTaskFromStorage(projectToDoList.getToDoListID, addedTaskID)
                projectToDoList.deleteTask(addedTaskID)
            }else{
                deleteTaskFromStorage(newList.getToDoListID, addedTaskID)
                newList.deleteTask(addedTaskID)
            }
            if(tabName !== "Project"){
                //Update merged taskList
                taskList.deleteTask(addedTaskID)
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
    const displayTaskInformation = (currentTask, currentTaskContainer)=>{  //Displays GUI for user to see task overcview
        const infoContainer = createAnElement("div", "infoContainer")
        const infoTitleDiv = createFormTitleSection("Task Overview")
        const infoExitBtn = infoTitleDiv.querySelector(".exitBtn")
        infoExitBtn.addEventListener("click", ()=>{
            currentTaskContainer.removeChild(infoContainer)
            modal.style.display = "none"
        })
        
        const infoSectionDiv = createAnElement("div", "infoSectionDiv")
        const infoCardTitles = ["Title" , "Description", "Due date", "Priority",  "Completion Status"]
        const infoCardContent = [currentTask.getTaskName, currentTask.getTaskDescr, currentTask.getDuedate, currentTask.getPriorityLevel, currentTask.getCompletionState]
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
            const newToDoList = new ToDoList("", projectTitle, uniqid())  //Create new list for project
            newProjectList.addProject(newToDoList)
            storeToDoListInStorage(newToDoList, newToDoList.getToDoListID)
            
            //Update frontend
            const newProject = createProjectSideBarGUI(projectTitle, newProjectList, newToDoList.getToDoListID)
            projectsContainer.appendChild(newProject)
            updateNumProjectsGUI()
            newProject.click()
            closeForm()
            content.removeChild(addProjectForm)
        })
        addProjectForm.style.display = "block"
    }
    const createProjectSideBarGUI = (projectName, projectList, addedProjectID) =>{
        const projectDiv = createAnElement("div", "projectDiv")
        projectDiv.setAttribute("id", "unselectedOption")
        projectDiv.addEventListener("click", (e)=>{
            if(!e.target.closest("#deleteProjectGUI")) {  //Prevents div from being clicked if user clicks delete form body
                const styledOptionDiv = document.querySelector("#selecetedOption")
                styledOptionDiv.removeAttribute("id")
                projectDiv.setAttribute("id", "selecetedOption")
                tabName = "Project"
                displayProjectGUI(projectDiv, projectList, addedProjectID)
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
            displayEditProjectGUI(projectDiv, addedProjectID)
        })
        const deleteIcon = createAnImg(DeleteIcon, "projectIcon")
        deleteIcon.addEventListener("click", (e)=>{
            e.stopPropagation(); //Prevents projectDiv eventListener from triggering
            modal.style.display = "block"
            displayDeleteProjectGUI(projectDiv, projectName, addedProjectID)
        })
        rightSideDiv.appendChild(editIcon)
        rightSideDiv.appendChild(deleteIcon)
    
        projectDiv.appendChild(leftSideDiv)
        projectDiv.appendChild(rightSideDiv)
        return projectDiv
    }
    const displayProjectGUI = (project, projectList, addedProjectID)=>{ 
        swtichTaskHeaderContent(project)
        const projectToDoList = projectList.searchForProjectByID(addedProjectID)
        for(let i=0; i<projectToDoList.getListLength(); i++){
            toDoListDiv.appendChild(GUI.displayTaskGUI(i, projectToDoList))
        }
        GUI.updateNumTasksGUI()
    }
    const displayEditProjectGUI = (projectDiv, projectListID)=>{
        const projectDivTitle = projectDiv.querySelector(".projectNameP")
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

            const toDoList = newProjectList.searchForProjectByID(projectListID)
            toDoList.setToDoListTitle = newProjectTitle  
            storeToDoListInStorage(toDoList, toDoList.getToDoListID)
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
    const displayDeleteProjectGUI = (projectDiv, projectName, addedProjectID)=>{  //deleteType = task or project and deleteTypeName = task/project name
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
            deleteProjectFromSideBarGUI(projectDiv, addedProjectID)
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
    const deleteProjectFromSideBarGUI = (projectDivToDelete, addedProjectID)=>{
        //Delete project form frontend and backend
        const projectsContainer = document.querySelector(".projectsContainer")
        projectsContainer.removeChild(projectDivToDelete)
        let toDoListToBeDeleted = newProjectList.searchForProjectByIndex(projectDivToDelete.getAttribute("data-state"))
        newProjectList.deleteProject(projectDivToDelete.getAttribute("data-state"))
        localStorage.removeItem(toDoListToBeDeleted.getToDoListID)
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
    const allTasks = new ToDoList("", "general", "general")
    for(let i=0; i<taskList.getListLength(); i++){
        allTasks.addTask(taskList.searchTaskByIndex(i))
    }

    for(let i=0; i<projectList.getProjectListLength(); i++){
        let project = projectList.searchForProjectByIndex(i)
        for(let j=0; j<project.getListLength(); j++){
            allTasks.addTask(project.searchTaskByIndex(j))
        }
    }
    return allTasks
}
/******************** HELPER FUNCTIONS *********************/

/******************** LOCAL STORAGE FUNCTIONS *********************/
const storeToDoListInStorage = (toDoListToBeStored, toDoListID)=>{
    localStorage.setItem(toDoListID, JSON.stringify(toDoListToBeStored))
}
const deleteTaskFromStorage = (toDoListID, taskToBeDeletedID)=>{
    let dataJSON = retrieveDataFromLocalStorage(toDoListID)
    let retrievedToDoList = dataJSON.list
    for(let i=0; i<retrievedToDoList.length; i++){
        if(retrievedToDoList[i].taskID === taskToBeDeletedID){
            retrievedToDoList.splice(i, 1)
            break;
        }
    }
    storeToDoListInStorage(dataJSON, dataJSON.listID)
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

let newList = new ToDoList("","general", "general")  //New array to store task objects
let newProjectList = new Project() //New array to hold a list of projects, each containing a list of ToDoList objects

//Indicate we are on the home page
const homeOption = document.querySelector(".optionDiv")
homeOption.setAttribute("id", "selecetedOption")

//Load saved tasks
let allTasks = new ToDoList("", "general", "general")
if(localStorage.length === 0){
}else{
    for(let i=0; i<localStorage.length; i++){
        let toDoListJSON = retrieveDataFromLocalStorage(localStorage.key(i))
        if(toDoListJSON == null){
        }else{
            if(toDoListJSON.listID === "general"){
                newList = new ToDoList(toDoListJSON.list, "general", "general")
            }else{
                let newProjectToDoList = new ToDoList(toDoListJSON.list, toDoListJSON.listTitle, toDoListJSON.listID)
                newProjectList.addProject(newProjectToDoList)
                const projectsContainer = document.querySelector(".projectsContainer")
                projectsContainer.appendChild(projectGUI.createProjectSideBarGUI(newProjectToDoList.getToDoListTitle, newProjectList, newProjectToDoList.getToDoListID))
            }
        }
    } 
}
allTasks = mergeTaskLists(newList, newProjectList)
GUI.displayListOfTasksGUI(allTasks, "home")   
GUI.updateNumTasksGUI()
projectGUI.updateNumProjectsGUI()

//FORM HANDLING FOR ADDING TASKS
const submitBtn = document.querySelector(".submitBtn")
submitBtn.addEventListener("click", (e)=>{
    if(submitBtn.textContent = "Add"){
        const taskTitle = document.getElementById("title").value
        const taskDescr = document.getElementById("description").value
        const taskDueDate = document.getElementById("due_date").value
        const taskPriority = document.getElementById("priority").value

        if(tabName === "Project"){ //Add to project's todo list
            const currentProjectIndex = document.querySelector("#selecetedOption").getAttribute("data-state")
            const newToDoList = newProjectList.searchForProjectByIndex(currentProjectIndex)
            let currentListIndex = newToDoList.getListLength()
            const newTask = newToDoList.createNewTask(taskTitle, taskDescr, taskDueDate, taskPriority, newToDoList.getToDoListID)
            newToDoList.addTask(newTask)
            storeToDoListInStorage(newToDoList, newToDoList.getToDoListID)
            toDoListDiv.appendChild(GUI.displayTaskGUI(currentListIndex, newToDoList))
        }else{ //Add tasks to general todo list
            let currentListIndex = allTasks.getListLength()
            const newTask = allTasks.createNewTask(taskTitle, taskDescr, taskDueDate, taskPriority, allTasks.getToDoListID)
            allTasks.addTask(newTask)
            newList.addTask(newTask)
            storeToDoListInStorage(newList, newList.getToDoListID)
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

