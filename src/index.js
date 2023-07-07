import "./Styles/style.css"
import {ToDoList} from "./List.js" 
import EditIcon from "./Assets/Edit.png"
import DeleteIcon from "./Assets/Delete.png"
import InfoIcon from "./Assets/Info.png"
import { loadPage, loadMainBodyContent} from "./loadPage"
import { createAnElement, createAnImg, createInput, createForm, closeForm } from "./formAndElements"

//Load the constant part of page (header, sidebar, and some of body)
const content = document.querySelector("#content")
const pageContent = loadPage()
content.appendChild(pageContent)
const popUpForm = document.querySelector('.popUpForm')
const modal = document.querySelector('.modal')

//Indicate we are on the home page
const homeOption = document.querySelector(".optionDiv")
homeOption.setAttribute("id", "selecetedOption")

//Dynamic portion that will be below task header
let toDoMainContent = document.querySelector(".toDoMainContent") 
let toDoListDiv = document.querySelector(".toDoListDiv") //Container to hold tasks

const newList = new ToDoList()  //New array to store task objects



//FORM HANDLING
const formTag = document.querySelector(".form")

const submitBtn = document.querySelector(".submitBtn")
submitBtn.addEventListener("click", (e)=>{
    if(submitBtn.textContent = "Add"){
        const taskTitle = document.getElementById("title").value
        const taskDescr = document.getElementById("description").value
        const taskDueDate = document.getElementById("due_date").value
        const taskPriority = document.getElementById("priority").value
    
        newList.createNewTask(taskTitle, taskDescr, taskDueDate, taskPriority)   //Store values in general todo list
        let currentListIndex = newList.getListLength()-1
        toDoListDiv.appendChild(GUI.displayTaskGUI(currentListIndex)) //Create GUI for task

        closeForm()
        e.preventDefault();  //Prevents form from sending data to backend by default
    }
})

//PAGE SWITCH HANDLING
const mainSidebarOptions = document.querySelectorAll(".optionDiv")
mainSidebarOptions.forEach(option => {
    option.addEventListener("click", ()=>{
        // pageContent.removeChild(toDoMainContent)
        // toDoMainContent = loadMainBodyContent(option.textContent)
        
        // newList.sortTasks(option.textContent.toLowerCase())
        // for(let i=0; i<newList.length; i++){
        //     toDoListDiv.appendChild(GUI.displayTaskGUI(i))
        // }
        
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
    })
});

/******************** GUI FUNCTIONS *********************/
const GUI = (()=>{
    const createTaskGUI = (currentListIndex)=>{
        const taskContainer = createAnElement("div", "taskContainer")
        taskContainer.setAttribute("data-state", currentListIndex)  //Link each GUI task to console task stored in newList
        const currentTask = newList.searchTask(currentListIndex) 
    
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
        if(currentTask.getDuedate === ""){
            dueDateP.textContent = "No due date"
        }else{
            dueDateP.textContent = currentTask.getDuedate
        }
        rightTaskSideDiv.appendChild(dueDateP)
    
        const editIcon = createAnImg(EditIcon, "taskOptionIcon")
        editIcon.addEventListener("click", ()=>{
            modal.style.display = "block"
            displayEditTaskGUI(currentListIndex, taskContainer)            
        })
        const deleteIcon = createAnImg(DeleteIcon, "taskOptionIcon")
        deleteIcon.addEventListener("click", ()=>{
            
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
    
        taskContainer.appendChild(leftTaskSideDiv)
        taskContainer.appendChild(rightTaskSideDiv)
        return taskContainer
    }
    
    const displayTaskGUI = (currentListIndex)=>{
        return createTaskGUI(currentListIndex)
    }

    const displayEditTaskGUI = (currentTaskIndex, currentTaskContainer)=>{
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
            const taskTitle = document.getElementById("title").value
            const taskDescr = document.getElementById("description").value
            let taskDueDate = document.getElementById("due_date").value
            if(taskDueDate === ""){
                taskDueDate = "No due date"
            }
            const taskPriority = document.getElementById("priority").value
            console.log("CURRENT PRIORITY: " + currentTask.getPriorityLevel)
            console.log("NEW PRIORITY: " + taskPriority)
            if(currentTask.getPriorityLevel !== taskPriority){
                updatePriorityGUI(currentTaskContainer, currentTask.getPriorityLevel, taskPriority)
            }
            newList.updateTaskInfo(taskTitle, taskDescr, taskDueDate, taskPriority, currentTaskIndex)  //Update Array
            updateTaskGUI(currentTaskContainer, taskTitle, taskDueDate)
            //newList.printTask()
            closeForm()
            currentTaskContainer.removeChild(editForm)
            e.preventDefault();
        })
        currentTaskContainer.appendChild(editForm)

        //Give form current task values for user to edit
        let currentTask = newList.searchTask(currentTaskIndex)
        const taskTitle = document.getElementById("title")
        taskTitle.value = currentTask.getTaskName
        const taskDescr = document.getElementById("description")
        taskDescr.value = currentTask.getTaskDescr
        const taskDueDate = document.getElementById("due_date")
        taskDueDate.value = currentTask.getDuedate
        const taskPriority = document.getElementById("priority")
        taskPriority.value = currentTask.getPriorityLevel
        editForm.style.display = "block"
    }

    const displayTaskInformation = (currentTaskIndex, currentTaskContainer)=>{
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
        taskDueDate.textContent = newTaskDueDate
    }

    const updatePriorityGUI = (taskContainer, currentPriority, newPriority)=>{
        const checkCircle = taskContainer.querySelector(".complete")
        checkCircle.classList.remove(currentPriority.toLowerCase())
        checkCircle.classList.add(newPriority.toLowerCase())
    }
    return{displayTaskGUI, displayTaskInformation, displayTaskStatus}
})()

/******************** GUI FUNCTIONS *********************/