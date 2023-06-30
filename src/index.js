import "./Styles/style.css"
import { loadPage, createAnElement, createFormField, createPriorityField } from "./loadPage"
/******************** GUI FUNCTIONS *********************/
const createForm = ()=>{
    const popUpForm = createAnElement("div", "popUpForm")
    
    //Top of form
    const formTitleDiv = createAnElement("div", "formTitleDiv")
    const formTItle = createAnElement("h2", "formTItle")
    formTItle.textContent = "Add Task"
    const exitBtn = createAnElement("button", "exitBtn")
    exitBtn.textContent = "x"
    formTitleDiv.appendChild(formTItle)
    formTitleDiv.appendChild(exitBtn)

    //Actual form 
    const formContainer = createAnElement("div", "formContainer")
    const form = createAnElement("form", "form")
    formContainer.appendChild(form)
    
    form.appendChild(createFormField("Title", "Text"))
    form.appendChild(createFormField("Description", "Textarea"))
    form.appendChild(createFormField("Due Date", "Date"))
    form.appendChild(createPriorityField("Priority"))  //Needs to be made differently
    
    const formActionBtnsDiv = createAnElement("div", "formActionBtnsDiv")
    const cancelBtn = createAnElement("button", "cancelBtn")
    cancelBtn.textContent = "Cancel"
    const submitBtn = createAnElement("button", "submitBtn")
    submitBtn.textContent = "Add"
    formActionBtnsDiv.appendChild(cancelBtn)
    formActionBtnsDiv.appendChild(submitBtn)

    popUpForm.appendChild(formTitleDiv)
    popUpForm.appendChild(formContainer)
    popUpForm.appendChild(formActionBtnsDiv)
    return popUpForm
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

const newList = new ToDoList()  //New array to store task objects


const createNewTask = ()=>{

}















const formTag = document.querySelector(".form")
const addTaskbtn = document.querySelector(".addTaskBtn")
addTaskbtn.addEventListener("click", ()=>{
    popUpForm.style.display = "block"
    //newList.push(createNewTask())
})
const exitFormBtn = document.querySelector(".exitBtn")
exitFormBtn.addEventListener("click", ()=>{
    popUpForm.style.display = "none"
    formTag.reset()  //Clears the form
    //e.preventDefault();  //Prevents form from sending data to backend by default
})
const cancelBtn = document.querySelector(".cancelBtn")
cancelBtn.addEventListener("click", ()=>{
    popUpForm.style.display = "none"
    formTag.reset()  //Clears the form
})
const submitBtn = document.querySelector(".submitBtn")
submitBtn.addEventListener("click", (e)=>{
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
