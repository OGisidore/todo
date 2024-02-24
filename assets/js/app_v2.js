
window.onload = () => {

  var tab = document.querySelector('#table tbody');
  const form = document.querySelector('form#taskForm')
  const allow = document.querySelector('button#allow')
  let currentTask = undefined
 var viewTab = document.querySelector('#tables tbody')
 var viewImg = document.querySelector('.imageIllus')

  const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
  const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
  const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));

/******************************************** HANDLE EDIT *********** */

  const handleEdit = (event) => {
    const id = event.target.dataset.id
    currentTask = tasks.find(t => t._id == id)
    form.elements['name'].value = currentTask.name
    form.elements['description'].value = currentTask.description
    form.elements['status'].value = currentTask.status
    form.elements['image'].file = currentTask.imageUrl
    
    console.log({ currentTask });
    
    taskModal.show()

  }

  /******************************************** HANDLE DELETE *********** */
  const handleDelete = (event) => {
    console.log('hello');
    const id = event.target.dataset.id
    currentTask = tasks.find(t => t._id == id)
    console.log(currentTask);
    // deleteTodo(currentTask._id)
    alertModal.show()
  }

  /******************************************** HANDLE IMAGES*********** */
 var url = '';
  function handleImageSelect(event) {
    const file = event.target.files[0]; // Récupère le premier fichier sélectionné
    const reader = new FileReader();

    // Fonction appelée lorsque la lecture est terminée
    reader.onload = function(event) {
        url = event.target.result; // URL de l'image
        const imgPreview = document.getElementById('preview');
        imgPreview.src = url; // Affiche l'image dans l'élément <img>
    };

    // Lance la lecture du fichier en tant que data URL
    reader.readAsDataURL(file);
}

// Écouteur d'événement pour le changement de fichier
document.getElementById('imageIllustr').addEventListener('change', handleImageSelect);



/******************************************** HANDLE VIEW *********** */
  const handleView = (event) =>{
    console.log('hello');
    const id = event.target.dataset.id
    currentTask = tasks.find(t => t._id == id)
    console.log(currentTask.imageUrl);
    console.log(viewTab);
    viewTab.innerHTML =  `
    <tr>
      <th scope="row">${id}</th>
      <td>${currentTask.name}</td>
      <td>${currentTask.description}</td>
      <td>${currentTask.status}</td>
      <td>${currentTask.created_at}</td>
      <td>${currentTask.updated_at}</td>
     
    </tr>
    
    
    `
    viewImg.innerHTML = `
    <img src="${currentTask.imageUrl}" width="150rem">`
    viewModal.show()
  }
  
  /******************************************** AFFICHER LIST *********** */
  const afficher_list = (newTasks = tasks) => {
    tab.innerHTML = ''
    newTasks.forEach((task, index) => {
      // <td>${task.description}</td>
      tab.innerHTML += `
      <tr>
        <th scope="row">${index + 1}</th>
        <td>${task.name}</td>
       
        <td>${task.status}</td>
        <td>${task.created_at}</td>
        <td>${task.updated_at}</td>
        <td>
        <div class='d-flex gap-1'>
          <button class='btn btn-success view' data-id='${task._id}'> View </button>
          <button class='btn btn-warning edit' data-id='${task._id}'> Edit </button>
          <button class='btn btn-danger delete'  data-bs-target="#taskModal" data-id='${task._id}'> Delete </button>
        </div>
        </td>
      </tr>
      `


    });
    var addButtons = document.querySelector('#ajout')

    const editBouttons = document.querySelectorAll('button.edit')
    editBouttons.forEach(editButton => {
      editButton.onclick = handleEdit
    })
    const deleteButtons = document.querySelectorAll('button.delete')
    deleteButtons.forEach(deleteButton => {
      deleteButton.onclick = handleDelete
    })
    const viewButtons = document.querySelectorAll('button.view')
    viewButtons.forEach(viewButton=>{
      viewButton.onclick = handleView

    })
    addButtons.onclick = ()=>{
      form.reset()
      taskModal.show()
  }

    // return tab

  }

  afficher_list()



  /******************************************** VALIDATE TODO *********** */

  const validateTodo = (todo) => {
    let errors = {}
    if (!todo.name) {
      errors.name = 'Name is required !'
    }
    if (!todo.description) {
      errors.description = 'Description is required !'
    }
    // status = Array.from(form.elements['status']).find((radio) => radio.checked)
    if (!todo.status) {
      errors.status = 'status is required'
    }
    // A faire  
    return errors
  }

  /******************************************** DISPLAY ERROR *********** */
  const displayErrors = (errors) => {
    const errorNames = Object.keys(errors)
    errorNames.forEach(name => {
      const errorDiv = document.querySelector('.error-' + name)
      errorDiv.innerHTML = errors[name]
      setTimeout(() => {
        errorDiv.innerHTML = ""
      }, 2000)
    });
  }


  /******************************************** ADD TODO *********** */
  const addTodo = (todo) => {
    console.log('========== add todo =============', todo);
    tasks.unshift(todo)
    afficher_list(tasks)
  }

  /********************************************  UPDATE TODO *********** */

  const updateTodo = (id, todo) => {
    // update t
    const index = tasks.findIndex(t => t._id == id)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...todo, updated_at: new Date() }
    }
    currentTask = undefined
    afficher_list(tasks)
  }

  /******************************************** DELETE TODO *********** */


  const deleteTodo = (id) => {
    let index = tasks.findIndex(t => t._id == id)
    console.log(index);
    //  tasks.filter(t => t._id !== id)
    if(index !== -1){
      tasks.splice(index, 1)
    }
    currentTask = undefined
 
    // console.log(_id)
    // update 
    afficher_list(tasks)
  }
/******************************************** HANDLE DELETE TODO *********** */

  const handleDeleteTask = () => {
    // deleteTodo(currentTask._id)
    deleteTodo(currentTask._id)
    console.log('hello');
    alertModal.hide()

    // if (currentTask) {
    //   // update 
      


    // }
    /* else{
      // add
      newTask._id  = Math.round(Math.random() * 9999),
      addTodo(newTask)
      taskModal.hide()
      
    }*/

  }

  /******************************************** HANDLE SUBMIT*********** */
  const handleSubmit = (event) => {
    event.preventDefault()
    console.log("=================== Submit ===============");
    const newTask = {
      name: form.elements['name'].value,
      description: form.elements['description'].value,
      status: Array.from(form.elements['status']).find((radio) => radio.checked)?.value,
      created_at: new Date(),
      imageUrl:form.elements['image'].file ,
      updated_at: null
    }
    console.log({newTask});
    let errors = validateTodo(newTask)
    if (Object.keys(errors).length) {
      displayErrors(errors)
      return;
    }

    if (currentTask) {
      // update 
      updateTodo(currentTask._id, newTask)
      taskModal.hide()

    } else {
      // add
      newTask._id = Math.round(Math.random() * 9999),
        addTodo(newTask)
      taskModal.hide()

    }





  }




  allow.onclick = handleDeleteTask
  form.onsubmit = handleSubmit





}
