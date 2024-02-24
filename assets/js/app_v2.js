import { initTasks, saveTasks } from "./storage.js";

window.onload = () => {
  tasks = initTasks(tasks);
  var tab = document.querySelector("#table tbody");
  const form = document.querySelector("form#taskForm");
  const allow = document.querySelector("button#allow");
  let currentTask = undefined;
  var viewTab = document.querySelector("#tables tbody");
  var viewImg = document.querySelector(".imageIllus");
  const imgPreview = document.getElementById("preview");

  // copie
  let currentData = [...tasks];
  var url = "";

  const taskModal = new bootstrap.Modal(document.getElementById("taskModal"));
  const alertModal = new bootstrap.Modal(document.getElementById("alertModal"));
  const viewModal = new bootstrap.Modal(document.getElementById("viewModal"));
  const SeachForm = document.querySelector(" form#search");
  var inputSearch = SeachForm.querySelector("input");

  var statusRadions = document.querySelectorAll("#statusForm input");
  var orderRadio = document.querySelectorAll("#order input");

  /******************************************** SEARCH FUNCTION *********** */
  const SearchItem = (event) => {
    event.preventDefault();
    let tag = SeachForm.elements["search"].value.trim();
    currentData = [...tasks];

    currentData = currentData.filter(
      (t) => t.name.toLowerCase().search(tag.toLowerCase()) !== -1
    );
    afficher_list();
  };

  /******************************************** FILTERS FUNCTION *********** */

  const filterItem = (event) => {
    event.preventDefault();
    let tag = event.target.value;
    console.log(tag);
    currentData = [...tasks];

    currentData = currentData.filter(
      (t) => t.status.toLowerCase().search(tag.toLowerCase()) !== -1
    );
    tag === "Tout" ? (currentData = [...tasks]) : null;

    afficher_list();
  };
  const orderFilter = (event) => {
    let tag = event.target.value.trim();
    currentData = [...tasks];
    tag === "desc"
      ? currentData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      : tag === "asc"
      ? currentData.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        )
      : null;
    afficher_list();
  };

  const filter_byRadio = () => {
    statusRadions.forEach((elem) => {
      elem.onchange = filterItem;
    });
    orderRadio.forEach((elm) => {
      elm.onchange = orderFilter;
    });
  };
  filter_byRadio();

  /******************************************** HANDLE EDIT *********** */

  const handleEdit = (event) => {
    const id = event.target.dataset.id;
    currentTask = tasks.find((t) => t._id == id);

    form.elements["name"].value = currentTask.name;
    form.elements["description"].value = currentTask.description;
    form.elements["status"].value = currentTask.status;
    url = currentTask.imageUrl;
    imgPreview.classList.remove("d-none");

    imgPreview.src = currentTask.imageUrl;

    taskModal.show();
  };

  /******************************************** HANDLE DELETE *********** */
  const handleDelete = (event) => {
    console.log("hello");
    const id = event.target.dataset.id;
    currentTask = tasks.find((t) => t._id == id);
    console.log(currentTask);
    // deleteTodo(currentTask._id)
    alertModal.show();
  };

  /******************************************** HANDLE IMAGES*********** */

  function handleImageSelect(event) {
    const file = event.target.files[0]; // Récupère le premier fichier sélectionné
    const reader = new FileReader();

    // Fonction appelée lorsque la lecture est terminée
    reader.onload = function (event) {
      url = event.target.result; // URL de l'image

      imgPreview.src = url; // Affiche l'image dans l'élément <img>
      imgPreview.classList.remove("d-none");
    };

    // Lance la lecture du fichier en tant que data URL
    reader.readAsDataURL(file);
  }

  // Écouteur d'événement pour le changement de fichier

  /******************************************** HANDLE VIEW *********** */
  const handleView = (event) => {
    console.log("hello");
    const id = event.target.dataset.id;
    currentTask = tasks.find((t) => t._id == id);
    viewTab.innerHTML = `
    <tr>
      <th scope="row">${id}</th>
      <td>${currentTask.name}</td>
      <td>${currentTask.description}</td>
      <td>${currentTask.status}</td>
      <td>${currentTask.created_at}</td>
      <td>${currentTask.updated_at}</td>
     
    </tr>
    
    
    `;
    viewImg.innerHTML = `
    <img src="${currentTask.imageUrl}" width="150rem">`;
    viewModal.show();
  };

  /******************************************** AFFICHER LIST *********** */
  const afficher_list = (newTasks = currentData) => {
    tab.innerHTML = "";
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
        <div class='d-flex flex-wrap gap-1'>
          <button class='btn btn-success view' data-id='${
            task._id
          }'> View </button>
          <button class='btn btn-warning edit' data-id='${
            task._id
          }'> Edit </button>
          <button class='btn btn-danger delete'  data-bs-target="#taskModal" data-id='${
            task._id
          }'> Delete </button>
        </div>
        </td>
      </tr>
      `;
    });
    var addButtons = document.querySelector("#ajout");

    const editBouttons = document.querySelectorAll("button.edit");
    editBouttons.forEach((editButton) => {
      editButton.onclick = handleEdit;
    });
    const deleteButtons = document.querySelectorAll("button.delete");
    deleteButtons.forEach((deleteButton) => {
      deleteButton.onclick = handleDelete;
    });
    const viewButtons = document.querySelectorAll("button.view");
    viewButtons.forEach((viewButton) => {
      viewButton.onclick = handleView;
    });

    addButtons.onclick = () => {
      form.reset();
      url = "";
      imgPreview.src = "";
      currentTask = undefined;
      imgPreview.classList.add("d-none");
      taskModal.show();
    };

    // return tab
  };

  afficher_list();

  /******************************************** VALIDATE TODO *********** */

  const validateTodo = (todo) => {
    let errors = {};
    if (!todo.name) {
      errors.name = "Name is required !";
    }
    if (!todo.description) {
      errors.description = "Description is required !";
    }

    if (!todo.status) {
      errors.status = "status is required";
    }
    if (!todo.imageUrl) {
      errors.imageUrl = "veuillez entrer une image";
    }
    return errors;
  };

  /******************************************** DISPLAY ERROR *********** */
  const displayErrors = (errors) => {
    const errorNames = Object.keys(errors);
    errorNames.forEach((name) => {
      const errorDiv = document.querySelector(".error-" + name);
      errorDiv.innerHTML = errors[name];
      setTimeout(() => {
        errorDiv.innerHTML = "";
      }, 2000);
    });
  };

  /******************************************** ADD TODO *********** */
  const addTodo = (todo) => {
    console.log("========== add todo =============", todo);
    tasks.unshift(todo);
    saveTasks(tasks);
    currentData = [...tasks];
    afficher_list();
  };

  /********************************************  UPDATE TODO *********** */

  const updateTodo = (id, todo) => {
    const index = tasks.findIndex((t) => t._id == id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...todo, updated_at: new Date() };
    }

    saveTasks(tasks);
    currentData = [...tasks];
    afficher_list();
  };

  /******************************************** DELETE TODO *********** */

  const deleteTodo = (id) => {
    tasks = tasks.filter((t) => t._id !== id);
    saveTasks(tasks);
    currentData = [...tasks];
    afficher_list();
  };
  /******************************************** HANDLE DELETE TODO *********** */

  const handleDeleteTask = () => {
    deleteTodo(currentTask._id);
    console.log("hello");
    afficher_list(tasks);
    alertModal.hide();
  };

  /******************************************** HANDLE SUBMIT*********** */
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("=================== Submit ===============");
    const newTask = {
      name: form.elements["name"].value,
      description: form.elements["description"].value,
      status: Array.from(form.elements["status"]).find((radio) => radio.checked)
        ?.value,
      created_at: new Date(),
      imageUrl: url,
      updated_at: null,
    };
    console.log({ newTask });
    let errors = validateTodo(newTask);
    console.log({ errors });
    if (Object.keys(errors).length) {
      displayErrors(errors);
      return;
    }

    if (currentTask) {
      // update
      updateTodo(currentTask._id, newTask);
      taskModal.hide();
    } else {
      // add
      (newTask._id = Math.round(Math.random() * 9999)), addTodo(newTask);
      taskModal.hide();
    }
  };

  document
    .getElementById("imageIllustr")
    .addEventListener("change", handleImageSelect);
  allow.onclick = handleDeleteTask;
  form.onsubmit = handleSubmit;
  SeachForm.onsubmit = SearchItem;
  inputSearch.onkeyup = SearchItem;
};
