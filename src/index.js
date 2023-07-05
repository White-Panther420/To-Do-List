import "./Styles/style.css"
import EditIcon from "./Assets/Edit.png"
import DeleteIcon from "./Assets/Delete.png"
import InfoIcon from "./Assets/Info.png"
import { loadPage, loadMainBodyContent} from "./loadPage"
import { createAnElement, createAnImg, createForm, createInput } from "./formAndElements"
/******************** GUI FUNCTIONS *********************/

/******************** GUI FUNCTIONS *********************/


//Load the constant part of page (header, sidebar, and some of body)
const content = document.querySelector("#content")

const popUpForm = createForm()
const pageContent = loadPage()
content.appendChild(pageContent)
content.appendChild(popUpForm)

const modal = document.querySelector(".modal")

const homeOption = document.querySelector(".optionDiv")
homeOption.setAttribute("id", "selecetedOption")

//Dynamic portion that will be below task header
let toDoMainContent = document.querySelector(".toDoMainContent") 
const toDoListDiv = createAnElement("div", "toDoListDiv") //Container to hold tasks
toDoMainContent.appendChild(toDoListDiv) 








































class Task{
    constructor(title, description, dueDate, priority="Low", isComplete="Incomplete"){
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.isComplete = isComplete
    }

    //Getters
    get getTaskName(){
        return this.title
    }
    get getTaskDescr(){
        return this.description
    }
    get getDuedate(){
        return this.dueDate
    }
    get getPriorityLevel(){
        return this.priority
    }
    get getCompletionState(){
        return this.isComplete
    }

    //Setters
    set setTaskName(title){
        return this.title = title
    }
    set setTaskDescr(description){
        return this.description = description
    }
    set setTuedate(dueDate){
        return this.dueDate = dueDate
    }
    set setTriorityLevel(priority){
        return this.priority = priority
    }
    set setCompletionState(isComplete){
        return this.isComplete = isComplete
    }

    //Methods
}

class ToDoList{
    constructor(){
        this.list = []
    }
    addTask(task){
        this.list.push(task)
    }
    printTask(){
        this.list.forEach(task => {
            console.log("Task Name: " + task.taskName)
        });
    }
    getListLength(){
        return this.list.length
    }
    getLastTask(){
        return this.list[this.list.length-1]
    }
    searchTask(taskIndex){
        return this.list[taskIndex]
    }
}

const newList = new ToDoList()  //New array to store task objects



const addTaskbtn = document.querySelector(".addTaskBtn")
addTaskbtn.addEventListener("click", ()=>{
    popUpForm.style.display = "block"  //Have user fill out form and put the info into newList
    modal.style.display = "block"
})

const createNewTask = (taskTitle, taskDescr, taskDueDate, taskPriority)=>{
    let newTask = new Task(taskTitle, taskDescr, taskDueDate, taskPriority, "Incomplete")
    newList.addTask(newTask)
}   
const createTaskGUI = ()=>{
    const taskContainer = createAnElement("div", "taskContainer")
    taskContainer.setAttribute("data-state", newList.getListLength()-1)  //Link each GUI task to console task stored in newList
    const lastTask = newList.getLastTask() 

    const leftTaskSideDiv = createAnElement("div", "leftTaskSideDiv")
    const completedCheckCircle = createInput("completed", "checkbox")
    completedCheckCircle.classList.remove("input")
    completedCheckCircle.classList.add("complete", `${lastTask.getPriorityLevel.toLowerCase()}`)
    const taskNameP = createAnElement("p", "taskNameP")
    taskNameP.textContent = lastTask.getTaskName
    leftTaskSideDiv.appendChild(completedCheckCircle)
    leftTaskSideDiv.appendChild(taskNameP)

    const rightTaskSideDiv = createAnElement("div", "rightTaskSideDiv")
    const dueDateP = createAnElement("p", "dueDateP")
    if(newList.getLastTask().getDuedate === ""){
        dueDateP.textContent = "No due date"
    }else{
        dueDateP.textContent = newList.getLastTask().getDuedate
    }
    rightTaskSideDiv.appendChild(dueDateP)

    const editIcon = createAnImg(EditIcon, "taskOptionIcon")
    editIcon.addEventListener("click", ()=>{

    })
    const deleteIcon = createAnImg(DeleteIcon, "taskOptionIcon")
    deleteIcon.addEventListener("click", ()=>{
        
    })
    const infoIcon = createAnImg(InfoIcon, "taskOptionIcon")
    infoIcon.addEventListener("click", ()=>{
        modal.style.display = "block"
        displayTaskInformation(newList.searchTask(taskContainer.getAttribute("data-state")), taskContainer)
    })
    rightTaskSideDiv.appendChild(editIcon)
    rightTaskSideDiv.appendChild(deleteIcon)
    rightTaskSideDiv.appendChild(infoIcon)

    completedCheckCircle.addEventListener("click", ()=>{
        displayTaskStatus(completedCheckCircle, taskNameP)
        updateTaskStatus(taskContainer.getAttribute("data-state"))
    })

    taskContainer.appendChild(leftTaskSideDiv)
    taskContainer.appendChild(rightTaskSideDiv)
    return taskContainer
}

