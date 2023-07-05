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
    form.appendChild(createTextArea("Description"))
    form.appendChild(createFormField("Due_Date", "Date"))
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
    optionsPlaceHolderMsg.setAttribute("value", "Low")
    optionsPlaceHolderMsg.selected = true
    optionsPlaceHolderMsg.disabled = true

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
    createInput
}