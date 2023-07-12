import "./Styles/style.css"
import {ToDoList} from "./List.js" 
import { Project } from "./Projects"
import EditIcon from "./Assets/Edit.png"
import DeleteIcon from "./Assets/Delete.png"
import InfoIcon from "./Assets/Info.png"
import ProjectIcon from "./Assets/Project.png"
import { loadPage, loadTaskHeaderSection} from "./loadPage"
import { createAnElement, createAnImg, createInput, createForm, createFormField, closeForm } from "./formAndElements"
import {format, parse} from "date-fns"

//Load the constant part of page (header, sidebar, and some of body)
const content = document.querySelector("#content")
const pageContent = loadPage()
content.appendChild(pageContent)
const modal = document.querySelector('.modal')

//Indicate we are on the home page
const homeOption = document.querySelector(".optionDiv")
homeOption.setAttribute("id", "selecetedOption")

//Dynamic portion that will be below task header
let toDoMainContent = document.querySelector(".toDoMainContent") 
let toDoListDiv = document.querySelector(".toDoListDiv") //Container to hold tasks

const newList = new ToDoList()  //New array to store task objects
const newProjectList = new Project() //New array to hold a list of projects, each containing a list of ToDoList objects

//FORM HANDLING
const submitBtn = document.querySelector(".submitBtn")
submitBtn.addEventListener("click", (e)=>{
    if(submitBtn.textContent = "Add"){
        const taskTitle = document.getElementById("title").value
        const taskDescr = document.getElementById("description").value
        const taskDueDate = document.getElementById("due_date").value
        const taskPriority = document.getElementById("priority").value
    
        newList.createNewTask(taskTitle, taskDescr, taskDueDate, taskPriority)   //Store values in general todo list
        let currentListIndex = newList.getListLength()-1
        toDoListDiv.appendChild(GUI.displayTaskGUI(currentListIndex, newList)) //Create GUI for task
        GUI.updateNumTasksGUI() 

        closeForm()
        e.preventDefault();  //Prevents form from sending data to backend by default
    }
})

//PAGE SWITCH HANDLING
const mainSidebarOptions = document.querySelectorAll(".optionDiv")
mainSidebarOptions.forEach(option => {
    option.addEventListener("click", ()=>{
        const selecetedOption = option.textContent.toLocaleLowerCase()
        //Load correct task GUI based on user option
        let taskHeaderSection = document.querySelector(".taskHeaderSection")
        toDoMainContent.removeChild(taskHeaderSection)
        taskHeaderSection = loadTaskHeaderSection(option.textContent)
        toDoMainContent.insertBefore(taskHeaderSection, toDoListDiv)
        
        //Update array and GUI
        toDoListDiv.textContent = ""

        for(let i=0; i<newList.getListLength(); i++){
            console.log(newList.searchTask(i))
            if(selecetedOption === "home"){
                toDoListDiv.appendChild(GUI.displayTaskGUI(i, newList))
            }
            else if(selecetedOption === "today" && newList.isDueToday(i)){
                toDoListDiv.appendChild(GUI.displayTaskGUI(i, newList))
            }
            else if(selecetedOption === "week" && newList.isDueThisWeek(i)){
                toDoListDiv.appendChild(GUI.displayTaskGUI(i, newList))
            }
            else if(selecetedOption === "important" && newList.checkTaskImportance(i)){
                toDoListDiv.appendChild(GUI.displayTaskGUI(i, newList))
            }
            else if(selecetedOption === "completed" && newList.checkTaskCompletionStatus(i)){
                toDoListDiv.appendChild(GUI.displayTaskGUI(i, newList))
            }
            else{
                continue
            }
        }
        GUI.updateNumTasksGUI()

        //Update tab title and icon
        //pageContent.appendChild(toDoMainContent)
        let optionIcon = option.querySelector("img")
        let optionIconSrc = optionIcon.getAttribute("src")
        const tabIcon = document.querySelector(".tabIcon")
        tabIcon.setAttribute("src", optionIconSrc)
        const tabTitle = document.querySelector(".tabTitle")
        tabTitle.textContent = option.textContent

        mainSidebarOptions.forEach(option =>{
            option.removeAttribute("id")
        })
        option.setAttribute("id", "selecetedOption")
    })
});

