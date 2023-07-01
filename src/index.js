import "./Styles/style.css"
import EditIcon from "./Assets/Edit.png"
import DeleteIcon from "./Assets/Delete.png"
import InfoIcon from "./Assets/Info.png"
import { loadPage} from "./loadPage"
import { createAnElement, createAnImg, createForm, createInput } from "./formAndElements"
/******************** GUI FUNCTIONS *********************/

/******************** GUI FUNCTIONS *********************/


//Load the constant part of page (header, sidebar, and some of body)
const content = document.querySelector("#content")

const popUpForm = createForm()
content.appendChild(loadPage())  
content.appendChild(popUpForm)

const homeOption = document.querySelector(".optionDiv")
homeOption.setAttribute("id", "homeOption")

//Dynamic portion that will be below task header
const toDoMainContent = document.querySelector(".toDoMainContent") 
const toDoListDiv = createAnElement("div", "toDoListDiv")
toDoMainContent.appendChild(toDoListDiv) 









































class Task{
    constructor(title, description, dueDate, priority){
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
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
    getLastTask(){
        return this.list[this.list.length-1]
    }
}

const newList = new ToDoList()  //New array to store task objects



const addTaskbtn = document.querySelector(".addTaskBtn")
addTaskbtn.addEventListener("click", ()=>{
    popUpForm.style.display = "block"  //Have user fill out form and put the info into newList
})

const createNewTask = ()=>{
    const taskContainer = createAnElement("div", "taskContainer")
    
    const leftTaskSideDiv = createAnElement("div", "leftTaskSideDiv")
    const completedCheckCircle = createInput("completed", "checkbox")
    const taskNameP = createAnElement("p", "taskNameP")
    taskNameP.textContent = newList.getLastTask().getTaskName
    leftTaskSideDiv.appendChild(completedCheckCircle)
    leftTaskSideDiv.appendChild(taskNameP)

    const rightTaskSideDiv = createAnElement("div", "rightTaskSideDiv")
    const dueDateP = createAnElement("p", "dueDateP")
    dueDateP.textContent = newList.getLastTask().getDuedate
    rightTaskSideDiv.appendChild(dueDateP)

    const icons = [EditIcon, DeleteIcon, InfoIcon]
    for(let i=0; i<icons.length; i++){
        rightTaskSideDiv.appendChild(createAnImg(icons[i], "taskOptionIcon"))
    }

    taskContainer.appendChild(leftTaskSideDiv)
    taskContainer.appendChild(rightTaskSideDiv)
    return taskContainer

}   


const addNewTaskToGUI = ()=>{

}












//FORM HANDLING
const formTag = document.querySelector(".form")
const exitFormBtn = document.querySelector(".exitBtn")
exitFormBtn.addEventListener("click", ()=>{
    popUpForm.style.display = "none"
    formTag.reset()  //Clears the form
})
const cancelBtn = document.querySelector(".cancelBtn")
cancelBtn.addEventListener("click", ()=>{
    popUpForm.style.display = "none"
    formTag.reset()  //Clears the form
})
const submitBtn = document.querySelector(".submitBtn")
submitBtn.addEventListener("click", (e)=>{
    const taskTitle = document.getElementById("title").value
    const taskDescr = document.getElementById("description").value
    const taskDueDate = document.getElementById("due_date").value
    const taskPriority = document.getElementById("priority").value

    //Store values in general todo list
    let newTask = new Task(taskTitle, taskDescr, taskDueDate, taskPriority)
    newList.addTask(newTask)
    toDoListDiv.appendChild(createNewTask()) //Create GUI for task
    console.log(newList)
    popUpForm.style.display = "none"
    formTag.reset()  //Clears the form
    e.preventDefault();  //Prevents form from sending data to backend by default
})

const mainSidebarOptions = document.querySelectorAll(".optionDiv")
mainSidebarOptions.forEach(option => {
    option.addEventListener("click", ()=>{
        // let optionIcon = option.getElementByTagName(img)
        // tabIcon.src = optionIcon.src
        // console.log(option.src)
        const tabTitle = document.querySelector(".tabTitle")
        tabTitle.textContent = option.textContent
    })
});
