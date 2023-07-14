import "./Styles/style.css"
import {ToDoList} from "./List.js" 
import { Project } from "./Projects"
import EditIcon from "./Assets/Edit.png"
import DeleteIcon from "./Assets/Delete.png"
import InfoIcon from "./Assets/Info.png"
import ProjectIcon from "./Assets/Project.png"
import { loadPage, loadTaskHeaderSection} from "./loadPage"
import { createAnElement, createAnImg, createInput, createForm, createFormField, closeForm, createFormActionSection, createFormTitleSection } from "./formAndElements"
import {format, parse} from "date-fns"

//Load the constant part of page (header, sidebar, and some of body)
const content = document.querySelector("#content")
const pageContent = loadPage()
content.appendChild(pageContent)
const modal = document.querySelector('.modal')

/******************** GUI FUNCTIONS *********************/
const GUI = (()=>{
    const createTaskGUI = (currentListIndex, taskList)=>{ //Creates the GUI to display a tasj and its information
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
            displayEditTaskGUI(currentListIndex, taskContainer, taskList)            
        })
        const deleteIcon = createAnImg(DeleteIcon, "taskOptionIcon")
        deleteIcon.addEventListener("click", ()=>{
            modal.style.display = "block"
            createDeleteGUI(currentTask.getTaskName, taskContainer, taskList)
        })
        const infoIcon = createAnImg(InfoIcon, "taskOptionIcon")
        infoIcon.addEventListener("click", ()=>{
            modal.style.display = "block"
            GUI.displayTaskInformation(taskList.searchTask(taskContainer.getAttribute("data-state")), taskContainer)
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
            taskList.updateTaskInfo(taskTitle, taskDescr, taskDueDate, taskPriority, currentTaskIndex)  //Update Array
            updateTaskGUI(currentTaskContainer, taskTitle, taskDueDate)  //Update task GUI

            closeForm()
            currentTaskContainer.removeChild(editForm)
            e.preventDefault();
        })
        currentTaskContainer.appendChild(editForm)

        //Give form current task values for user to edit
        let currentTask = taskList.searchTask(currentTaskIndex)
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
        const deleteWarningDiv = createAnElement("div", "deleteWarningDiv")
        const deleteQuestionP = createAnElement("p", "deleteQuestionP")
        deleteQuestionP.textContent = "Are you sure?"
        const deleteWarningMsgDiv = createAnElement("div", "deleteWarningMsgDiv")
        const deleteWarningMsgP1 = createAnElement("p", "deleteWarningMsgP1")
        deleteWarningMsgP1.textContent = "Task"
        const taskNameP = createAnElement("p", "taskNameSpan")
        taskNameP.textContent = taskName 
        const deleteWarningMsgP2 = createAnElement("p", "deleteWarningMsgP2")
        deleteWarningMsgP2.textContent = "will be gone forever!"
        deleteWarningMsgDiv.appendChild(deleteWarningMsgP1)
        deleteWarningMsgDiv.appendChild(taskNameP)
        deleteWarningMsgDiv.appendChild(deleteWarningMsgP2)

        deleteWarningDiv.appendChild(deleteQuestionP)
        deleteWarningDiv.appendChild(deleteWarningMsgDiv)

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
        const addProjectFrom = createAnElement("div", "popUpForm")
        addProjectFrom.setAttribute("id", "addProjectFrom")

        //Top of form
        const projectitleDiv = createFormTitleSection("Add A Project")
        const exitBtn = projectitleDiv.querySelector(".exitBtn")
        exitBtn.textContent = "x"
        exitBtn.addEventListener("click", ()=>{
            content.removeChild(addProjectFrom)
            modal.style.display = "none"
        })

        const formContainer = createAnElement("div", "formContainer")
        const newProjectForm = createAnElement("form", "form")
        const projectTitleSection = createFormField("Title", "text")
        newProjectForm.appendChild(projectTitleSection)
        formContainer.appendChild(newProjectForm)

        const formActionBtnsDiv = createFormActionSection("Add")
        const cancelBtn = formActionBtnsDiv.querySelector(".cancelBtn")
        cancelBtn.addEventListener("click", ()=>{
            content.removeChild(addProjectFrom)
            modal.style.display = "none"
        })

        const submitBtn = formActionBtnsDiv.querySelector(".submitBtn")
        submitBtn.addEventListener('click', ()=>{
            //Update project list
            const projectTitle = formContainer.querySelector("#title").value
            const newToDoList = new ToDoList()  //Create new list for project
            newProjectList.addProject(newToDoList)

            //Update frontend
            const newProject = createProjectSideBarGUI(projectTitle, newProjectList)
            projectsContainer.appendChild(newProject)
            updateNumProjectsGUI()
            newProject.click()
            closeForm()
            content.removeChild(addProjectFrom)
        })

        addProjectFrom.appendChild(projectitleDiv)
        addProjectFrom.appendChild(formContainer)
        addProjectFrom.appendChild(formActionBtnsDiv)
        content.appendChild(addProjectFrom)
        addProjectFrom.style.display = "block"
    }
    const createProjectSideBarGUI = (projectName, projectList) =>{
        const projectDiv = createAnElement("div", "projectDiv")
        projectDiv.setAttribute("id", "unselectedOption")
        projectDiv.addEventListener("click", ()=>{
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

        })
        const deleteIcon = createAnImg(DeleteIcon, "projectIcon")
        rightSideDiv.appendChild(editIcon)
        rightSideDiv.appendChild(deleteIcon)
    
        projectDiv.appendChild(leftSideDiv)
        projectDiv.appendChild(rightSideDiv)
        return projectDiv
    }
    const displayProjectGUI = (project, projectList)=>{ 
        swtichTaskHeaderContent(project)
        const projectIndex = project.getAttribute("data-state")
        console.log(projectIndex)
        console.log("HEEEEYYY")
        const projectToDoList = projectList.searchForProject(projectIndex)
        projectList.printProjectNames()
        for(let i=0; i<projectToDoList.getListLength(); i++){
            toDoListDiv.appendChild(GUI.displayTaskGUI(i, projectToDoList))
        }
    }
    const updateNumProjectsGUI = ()=>{
        const numProjectsP = document.querySelector(".numProjeccts")
        const numProjects = newProjectList.getProjectListLength()
        numProjectsP.textContent = `(${numProjects})`
    }
    const displayProjectTasksGUI = (newProjectList)=>{
        for(let i=0; i<newProjectList.getProjectListLength(); i++){
            let project = newProjectList.searchForProject(i)
            for(let j=0; j<project.getListLength(); j++){
                GUI.displayTaskGUI(j, project)
            }
        }
    }
    return{displayAddProjectGUI, displayProjectGUI, updateNumProjectsGUI, createProjectSideBarGUI, displayProjectTasksGUI}
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
const addTask = (newToDoList, taskTitle, taskDescr, taskDueDate, taskPriority)=>{  //Add task to frontend and backend
    newToDoList.createNewTask(taskTitle, taskDescr, taskDueDate, taskPriority)   //Store values in specified todo list
    let currentListIndex = newToDoList.getListLength()-1
    toDoListDiv.appendChild(GUI.displayTaskGUI(currentListIndex, newToDoList)) //Create GUI for task
    GUI.updateNumTasksGUI() 
}
/******************** HELPER FUNCTIONS *********************/

