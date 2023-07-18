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
    const createTaskGUI = (currentListIndex, taskList)=>{ //Creates the GUI to display a tasj and its information
        console.log("CURRENT LIST INDEX: " + currentListIndex)
        const taskContainer = createAnElement("div", "taskContainer")
        taskContainer.setAttribute("data-state", currentListIndex)  //Link each GUI task to console task stored in newList
        const currentTask = taskList.searchTask(currentListIndex) 
    
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
            console.log("EDIT TASK CONTAINER INDEX: " + taskContainer.getAttribute("data-state"))
            console.log("EDIT CURR TASK INDEX: " + currentTask.getTaskIndex)
            displayEditTaskGUI(currentTask.getTaskIndex, taskContainer, taskList)            
        })
        const deleteIcon = createAnImg(DeleteIcon, "taskOptionIcon")
        deleteIcon.addEventListener("click", ()=>{
            console.log("TASK CONTAINER INDEX: " + taskContainer.getAttribute("data-state"))
            console.log("CURR TASK INDEX: " + currentTask.getTaskIndex)
            modal.style.display = "block"
            createDeleteGUI(currentTask.getTaskName, taskContainer, taskList)
        })
        const infoIcon = createAnImg(InfoIcon, "taskOptionIcon")
        infoIcon.addEventListener("click", ()=>{
            if(tabName === "Project"){
                displayTaskInformation(taskList.searchTask(taskContainer.getAttribute("data-state")), taskContainer)
            }else{
                //We use currentTask to ensure project tasks correspond correctly to their list
                displayTaskInformation(taskList.searchTask(currentTask.getTaskIndex), taskContainer)
            }
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
    
    const displayTaskGUI = (currentListIndex, taskList)=>{
        return createTaskGUI(currentListIndex, taskList)
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
            let taskDueDate = editForm.querySelector("#due_date").value
            const taskPriority = editForm.querySelector("#priority").value

            if(currentTask.getPriorityLevel !== taskPriority){  //Prevent duplicate classes on element
                updatePriorityGUI(currentTaskContainer, currentTask.getPriorityLevel, taskPriority)
            }
            if(currentTask.getTaskSource !== "general"){
                const toDoList = newProjectList.searchForProjectByTitle(currentTask.getTaskSource)
                toDoList.updateTaskInfo(taskTitle, taskDescr, taskDueDate, taskPriority, currentTaskIndex)  //Update Array
            }else{
                newList.updateTaskInfo(taskTitle, taskDescr, taskDueDate, taskPriority, currentTaskIndex)  //Update Array
            }
            taskList.updateTaskInfo(taskTitle, taskDescr, taskDueDate, taskPriority, taskContainerIndex)  //Update merged array
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
            console.log("CURR: " + currentTaskSource)
            console.log("CUURENT TASK INDEX: " + currentTaskIndex)
            console.log("TASK CONT INDEX: " + taskContainer.getAttribute("data-state"))
            if(currentTaskSource !== "general"){
                const projectToDoList = newProjectList.searchForProjectByTitle(currentTaskSource)
                projectToDoList.deleteTask(currentTaskIndex)
                projectToDoList.updateTaskIdnicies()
            }else{
                newList.deleteTask(currentTaskIndex)
            }
            //Update merged taskList
            taskList.deleteTask(taskContainer.getAttribute("data-state"))
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
        taskDueDate.textContent = formatTaskDate(newTaskDueDate, "yyyy-MM-dd", "MM-dd-yyyy")
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
            console.log(taskList.searchTask(i))
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
            const newToDoList = new ToDoList(projectTitle)  //Create new list for project
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
            const styledOptionDiv = document.querySelector("#selecetedOption")
            styledOptionDiv.removeAttribute("id")
            projectDiv.setAttribute("id", "selecetedOption")

            currentProjectIndex = projectDiv.getAttribute("data-state")
            tabName = "Project"
            displayProjectGUI(projectDiv, projectList)
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
        const projectToDoList = projectList.searchForProject(projectIndex)
        projectList.printProjectNames()
        for(let i=0; i<projectToDoList.getListLength(); i++){
            toDoListDiv.appendChild(GUI.displayTaskGUI(i, projectToDoList))
        }
        GUI.updateNumTasksGUI()
    }
    const displayEditProjectGUI = (projectDiv)=>{
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
        projectsContainer.removeChild(projectDivToDelete)
        newProjectList.deleteProject(projectDivToDelete.getAttribute("data-state"))
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
    console.log("SELECTED OPTION: " + selecetedOption)
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
const addTask = (newToDoList, taskTitle, taskDescr, taskDueDate, taskPriority, taskSource)=>{  //Add task to frontend and backend
    newToDoList.createNewTask(taskTitle, taskDescr, taskDueDate, taskPriority, taskSource)   //Store values in specified todo list
    let currentListIndex = newToDoList.getListLength()-1
    toDoListDiv.appendChild(GUI.displayTaskGUI(currentListIndex, newToDoList)) //Create GUI for task
    GUI.updateNumTasksGUI() 
}
const mergeTaskLists = (taskList, projectList) =>{
    const allTasksList = new ToDoList()
    for(let i=0; i<taskList.getListLength(); i++){
        allTasksList.addTask(taskList.searchTask(i))
    }
    for(let i=0; i<projectList.getProjectListLength(); i++){
        const projectTaskList = projectList.searchForProject(i)
        for(let j=0; j<projectTaskList.getListLength(); j++){
            allTasksList.addTask(projectTaskList.searchTask(j))
        }
    }
    return allTasksList
}
/******************** HELPER FUNCTIONS *********************/

//Dynamic portion that will be below task header
let toDoMainContent = document.querySelector(".toDoMainContent") 
let toDoListDiv = document.querySelector(".toDoListDiv") //Container to hold tasks

let tabName = ""  //Allow us to know which tab we're in so we can update newList or the newProjectList correctly
let currentProjectIndex = ""  //Helps us find the current project we are on in newProjectList

const newList = new ToDoList("general")  //New array to store task objects
const newProjectList = new Project() //New array to hold a list of projects, each containing a list of ToDoList objects
newList.createNewTask("Task A", "dsadas", "2023-07-12", "Low", newList.getToDoListTitle)
newList.createNewTask("Task B", "dsadas", "2023-07-14", "Low", newList.getToDoListTitle)
newList.createNewTask("Task C", "dsadas", "2023-07-15", "Low", newList.getToDoListTitle)
newList.createNewTask("Task D", "dsadas", "2023-07-16", "Low", newList.getToDoListTitle)

const firstNewList = new ToDoList("Project 1")
firstNewList.createNewTask("Task AP1", "dsadas", "2023-07-12", "Low", firstNewList.getToDoListTitle) 
firstNewList.createNewTask("Task AP2", "dsadas", "2023-07-14", "Low", firstNewList.getToDoListTitle) 
firstNewList.createNewTask("Task AP3", "dsadas", "2023-07-15", "Low", firstNewList.getToDoListTitle) 
firstNewList.createNewTask("Task AP4", "dsadas", "2023-07-16", "Low", firstNewList.getToDoListTitle)  
newProjectList.addProject(firstNewList)
const projectsContainer = document.querySelector(".projectsContainer")
projectsContainer.appendChild(projectGUI.createProjectSideBarGUI("Project 1", newProjectList))

const secondNewList = new ToDoList("Project 2")
secondNewList.createNewTask("Task 1", "dsadas", "2023-07-12", "Low", secondNewList.getToDoListTitle)  
secondNewList.createNewTask("Task 2", "dsadas", "2023-07-14", "Low", secondNewList.getToDoListTitle)  
secondNewList.createNewTask("Task 3", "dsadas", "2023-07-15", "Low", secondNewList.getToDoListTitle)  
secondNewList.createNewTask("Task 4", "dsadas", "2023-07-16", "Low", secondNewList.getToDoListTitle)  
newProjectList.addProject(secondNewList)
projectsContainer.appendChild(projectGUI.createProjectSideBarGUI("Project 2", newProjectList))
projectGUI.updateNumProjectsGUI()

//Indicate we are on the home page
const homeOption = document.querySelector(".optionDiv")
homeOption.setAttribute("id", "selecetedOption")

//Load saved tasks
const allTasksList = mergeTaskLists(newList, newProjectList)//Make a list of all general and project tasks
allTasksList.printTasks()
GUI.displayListOfTasksGUI(allTasksList, "home")
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
            const newToDoList = newProjectList.searchForProject(currentProjectIndex)
            addTask(newToDoList, taskTitle, taskDescr, taskDueDate, taskPriority, newToDoList.getToDoListTitle)
            console.log("PRINTING. . . ")
            newProjectList.printProjectNames()
            console.log("PRINTING NEWLIST. . . ")
            newList.printTasks()
        }else{ //Add tasks to general todo list
            console.log("HEEE")
            addTask(newList, taskTitle, taskDescr, taskDueDate, taskPriority, newList.getToDoListTitle)
        }

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

