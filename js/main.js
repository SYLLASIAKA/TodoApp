import TodoItem from "./TodoItem.js"
import TodoList from "./TodoList.js";

const todoList = new TodoList();
let pages;
let currentItem = 0
let currentOption = 'All'
let currentSearch = ''
const nameInput = document.querySelector('#addNameInput')
const categoryInput = document.querySelector('#addCategoryInput')
const submitInput = document.querySelector('#submitInput')
const form = document.querySelector('form')
const ul = document.querySelector('ul')
const del = document.querySelector('.fa-trash')
const sta = document.querySelector('.stats')
const avanceItem = document.querySelector('.fa-chevron-right')
const reculeItem = document.querySelector('.fa-chevron-left')
const spanNavigate = document.querySelector('.navigatePage')
const Filter = document.querySelector('#filter')
const inputSearch = document.querySelector('#search')

// =========================== style ================================
const closeForm = document.querySelector('#closeForm')
const closeOption = document.querySelector('#closeOption')
const closeStats = document.querySelector('#closeStats')
const form__container = document.querySelector('.form__container')
const stats__div = document.querySelector('.stats__div')
const options = document.querySelector('.options')
const button__1 = document.querySelector('.button__1')
const button__2 = document.querySelector('.button__2')
const button__3 = document.querySelector('.button__3')

let estVisible = false

const changeDisplay = (change) => {
    if (estVisible) {
        change.style.display = "none";
        estVisible = false;
    } else {
        if (form__container.style.display == "block") {
            form__container.style.display = 'none'
        }
        if (options.style.display == "block") {
            options.style.display = 'none'
        }
        if (stats__div.style.display == "block") {
            stats__div.style.display = 'none'
        }
        change.style.display = "block";
        estVisible = true;
    }
}

button__1.addEventListener('click', () => {
    changeDisplay(form__container)
})
closeForm.addEventListener('click', () => {
    changeDisplay(form__container)
})
button__2.addEventListener('click', () => {
    changeDisplay(options)
})
closeOption.addEventListener('click', () => {
    changeDisplay(options)
})
button__3.addEventListener('click', () => {
    changeDisplay(stats__div)
})
closeStats.addEventListener('click', () => {
    changeDisplay(stats__div)
})


const app = {
    init() {
        nameInput.addEventListener('input', listen)
        categoryInput.addEventListener('input', listen)
        form.addEventListener('submit', this.addtodolist)
        del.addEventListener('click', this.clearTodos)
        avanceItem.addEventListener('click', navigateNext)
        reculeItem.addEventListener('click', navigatePrevious)
        Filter.addEventListener('change', app.filtrer)
        inputSearch.addEventListener('input', app.searchinput)
        app.deleted()
        app.getPersist()
        statAddDom(calculStat())
        selectfuntion()
    },
    addtodolist(e) {
        e.preventDefault()
        if (nameInput.value.trim() && categoryInput.value.trim()) {
            const id = addid()
            const name = nameInput.value.trim()
            const category = categoryInput.value.trim()
            const date = new Date()
            const item = createItem(id, name, category, date)
            todoList.addItemToList(item)
            statAddDom(calculStat())
            app.persist()
            resetUI()
            addItem()
            selectfuntion()
        } else {
            alert('entrez les nom et categorie proprement')
            submitInput.disabled = true
        }
    },
    clearTodos() {
        if (todoList.getListLength()) {
            const comfirmed = confirm('Êtes-vous sûr de vouloir supprimez tous les elements de la todos')
            if (comfirmed) {
                todoList.clearList()
                statAddDom(calculStat())
                app.persist()
                addItem()
                selectfuntion()
            }
        }
    },
    deleted() {
        ul.addEventListener('click', (event) => {
            if (event.target && event.target.matches('i.fa-close')) {
                const id = event.target.parentElement.getAttribute('id')
                todoList.removeItemFromList(id)
                statAddDom(calculStat())
                app.persist()
                addItem()
                selectfuntion()
            }
        })
    },
    persist() {
        localStorage.setItem("todoData", JSON.stringify(todoList.getList()))
    },
    getPersist() {
        const data = JSON.parse(localStorage.getItem('todoData'));
        if (data !== null) {
            data.map((e) => {
                const item = createItem(e._id, e._name, e._category, e._date);
                todoList.addItemToList(item);
            });
            addItem()
        } else {
            console.log("Aucune donnée n'a été trouvée dans localStorage.");
        }
    },
    filtrer(e) {
        currentOption = e.target.value
        addItem()
    },
    searchinput() {
        if (inputSearch.value.trim() !== '') {
            currentSearch = inputSearch.value
        } else {
            currentSearch = ''
        }
        addItem()
    }
}


