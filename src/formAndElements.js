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

const createForm = (formTitle, submitBtnName)=>{
    const popUpForm = createAnElement("div", "popUpForm")
    
    //Top of form
    const formTitleDiv = createFormTitleSection(formTitle)

    //Actual form 
    const formContainer = createAnElement("div", "formContainer")
    const form = createAnElement("form", "form")
    formContainer.appendChild(form)
    
    form.appendChild(createFormField("Title", "Text"))
    form.appendChild(createTextArea("Description"))
    form.appendChild(createFormField("Due_Date", "Date"))
    form.appendChild(createPriorityField("Priority"))  //Needs to be made differently
    
    //Bottom of form
    const formActionBtnsDiv = createFormActionSection(submitBtnName)
    const exitBtn = formTitleDiv.querySelector(".exitBtn")
    exitBtn.addEventListener("click", ()=>{
        closeForm()
    })
    const cancelBtn = formActionBtnsDiv.querySelector(".cancelBtn")
    cancelBtn.addEventListener("click", ()=>{
        closeForm()
    })
    popUpForm.appendChild(formTitleDiv)
    popUpForm.appendChild(formContainer)
    popUpForm.appendChild(formActionBtnsDiv)
    return popUpForm
}
const createProjectForm = (formTitle, submitBtnName)=>{
    const addProjectFrom = createAnElement("div", "popUpForm")
    addProjectFrom.setAttribute("id", "addProjectFrom")

    //Top of form
    const projectitleDiv = createFormTitleSection(formTitle)

    //Actual form
    const formContainer = createAnElement("div", "formContainer")
    const newProjectForm = createAnElement("form", "form")
    const projectTitleSection = createFormField("Title", "text")
    newProjectForm.appendChild(projectTitleSection)
    formContainer.appendChild(newProjectForm)
    
    //Bottom of form
    const formActionBtnsDiv = createFormActionSection(submitBtnName)
    
    addProjectFrom.appendChild(projectitleDiv)
    addProjectFrom.appendChild(formContainer)
    addProjectFrom.appendChild(formActionBtnsDiv)
    return addProjectFrom    
}
const createDeleteWarninMsg = (deleteType, deleteTypeName)=>{
    const deleteWarningDiv = createAnElement("div", "deleteWarningDiv")
    const deleteQuestionP = createAnElement("p", "deleteQuestionP")
    deleteQuestionP.textContent = "Are you sure?"
    const deleteWarningMsgDiv = createAnElement("div", "deleteWarningMsgDiv")
    const deleteWarningMsgP1 = createAnElement("p", "deleteWarningMsgP1")
    deleteWarningMsgP1.textContent = deleteType
    const taskNameP = createAnElement("p", "taskNameSpan")
    taskNameP.textContent = deleteTypeName 
    const deleteWarningMsgP2 = createAnElement("p", "deleteWarningMsgP2")
    deleteWarningMsgP2.textContent = "will be gone forever!"
    deleteWarningMsgDiv.appendChild(deleteWarningMsgP1)
    deleteWarningMsgDiv.appendChild(taskNameP)
    deleteWarningMsgDiv.appendChild(deleteWarningMsgP2)

    deleteWarningDiv.appendChild(deleteQuestionP)
    deleteWarningDiv.appendChild(deleteWarningMsgDiv)
    return deleteWarningDiv
}
 

const createFormTitleSection = (titleName)=>{
    const formTitleDiv = createAnElement("div", "formTitleDiv")
    const formTItle = createAnElement("h2", "formTItle")
    formTItle.textContent = titleName
    const exitBtn = createAnElement("button", "exitBtn")
    exitBtn.textContent = "x"

    formTitleDiv.appendChild(formTItle)
    formTitleDiv.appendChild(exitBtn)
    return formTitleDiv
}
const createFormActionSection = (submitBtnName)=>{
    const formActionBtnsDiv = createAnElement("div", "formActionBtnsDiv")
    const cancelBtn = createAnElement("button", "cancelBtn")
    cancelBtn.textContent = "Cancel"

    const submitBtn = createAnElement("button", "submitBtn")
    submitBtn.textContent = submitBtnName

    formActionBtnsDiv.appendChild(cancelBtn)
    formActionBtnsDiv.appendChild(submitBtn)
    return formActionBtnsDiv
}
const closeForm=() =>{
    const popUpForm = document.querySelector(".popUpForm")
    const modal = document.querySelector(".modal")
    const formTag = document.querySelector('.form')
    popUpForm.style.display = "none"
    modal.style.display = "none"
    formTag.reset()  //Clears the form
    
}
const createFormField = (attributeName, inputAttributeType)=>{
    const formField = createAnElement("div", "formField")
    const formLabel = createLabel(attributeName)
    const formInput = createInput(attributeName, inputAttributeType.toLowerCase())
    formField.appendChild(formLabel)
    formField.appendChild(formInput)
    return formField
}
const createLabel = (forAttributeName) =>{
    const label = createAnElement("label", "label")
    label.setAttribute("for", forAttributeName.toLowerCase())
    label.textContent = forAttributeName
    return label
}
const createInput = (nameAttribute, typeAttributeName)=>{
    const input = createAnElement("input", "input")
    input.setAttribute("type", typeAttributeName)
    input.setAttribute("name", nameAttribute.toLowerCase())
    input.setAttribute("id", nameAttribute.toLowerCase())
    return input
}
const createTextArea = (textAreaName)=>{
    const formField = createAnElement("div", "formField")
    const textArea = createAnElement("textarea", "textArea")
    textArea.setAttribute("rows", "4")
    textArea.setAttribute("cols", "20")
    textArea.setAttribute("name", textAreaName.toLowerCase())
    textArea.setAttribute("id", textAreaName.toLowerCase())
    const label = createLabel("Description")
    formField.appendChild(label)
    formField.appendChild(textArea)
    return formField
}
const createPriorityField = ()=>{
    const formField = createAnElement("div", "formField")
    const label = createLabel("Priority")
    formField.appendChild(label)
    const select = createAnElement("select", "select")
    select.setAttribute('id', "priority")
    formField.appendChild(select)
    
    const optionsPlaceHolderMsg = createAnElement("option", "placeHolderMsg")
    optionsPlaceHolderMsg.textContent = "How important is this task?"
    optionsPlaceHolderMsg.value = "Low"
    optionsPlaceHolderMsg.selected = true
    optionsPlaceHolderMsg.hidden = true

    select.appendChild(optionsPlaceHolderMsg)

    const options = ["Low", "Medium", "High"]
    for(let i=0; i<options.length; i++){
        const option = createAnElement("option", "option")
        option.setAttribute("value", options[i])
        option.textContent = options[i]
        select.appendChild(option)
    }
    return formField
}

export{
    createAnElement,
    createAnImg,
    createForm,
    createDeleteWarninMsg,
    createInput,
    closeForm,
    createFormActionSection,
    createFormTitleSection,
    createProjectForm
}