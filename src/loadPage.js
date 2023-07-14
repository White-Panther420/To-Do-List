import "./Styles/style.css"
import { createAnElement, createAnImg, createForm } from "./formAndElements"
import Logo from "./Assets/Logo.png"
import HomeIcon from "./Assets/Home.svg"
import TodayIcon from "./Assets/Today.svg"
import WeekIcon from "./Assets/Week.svg"
import ImportantIcon from "./Assets/Important.svg"
import CompleteIcon from "./Assets/Complete.svg"

/******************** HELPER FUNCTIONS *********************/
const createSideBarOption = (importedIconName, optionName) =>{
    const optionDiv = createAnElement("div", "optionDiv")
    optionDiv.setAttribute("id", "unselectedOption")
    const optionIcon = createAnImg(importedIconName, "optionIcon")
    optionDiv.appendChild(optionIcon)
    const optionText = createAnElement("p", "optionText")
    optionText.textContent = optionName
    optionDiv.appendChild(optionText)
    return optionDiv
}
/******************** HELPER FUNCTIONS *********************/
const popUpForm = createForm("Add Task", "Add")
const modal = createAnElement("div", "modal")

const loadPage = () =>{
    //HEADER
    const pageContent = createAnElement("div", "pageContent")
    pageContent.appendChild(modal)

    const headerDiv = createAnElement("div", "headerDiv")
    const pageTitle = createAnElement("h1", "pageTitle")
    const siteLogo = createAnImg(Logo, "siteLogo")
    pageTitle.textContent = "To Do List"
    headerDiv.appendChild(siteLogo)
    headerDiv.appendChild(pageTitle)

    //SIDEBAR
    const sideBarDiv = createAnElement("div", "sideBarDiv")
    const mainOptionsDiv = createAnElement("div", "mainOptionsDiv")
    const icons = [HomeIcon, TodayIcon, WeekIcon, ImportantIcon, CompleteIcon]
    const optionNames = ["Home", "Today", "Week", "Important", "Completed"]
    for(let i=0; i<optionNames.length; i++){
        mainOptionsDiv.appendChild(createSideBarOption(icons[i], optionNames[i]))
    }
    sideBarDiv.appendChild(mainOptionsDiv)

    const projectOptionDiv = createAnElement("div", "projectOptionDiv")
    const projectHeaderDiv = createAnElement("div", "projectHeaderDiv")
    const projectHeader = createAnElement("h2", "projectHeader")
    projectHeader.textContent = "Projects "
    projectHeaderDiv.appendChild(projectHeader)
    const numProjeccts = createAnElement("h2", "numProjeccts")
    numProjeccts.textContent = " (0)"
    projectHeader.appendChild(numProjeccts)
    const addProjectBtn = createAnElement("button", "addProjectBtn")
    projectHeaderDiv.appendChild(addProjectBtn)

    const projectsContainer = createAnElement("div", "projectsContainer")
    projectOptionDiv.appendChild(projectHeaderDiv)
    projectOptionDiv.appendChild(projectsContainer)
    const projectNames = ["Psssssssroject1", "Project2", "Project3"]
    // for(let i=0; i<projectNames.length; i++){
    //     projectOptionDiv.appendChild(createProject(projectNames[i]))
    // }

    sideBarDiv.appendChild(projectOptionDiv)

    const footer = createAnElement("footer", "footer")
    const gitHubUsername = createAnElement("a", "gitHubUsername")
    const credit = createAnElement("p", "credit")
    credit.textContent = "Created by "
    gitHubUsername.textContent = "White-Panther420"
    gitHubUsername.href = "https://github.com/White-Panther420"
    credit.appendChild(gitHubUsername)
    footer.appendChild(credit)

    sideBarDiv.appendChild(footer)

    const toDoMainContent = createAnElement("div", "toDoMainContent")
    toDoMainContent.appendChild(loadTaskHeaderSection("Home"))
    const toDoListDiv = createAnElement("div", "toDoListDiv") //Container to hold tasks
    toDoMainContent.appendChild(toDoListDiv) 

    pageContent.appendChild(headerDiv)
    pageContent.appendChild(sideBarDiv)
    pageContent.appendChild(toDoMainContent)
    pageContent.appendChild(popUpForm)
    return pageContent
}
const loadTaskHeaderSection = (option)=>{
    const taskHeaderSection = createAnElement("div", "taskHeaderSection")
    const tabTitleDiv = createAnElement("div", "tabTitleDiv")
    const tabIcon = createAnImg(HomeIcon, "tabIcon")
    const tabTitle = createAnElement("h2", "tabTitle")
    tabTitle.textContent = "Home"
    tabTitleDiv.appendChild(tabIcon)
    tabTitleDiv.appendChild(tabTitle)

    const taksAndToDoDIv = createAnElement('div', "taksAndToDoDIv")
    const taskDiv = createAnElement('div', "taskDiv")
    taksAndToDoDIv.appendChild(taskDiv)
    const taskP = createAnElement("p", "taskP")
    taskP.textContent = "Tasks"
    taskDiv.appendChild(taskP)
    const numTasks = createAnElement("p", "numTasks")
    numTasks.textContent = "(0)"
    taskP.appendChild(numTasks)

    if(option !== "Important" && option !== "Completed"){
        const addTaskBtn = createAnElement("button", "addTaskBtn")
        addTaskBtn.addEventListener("click", ()=>{
            popUpForm.style.display = "block"  //Have user fill out form and put the info into newList
            modal.style.display = "block"
        })
        taskDiv.appendChild(addTaskBtn)
    }   
    taskHeaderSection.appendChild(tabTitleDiv)
    taskHeaderSection.appendChild(taksAndToDoDIv)
    return taskHeaderSection

}

export{
    loadPage,
    loadTaskHeaderSection
}