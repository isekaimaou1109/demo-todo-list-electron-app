const path = require('path')
const EventEmitter = require('events')

const title = document.body.querySelector('.header').firstElementChild
const searchInput = document.querySelector('#search')
const wrapper = document.querySelector('#content-container')
const taskContainer = document.createElement('div')
taskContainer.id = 'task-container'

const icon = document.querySelector('#content-container')
                     .querySelector('#todo-adder')
                     .querySelector('.fas')
const data = []

var lgt = document.createElement('p')
var comp = Array.from(taskContainer.childNodes).filter(child => child.getAttribute('aria-state') === true).length || 0

if(Array.from(taskContainer.childNodes).length === 0) {
    icon.style.visibility = 'hidden'
}

wrapper.append(taskContainer)                    

async function createStateContainer() {
    const stateContainer = document.createElement('div')

    const wrapfilter = document.createElement('div')
    const all = document.createElement('button')
    const filter = document.createElement('button')
    const completed = document.createElement('button')

    wrapfilter.append(all)
    wrapfilter.append(filter)
    wrapfilter.append(completed)
    wrapfilter.id = 'process'

    const clearCompleted = document.createElement('a')
    clearCompleted.className = 'clear-completed'
    clearCompleted.setAttribute('aria-hidden', true)
    clearCompleted.innerText = 'Clear Completed'

    stateContainer.id = 'state-container'

    lgt.className = 'count'
    
    all.innerHTML = 'All'
    filter.innerText = 'Active'
    completed.innerText = 'Completed'

    all.classList.add('btn')
    filter.classList.add('btn')
    completed.classList.add('btn')

    all.addEventListener('click', function(event) {
        event.preventDefault()

        const allChildren = taskContainer.querySelectorAll('.task-wrap')

        allChildren.forEach(child => {
            child.style.display = 'flex'
        })

        return true
    }, false)

    filter.addEventListener('click', function(event) {
        event.preventDefault()

        const completedList = taskContainer.querySelectorAll('.task-wrap')

        completedList.forEach((child) => {
            if(child.getAttribute('aria-state') === 'true') {
                child.style.display = 'none'
            } else {
                child.style.display = 'flex'
            }
        })

        return true
    }, false)

    completed.addEventListener('click', function(event) {
        event.preventDefault()

        const notCompletedList = taskContainer.querySelectorAll('.task-wrap')

        notCompletedList.forEach((child) => {
            if(child.getAttribute('aria-state') === 'false') {
                child.style.display = 'none'
            } else {
                child.style.display = 'flex'
            }
        })

        return true
    }, false)

    clearCompleted.addEventListener('click', function(event) {
        event.preventDefault()

        const allCompletedChildren = taskContainer.querySelectorAll('.task-wrap')

        for(let i = 0; i < allCompletedChildren.length; i++) {
            if(allCompletedChildren[i].getAttribute('aria-state') === 'true') {
                taskContainer.removeChild(allCompletedChildren[i])
            }
        }

        if(comp === 0) {
            wrapper.removeChild(wrapper.querySelector('#state-container'))
        }

        if(document.querySelector('#container').querySelector('#layer-2') && document.querySelector('#container').querySelector('#layer-3') && Array.from(taskContainer.childNodes).length === 0) {
            document.querySelector('#container').removeChild(document.querySelector('#container').querySelector('#layer-2'))
            document.querySelector('#container').removeChild(document.querySelector('#container').querySelector('#layer-3'))
        }

        return true
    }, false)

    stateContainer.append(lgt)
    stateContainer.append(wrapfilter)
    stateContainer.append(clearCompleted)

    wrapper.append(stateContainer)

    return true
}