//Dynamic portion that will be below task header
let toDoMainContent = document.querySelector(".toDoMainContent") 
let toDoListDiv = document.querySelector(".toDoListDiv") //Container to hold tasks

let tabName = ""  //Allow us to know which tab we're in so we can update newList or the newProjectList correctly
let currentProjectIndex = ""  //Helps us find the current project we are on in newProjectList

const newList = new ToDoList()  //New array to store task objects
const newProjectList = new Project() //New array to hold a list of projects, each containing a list of ToDoList objects
newList.createNewTask("Task A", "dsadas", "2023-07-12", "Low") 
toDoListDiv.appendChild(GUI.displayTaskGUI(0, newList)) //Create GUI for task
newList.createNewTask("Task B", "dsadas", "2023-07-14", "Low") 
toDoListDiv.appendChild(GUI.displayTaskGUI(1, newList)) //Create GUI for task
newList.createNewTask("Task C", "dsadas", "2023-07-15", "Low") 
toDoListDiv.appendChild(GUI.displayTaskGUI(2, newList)) //Create GUI for task
newList.createNewTask("Task D", "dsadas", "2023-07-16", "Low") 
toDoListDiv.appendChild(GUI.displayTaskGUI(3, newList)) //Create GUI for task
GUI.updateNumTasksGUI()

const firstNewList = new ToDoList()
firstNewList.createNewTask("Task AP1", "dsadas", "2023-07-12", "Low") 
firstNewList.createNewTask("Task AP2", "dsadas", "2023-07-14", "Low") 
firstNewList.createNewTask("Task AP3", "dsadas", "2023-07-15", "Low") 
firstNewList.createNewTask("Task AP4", "dsadas", "2023-07-16", "Low") 
newProjectList.addProject(firstNewList)
const projectsContainer = document.querySelector(".projectsContainer")
projectsContainer.appendChild(projectGUI.createProjectSideBarGUI("Project 1", newProjectList))

const secondNewList = new ToDoList()
secondNewList.createNewTask("Task 1", "dsadas", "2023-07-12", "Low") 
secondNewList.createNewTask("Task 2", "dsadas", "2023-07-14", "Low") 
secondNewList.createNewTask("Task 3", "dsadas", "2023-07-15", "Low") 
secondNewList.createNewTask("Task 4", "dsadas", "2023-07-16", "Low") 
newProjectList.addProject(secondNewList)
projectsContainer.appendChild(projectGUI.createProjectSideBarGUI("Project 2", newProjectList))
projectGUI.updateNumProjectsGUI()

//Indicate we are on the home page
const homeOption = document.querySelector(".optionDiv")
homeOption.setAttribute("id", "selecetedOption")

//Load saved tasks
GUI.displayListOfTasksGUI(newList, "home")
for(let i=0; i<newProjectList.getProjectListLength(); i++){
    let project = newProjectList.searchForProject(i)
    GUI.displayListOfTasksGUI(project, "home")
}

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
            addTask(newToDoList, taskTitle, taskDescr, taskDueDate, taskPriority)
            console.log("PRINTING. . . ")
            newProjectList.printProjectNames()
            console.log("PRINTING NEWLIST. . . ")
            newList.printTasks()
        }else{ //Add tasks to general todo list
            console.log("HEEE")
            addTask(newList, taskTitle, taskDescr, taskDueDate, taskPriority)
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
        const selectedDiv = document.querySelector("#selecetedOption")
        selectedDiv.removeAttribute("id")
        option.setAttribute("id", "selecetedOption")   

        GUI.displayListOfTasksGUI(newList, selecetedOption)
        for(let i=0; i<newProjectList.getProjectListLength(); i++){
            let project = newProjectList.searchForProject(i)
            GUI.displayListOfTasksGUI(project, selecetedOption)
        }
        GUI.updateNumTasksGUI()
    })
});

//PROJECT SECTION
const addProjectBtn = document.querySelector(".addProjectBtn")
addProjectBtn.addEventListener("click", ()=>{
    modal.style.display = "block"
    projectGUI.displayAddProjectGUI()
})