const displayTaskStatus = (checkButton, taskTitle) =>{
    if(checkButton.checked === true){  //Button currently not checked
        taskTitle.setAttribute("id", "completedTask")
        checkButton.setAttribute("id", "isCompleteBtn")
    }else{  //Uncheck button
        taskTitle.removeAttribute("id", "completedTask")
        checkButton.removeAttribute("id", "isCompleteBtn")
    }
}
const updateTaskStatus = (taskContainerIndex)=>{
    const currentTask = newList.searchTask(taskContainerIndex)
    currentTask.getCompletionState === "Incomplete" ?  currentTask.setCompletionState="Complete" : currentTask.setCompletionState="Incomplete"
}

const displayTaskInformation = (currentTaskIndex, currentTaskContainer)=>{
    const infoContainer = createAnElement("div", "infoContainer")
    const infoTitleDiv = createAnElement("div", "infoTitleDiv")
    const infoTitle = createAnElement("h2", "infoTitle")
    infoTitle.textContent = "Edit Task"
    const infoExitBtn = createAnElement("button", "exitBtn")
    infoExitBtn.textContent = "x"
    infoExitBtn.addEventListener("click", ()=>{
        infoContainer.style.display = "none"
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
        infoContainer.style.display = "none"
        modal.style.display = "none"
    })
    infoActionDiv.appendChild(infoCancelBtn)


    infoContainer.appendChild(infoTitleDiv)
    infoContainer.appendChild(infoSectionDiv)
    infoContainer.appendChild(infoActionDiv)

    currentTaskContainer.appendChild(infoContainer)
    
    infoContainer.style.display = "block"
}






//FORM HANDLING
const formTag = document.querySelector(".form")
const exitFormBtn = document.querySelector(".exitBtn")
exitFormBtn.addEventListener("click", ()=>{
    closeForm()
})
const cancelBtn = document.querySelector(".cancelBtn")
cancelBtn.addEventListener("click", ()=>{
    closeForm()
})
const submitBtn = document.querySelector(".submitBtn")
submitBtn.addEventListener("click", (e)=>{
    const taskTitle = document.getElementById("title").value
    const taskDescr = document.getElementById("description").value
    const taskDueDate = document.getElementById("due_date").value
    const taskPriority = document.getElementById("priority").value

    createNewTask(taskTitle, taskDescr, taskDueDate, taskPriority)   //Store values in general todo list
    toDoListDiv.appendChild(createTaskGUI()) //Create GUI for task

    closeForm()
    e.preventDefault();  //Prevents form from sending data to backend by default
})

const mainSidebarOptions = document.querySelectorAll(".optionDiv")
mainSidebarOptions.forEach(option => {
    option.addEventListener("click", ()=>{
        pageContent.removeChild(toDoMainContent)
        toDoMainContent = loadMainBodyContent(option.textContent)
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


const closeForm=() =>{
    popUpForm.style.display = "none"
    modal.style.display = "none"

    formTag.reset()  //Clears the form
}