searchInput.addEventListener('keypress', function(event) {
    let key = event.keyCode
    let value = event.target.value

    if(key === 13 && value.length !== 0) {
        const layer_2 = document.createElement('div')
        const layer_3 = document.createElement('div')
        layer_2.id = 'layer-2'
        layer_3.id = 'layer-3'


        comp += 1
        lgt.textContent = `${comp} items left`

        icon.style.visibility = 'visible'
        data.push(value)
        const index = data.indexOf(value) > -1 && data.lastIndexOf(value) > -1 ? data.lastIndexOf(value) : data.indexOf(value)

        const wrapperJob = document.createElement('div')
        const job = document.createElement('div')
        const cancelJob = document.createElement('i')
        const toggleJob = document.createElement('i')

        cancelJob.className = 'fa fa-times'
        cancelJob.setAttribute('aria-label', 'delete task')

        toggleJob.setAttribute('aria-hidden', true)
        toggleJob.setAttribute('aria-label', 'ActiveOrNot')
        toggleJob.className = 'fa fa-circle-o'

        wrapperJob.className = 'task-wrap'
        wrapperJob.setAttribute('aria-state', false)
        wrapperJob.append(toggleJob)
        wrapperJob.append(job)
        wrapperJob.append(cancelJob)

        if(!document.querySelector('#container').querySelector('#layer-2') && !document.querySelector('#container').querySelector('#layer-3')) {
            document.querySelector('#container').insertBefore(layer_2, document.querySelector('#footer'))
            document.querySelector('#container').append(layer_3, document.querySelector('#footer'))
        }

        cancelJob.addEventListener('click', async function(event) {
            event.preventDefault()

            const parent = cancelJob.parentNode

            if(parent.getAttribute('aria-state') === 'true') {
                comp -= 0
            } else {
                comp -= 1
            }

            await taskContainer.removeChild(parent)

            lgt.textContent = `${comp} items left`

            if(Array.from(taskContainer.childNodes).length === 0) {
                await wrapper.removeChild(wrapper.querySelector('#state-container'))
                comp = 0
                return ;
            }

            return true
        }, false)

        toggleJob.addEventListener('click', async function(event) {
            event.preventDefault()

            const regex = /fa-circle-o/igm

            if(regex.test(toggleJob.className)) {
                toggleJob.className = 'fa fa-check-circle-o'
                wrapperJob.setAttribute('aria-state', true)
                event.target.nextSibling.classList.add('task-completed')
                comp -= 1
                lgt.textContent = `${comp} items left`
            } else {
                toggleJob.className = 'fa fa-circle-o'
                wrapperJob.setAttribute('aria-state', false)
                event.target.nextSibling.className = 'task'
                comp += 1
                lgt.textContent = `${comp} items left`
            }

            return true
        }, false)

        job.className = 'task'
        job.setAttribute('aria-index', `p-${index}`)
        job.append(value)

        job.addEventListener('dblclick', async function(event) {
            event.preventDefault()

            const clone = searchInput.cloneNode(false)
            clone.id = ''
            clone.className = 'task'
            clone.placeholder = 'modify here'
            clone.value = event.target.textContent

            await job.replaceWith(clone)
            
            // document.addEventListener('keypress', function(event) {
            //     event.preventDefault()
            //     const key = event.keyCode
            //     console.log(key)
            //     if(key === 13) {
            //         const p = document.createElement('div')
            //         p.className = 'task'
            //         p.setAttribute('aria-index', `p-${index}`)
            //         p.append(event.target.value)
    
            //         job.replaceWith(p)
            //     }
    
            //     return true
            // }, false)

            return true
        }, false)

        taskContainer.append(wrapperJob)

        searchInput.value = null

        if(wrapper.querySelector('#state-container')) {
            return true; 
        }

        createStateContainer().then(() => cprocess.exit(1)).catch(e => console.error)

        return true
    }
})

document.addEventListener("selectionchange", function(event) {
    event.preventDefault()

    const selection = document.getSelection ? document.getSelection().toString() :  document.selection.createRange().toString();

    if(title.textContent === selection) {
        title.classList.toggle('selected')
    }

    return true
}, false)

icon.addEventListener('click', function(event) {
    event.preventDefault()

    let q = Array.from(taskContainer.childNodes)
    const notDone = q.filter((child) => child.getAttribute('aria-state') === 'false')
    const done = q.filter((child) => child.getAttribute('aria-state') === 'true')

    if(done.length === q.length) {
        icon.getElementsByClassName.color = 'green'

        if(comp < 0) {
            comp = notDone.length
        }

        done.forEach(async (f) => {
            await f.setAttribute('aria-state', false)
            f.firstChild.className = 'fa fa-circle-o'
            f.firstChild.nextSibling.className = 'task'
        })
        
        comp = done.length
        lgt.textContent = `${comp} items left`
        return true
    }

    notDone.forEach(async (f) => {
        await f.setAttribute('aria-state', true)
        f.firstChild.className = 'fa fa-check-circle-o'
        f.firstChild.nextSibling.className = 'task task-completed'
        comp -= 1
        lgt.textContent = `${comp} items left`
    })

    return true
}, false)