//PROJECT SECTION
const addProjectBtn = document.querySelector(".addProjectBtn")
addProjectBtn.addEventListener("click", ()=>{
    modal.style.display = "block"
    projectGUI.displayAddProjectGUI()
})





























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
            displayEditTaskGUI(currentListIndex, taskContainer)            
        })
        const deleteIcon = createAnImg(DeleteIcon, "taskOptionIcon")
        deleteIcon.addEventListener("click", ()=>{
            modal.style.display = "block"
            createDeleteGUI(currentTask.getTaskName, taskContainer)
        })
        const infoIcon = createAnImg(InfoIcon, "taskOptionIcon")
        infoIcon.addEventListener("click", ()=>{
            modal.style.display = "block"
            GUI.displayTaskInformation(newList.searchTask(taskContainer.getAttribute("data-state")), taskContainer)
        })
        rightTaskSideDiv.appendChild(editIcon)
        rightTaskSideDiv.appendChild(deleteIcon)
        rightTaskSideDiv.appendChild(infoIcon)
    
        completedCheckCircle.addEventListener("click", ()=>{
            GUI.displayTaskStatus(completedCheckCircle, taskNameP)
            newList.updateTaskStatus(taskContainer.getAttribute("data-state"))
        })

        //For completed tasks that need to be displayed as completed when changing tabs
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

    const displayEditTaskGUI = (currentTaskIndex, currentTaskContainer)=>{  //Displays the form to allow user to edit task
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
            newList.updateTaskInfo(taskTitle, taskDescr, taskDueDate, taskPriority, currentTaskIndex)  //Update Array
            updateTaskGUI(currentTaskContainer, taskTitle, taskDueDate)  //Update task GUI

            closeForm()
            currentTaskContainer.removeChild(editForm)
            e.preventDefault();
        })
        currentTaskContainer.appendChild(editForm)

        //Give form current task values for user to edit
        let currentTask = newList.searchTask(currentTaskIndex)
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
    const createDeleteGUI = (taskName, taskContainer)=>{
        const deleteGUI = createAnElement("div", "popUpForm")
        deleteGUI.setAttribute("id", "deleteGUI")

        //Top of form
        const deleteTitleDiv = createAnElement("div", "formTitleDiv")
        deleteTitleDiv.style.background = "rgb(243, 39, 39)"
        const formTItle = createAnElement("h2", "formTItle")
        formTItle.textContent = "Delete Task"
        const exitBtn = createAnElement("button", "exitBtn")
        exitBtn.textContent = "x"
        exitBtn.addEventListener("click", ()=>{
            taskContainer.removeChild(deleteGUI)
            modal.style.display = "none"
        })
        deleteTitleDiv.appendChild(formTItle)
        deleteTitleDiv.appendChild(exitBtn)
    
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
        const formActionBtnsDiv = createAnElement("div", "formActionBtnsDiv")
        const cancelBtn = createAnElement("button", "cancelBtn")
        cancelBtn.textContent = "Cancel"
        cancelBtn.addEventListener("click", ()=>{
            taskContainer.removeChild(deleteGUI)
            modal.style.display = "none"
        })
        const submitBtn = createAnElement("button", "submitBtn")
        submitBtn.textContent = "Delete"
        submitBtn.addEventListener('click', ()=>{
            deleteTaskGUI(taskContainer)
            newList.deleteTask(taskContainer.getAttribute("data-state"))
            updateNumTasksGUI()
            taskContainer.removeChild(deleteGUI)
            modal.style.display = "none"
        })
        formActionBtnsDiv.appendChild(cancelBtn)
        formActionBtnsDiv.appendChild(submitBtn)

        deleteGUI.appendChild(deleteTitleDiv)
        deleteGUI.appendChild(deleteWarningDiv)
        deleteGUI.appendChild(formActionBtnsDiv)
        taskContainer.appendChild(deleteGUI)
        deleteGUI.style.display = "block"
    }
    const displayTaskInformation = (currentTaskIndex, currentTaskContainer)=>{  //Displays GUI for user to see task overcview
        const infoContainer = createAnElement("div", "infoContainer")
        const infoTitleDiv = createAnElement("div", "infoTitleDiv")
        const infoTitle = createAnElement("h2", "infoTitle")
        infoTitle.textContent = "Task Overview"
        const infoExitBtn = createAnElement("button", "exitBtn")
        infoExitBtn.textContent = "x"
        infoExitBtn.addEventListener("click", ()=>{
            currentTaskContainer.removeChild(infoContainer)
            modal.style.display = "none"
        })
        infoTitleDiv.appendChild(infoTitle)
        infoTitleDiv.appendChild(infoExitBtn)
    
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
    return{displayTaskGUI, displayTaskInformation, displayTaskStatus, updateNumTasksGUI}
})()

/******************** GUI FUNCTIONS *********************/

/******************** PROJECT GUI FUNCTIONS *********************/

