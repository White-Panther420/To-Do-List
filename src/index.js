import "./Styles/style.css"
import Logo from "./Assets/Logo.png"
import HomeIcon from "./Assets/Home.svg"
import TodayIcon from "./Assets/Today.svg"
import WeekIcon from "./Assets/Week.svg"
import ImportantIcon from "./Assets/Important.svg"
import CompleteIcon from "./Assets/Complete.svg"
import ProjectIcon from "./Assets/Project.png"
import EditIcon from "./Assets/Edit.png"
import DeleteIcon from "./Assets/Delete.png"

const content = document.querySelector("#content")

const createSideBarOption = (importedIconName, optionName) =>{
    const optionDiv = createAnElement("div", "optionDiv")
    optionDiv.setAttribute("id", "optionDiv")
    const optionIcon = createAnImg(importedIconName, "optionIcon")
    optionDiv.appendChild(optionIcon)
    const optionText = createAnElement("p", "optionText")
    optionText.textContent = optionName
    optionDiv.appendChild(optionText)
    return optionDiv
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
const createAnElement = (elementName, className) =>{
    const element = document.createElement(elementName)
    element.classList.add(className)
    return element
}
const createAnImg = (importedImage, className) =>{
    const myImg = new Image()
    myImg.src = importedImage
    myImg.classList.add(className)
    return myImg
}

//HEADER
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
for(let i=0; i<projectNames.length; i++){
    projectOptionDiv.appendChild(createProject(projectNames[i]))
}

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

//TO-DO LIST
const toDoMainContent = createAnElement("div", "toDoMainContent")
const tabTitle = createAnElement("h2", "tabTitle")
const taksAndToDoDIv = createAnElement('div', "taksAndToDoDIv")
const taskDiv = createAnElement('div', "taskDiv")
const taskP = createAnElement("p", "taskP")
taskP.textContentP = "Tasks"
const numTasks = createAnElement("p", "numTasks")
numTasks.textContent = "(0)"

const toDoListDiv = createAnElement("div", "toDoListDiv")



toDoMainContent.appendChild(tabTitle)
toDoMainContent.appendChild(taksAndToDoDIv)










content.appendChild(headerDiv)
content.appendChild(sideBarDiv)
content.appendChild(toDoMainContent)



