/* Variables */
var addBtn = document.getElementById('add-btn');
var addModal = document.getElementById('add-modal');
var menuBtn = document.getElementById('menu-btn');
var sidebar = document.getElementById('sidebar');

var acceptBtn = document.getElementById('accept-btn');
var doingList = document.getElementById('task-list-doing');

var completedList = document.getElementById('task-list-completed');

var LIST;

/* Menu */
menuBtn.onclick = function() {
    sidebar.style.display = "block";
}

/* Modal */
addBtn.onclick = function () {
    addModal.style.display = "block";
    var input = document.getElementById('input-task');
    input.value = '';
}

window.onclick = function (event) {
    if (event.target == addModal) {
        addModal.style.display = "none";
    }
    if(event.target == sidebar){
        sidebar.style.display = "none";
    }
}

/* Load Data From Storage */
var data = localStorage.getItem('lists');

if (data) {
    LIST = JSON.parse(data);
    loadList();
} else {
    LIST = [];
}

function addTask(input, id, checked) {
    if (!checked) {
        const li = `<li class="task-item">
        <input type="checkbox" name="" id="${id}">
        <label for="${id}" class="task-content">${input}</label>
        <button class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
        </li>
        `;
        doingList.insertAdjacentHTML('beforeend', li);
    } else {
        const li = `<li class="task-item">
        <input type="checkbox" name="" id="${id}" checked>
        <label for="${id}" class="task-content">${input}</label>
        <button class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
        </li>
        `;
        completedList.insertAdjacentHTML("beforeend", li);
    }
}

function pushToList(input) {
    LIST.push({
        name: input,
        id: LIST.length,
        checked: false
    });
    localStorage.setItem('lists', JSON.stringify(LIST));
}

function loadList(){
    for(var i = 0; i < LIST.length; i++){
        addTask(LIST[i].name, LIST[i].id, LIST[i].checked);
    }
}

/* Add task */
acceptBtn.onclick = function () {

    var taskInput = document.getElementById('input-task').value;

    if (taskInput == '') {
        alert("Bạn chưa nhập nội dung của việc cần làm! Vui lòng nhập nội dung trước khi thêm!");
        return;
    }
    addTask(taskInput, LIST.length, false);
    pushToList(taskInput);
    addModal.style.display = "none";
}

/* Delete task */

function removeTask(elm) {
    const elementClass = elm.className;
    var ID = '';
    if (elementClass == "delete-btn") {
        ID = elm.parentElement.getElementsByTagName('input')[0].id;
        elm.parentElement.remove();
    } else if (elementClass == "fa-solid fa-trash-can") {
        ID = elm.parentElement.parentElement.getElementsByTagName('input')[0].id;
        elm.parentElement.parentElement.remove();
    }
    if (ID == '') return;
    LIST.splice(ID,1);
    for(var i = ID; i < LIST.length; i++){
        LIST[i].id--;
    }
}

/* Add Completed Task */
var taskComp = '';
var tempID;

function removeCompTask(elm) {
    const elementClass = elm.className;
    var ID = '';
    ID = elm.getAttribute('for');
    tempID = ID;
    taskComp = elm.textContent;
    elm.parentElement.remove();
    if (ID == '') return;
    if(LIST[ID].checked) LIST[ID].checked = false;
    else LIST[ID].checked = true;
}

doingList.addEventListener('click', function (event) {
    const element = event.target;
    if (element.className == 'delete-btn' || element.className == 'fa-solid fa-trash-can') {
        removeTask(element);
    }
    if (element.className == 'task-content') {
        removeCompTask(element);
        if (taskComp == '') return;
        addTask(taskComp, tempID, true);
    }
    localStorage.setItem('lists', JSON.stringify(LIST));
});

completedList.addEventListener('click', function (event) {
    const element = event.target;
    if (element.className == 'delete-btn' || element.className == 'fa-solid fa-trash-can') {
        removeTask(element);
    }
    if (element.className == 'task-content') {
        removeCompTask(element);
        if (taskComp == '') return;
        addTask(taskComp, tempID, false);
    }
    localStorage.setItem('lists', JSON.stringify(LIST));
});