const listen = () => {
    if (nameInput.value.trim() && categoryInput.value.trim()) {
        submitInput.disabled = false
    } else {
        submitInput.disabled = true
    }
}

const addid = () => {
    let nextId = 1
    if (todoList.getListLength()) {
        nextId = todoList.getList()[todoList.getListLength() - 1].id + 1
    }
    return nextId
}

const createItem = (id, name, category, date) => {
    const todoItem = new TodoItem()
    todoItem.id = id
    todoItem.name = name
    todoItem.category = category
    todoItem.date = date
    return todoItem
}

const resetUI = () => {
    nameInput.value = ""
    categoryInput.value = ""
    submitInput.disabled = true
}

const addDom = (e) => {
    const li = document.createElement('li')
    const span = document.createElement('span')
    const i = document.createElement('i')
    span.innerText = e.category
    li.innerText = e.name
    i.classList.add("fa", "fa-close")
    li.setAttribute("id", e.id)
    li.append(span, i)
    ul.appendChild(li)
}

const addItem = () => {
    ul.innerHTML = ''
    let ui;
    if (todoList.getList().length) {
        if (currentOption !== 'All') {
            ui = todoList.getList().filter(e => e._category == currentOption)
        } else {
            ui = todoList.getList()
        }
    } else {
        console.log("0 element dans la todolist")
    }
    if (currentSearch != '') {
        ui = ui.filter(e => e._name.includes(currentSearch))
    }

    if (ui.length === 0) {

    } else {
        addPage(ui)[currentItem].map(e => addDom(e))
    }
}

const calculStat = () => {
    const total = todoList.getListLength()
    let aggregate
    if (total > 0) {
        aggregate = todoList.getList().reduce((acc, curr) => {
            const { _category } = curr
            acc[_category] = acc[_category] + 1 || 1
            return acc
        }, {})
    }
    return { aggregate, total }
}

const statAddDom = (stats) => {
    sta.innerHTML = ''
    const totalDiv = document.createElement('div')
    totalDiv.innerHTML = `Total : <b>${stats.total}</b>`
    sta.appendChild(totalDiv)
    const aggregateDiv = document.createElement('div')
    if (typeof stats.aggregate !== 'undefined') {
        for (let h in stats.aggregate) {
            const aggrespan = document.createElement('span')
            aggrespan.innerHTML = `${h} : ${stats.aggregate[h]}`
            aggregateDiv.appendChild(aggrespan)
        }
        sta.appendChild(aggregateDiv)
    }
}

const addPage = (listes) => {
    const liste = listes.slice().reverse()
    const nbPpAge = 10
    pages = Math.ceil(liste.length > 0 ? liste.length / nbPpAge : 0)

    spanNavigate.firstElementChild.textContent = pages !== 0 ? currentItem + 1 : currentItem
    spanNavigate.lastElementChild.textContent = pages
    const paginateItems = Array.from({ length: pages }, (_, index) => {
        const start = index * nbPpAge
        return liste.slice(start, start + nbPpAge)
    })

    return paginateItems
}

const navigateNext = () => {
    currentItem = (currentItem + 1) % pages
    addItem()
}

const navigatePrevious = () => {
    currentItem = (currentItem - 1 + pages) % pages
    addItem()
}

const selectfuntion = () => {
    Filter.innerHTML = ''
    if (todoList.getList().length) {
        const newTable = ['All', ...new Set(todoList.getList().slice().map(e => e.category))]
        newTable.map(e => {
            const option = document.createElement('option')
            option.value = e
            option.textContent = e
            option.selected = e === currentOption
            Filter.appendChild(option)
        })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    app.init()
})







