import "./Styles/style.css"
import { loadPage, createAnElement, createLabel, createInput } from "./loadPage"
/******************** GUI FUNCTIONS *********************/
const createForm = ()=>{
    const popUpForm = createAnElement("div", "popUpForm")
    const formTitleDiv = createAnElement("div", "formTitleDiv")
    const formTItle = createAnElement("h2", "formTItle")
    formTItle.textContent = "Add Task"
    const exitBtn = createAnElement("button", "exitBtn")
    exitBtn.textContent = "x"
    formTitleDiv.appendChild(exitBtn)
    formTitleDiv.appendChild(formTItle)

    const formBody = createAnElement("div", "formBody")
    const form = createAnElement("form", "form")
    formBody.appendChild(form)
    
    const taskTitleDiv = createAnElement("div", "formField")
    form.appendChild(taskTitleDiv)
    const titleLabel = createLabel("Title")
    const titleInput = createInput("Title")
    taskTitleDiv.appendChild(titleLabel)
    taskTitleDiv.appendChild(titleInput)
    //popUpForm.appendChild(formTitleDiv)

}
/******************** GUI FUNCTIONS *********************/

class Task{
    constructor(title, description, notes="", dueDate, priority){
        this.title = title
        this.description = description
        this.notes = notes
        this.dueDate = dueDate
        this.priority = priority
    }

    //Getters
    getDueDate(){
        return this.dueDate
    }
    getPriority(){
        return this.priority
    }

    //Setters
    setTitle(title){
        return this.title = title
    }
    setDescription(description){
        return this.description = description
    }
    setNotes(notes){
        return this.notes = notes
    }
    setDueDate(dueDate){
        return this.dueDate = dueDate
    }
    setPriority(priority){
        return this.priority = priority
    }
    
}

class ToDoList{
    constructor(){
        this.list = []
    }
}

const content = document.querySelector("#content")
content.appendChild(loadPage())


const toDoListDiv = createAnElement("div", "toDoListDiv")
const newList = new ToDoList()  //New array to store task objects

const addTaskbtn = document.querySelector(".addTaskBtn")
addTaskbtn.addEventListener("click", ()=>{
    newList.push(createNewTask())
})

const createNewTask = ()=>{

}


























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