const projectGUI = (()=>{
    const displayAddProjectGUI = ()=>{
        const projectsContainer = document.querySelector(".projectsContainer")
        const addProjectFrom = createAnElement("div", "popUpForm")
        addProjectFrom.setAttribute("id", "addProjectFrom")

        //Top of form
        const projectitleDiv = createAnElement("div", "formTitleDiv")
        const formTItle = createAnElement("h2", "formTItle")
        formTItle.textContent = "Add A Project"
        const exitBtn = createAnElement("button", "exitBtn")
        exitBtn.textContent = "x"
        exitBtn.addEventListener("click", ()=>{
            content.removeChild(addProjectFrom)
            modal.style.display = "none"
        })
        projectitleDiv.appendChild(formTItle)
        projectitleDiv.appendChild(exitBtn)

        const formContainer = createAnElement("div", "formContainer")
        const newProjectForm = createAnElement("form", "form")
        const projectTitleSection = createFormField("Title", "text")
        newProjectForm.appendChild(projectTitleSection)
        formContainer.appendChild(newProjectForm)

        const formActionBtnsDiv = createAnElement("div", "formActionBtnsDiv")
        const cancelBtn = createAnElement("button", "cancelBtn")
        cancelBtn.textContent = "Cancel"
        cancelBtn.addEventListener("click", ()=>{
            content.removeChild(addProjectFrom)
            modal.style.display = "none"
        })
        const submitBtn = createAnElement("button", "submitBtn")
        submitBtn.textContent = "Add"
        submitBtn.addEventListener('click', ()=>{
            const projectTitle = formContainer.querySelector("#title").value
            projectsContainer.appendChild(createProject(projectTitle))
            //newProjectList.addProject()
            closeForm()
            content.removeChild(addProjectFrom)
        })
        formActionBtnsDiv.appendChild(cancelBtn)
        formActionBtnsDiv.appendChild(submitBtn)

        addProjectFrom.appendChild(projectitleDiv)
        addProjectFrom.appendChild(formContainer)
        addProjectFrom.appendChild(formActionBtnsDiv)
        content.appendChild(addProjectFrom)
        addProjectFrom.style.display = "block"
    }
    const createProject = (projectName) =>{
        const projectDiv = createAnElement("div", "projectDiv")
        const leftSideDiv = createAnElement("div", "leftSideDiv")
        const projectIcon = createAnImg(ProjectIcon, "projectIconLeft")
        const projectNameP = createAnElement("p", "projectNameP")
        projectNameP.textContent = projectName
        leftSideDiv.appendChild(projectIcon)
        leftSideDiv.appendChild(projectNameP)
        
        const rightSideDiv = createAnElement("div", "rightSideDiv")
        const editIcon = createAnImg(EditIcon, "projectIcon")
        const deleteIcon = createAnImg(DeleteIcon, "projectIcon")
        rightSideDiv.appendChild(editIcon)
        rightSideDiv.appendChild(deleteIcon)
    
        projectDiv.appendChild(leftSideDiv)
        projectDiv.appendChild(rightSideDiv)
        return projectDiv
    }

    return{displayAddProjectGUI}
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
const swtichTaskHeaderContent = (option)=>{
    let taskHeaderSection = document.querySelector(".taskHeaderSection")
    toDoMainContent.removeChild(taskHeaderSection)
    taskHeaderSection = loadTaskHeaderSection(option)
    toDoMainContent.insertBefore(taskHeaderSection, toDoListDiv)
    
    toDoListDiv.textContent = ""

    //Update tab title and icon
    pageContent.appendChild(toDoMainContent)
    let optionIcon = option.querySelector("img")
    let optionIconSrc = optionIcon.getAttribute("src")
    const tabIcon = document.querySelector(".tabIcon")
    tabIcon.setAttribute("src", optionIconSrc)
    const tabTitle = document.querySelector(".tabTitle")
    tabTitle.textContent = option.textContent

    mainSidebarOptions.forEach(option =>{
        option.removeAttribute("id")
    })
    option.setAttribute("id", "selecetedOption")
}

newList.createNewTask("Task A", "dsadas", "2023-07-12", "Low") 
toDoListDiv.appendChild(GUI.displayTaskGUI(0, newList)) //Create GUI for task
newList.createNewTask("Task B", "dsadas", "2023-07-14", "Low") 
toDoListDiv.appendChild(GUI.displayTaskGUI(1, newList)) //Create GUI for task
newList.createNewTask("Task C", "dsadas", "2023-07-15", "Low") 
toDoListDiv.appendChild(GUI.displayTaskGUI(2, newList)) //Create GUI for task
newList.createNewTask("Task D", "dsadas", "2023-07-16", "Low") 
toDoListDiv.appendChild(GUI.displayTaskGUI(3, newList)) //Create GUI for task
GUI.updateNumTasksGUI()