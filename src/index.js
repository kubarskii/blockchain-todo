import {BlockChain} from './blockchain'
import {Block} from "./block";

const uid = () => Math.random().toString().slice(2)

const list = document.getElementById('list')

const chain = new BlockChain({difficulty: 4})

const render = (arr) => {
    const pendingTasks = chain.semaphor.requests;
    list.innerHTML = ''
    list.innerHTML = arr.reduce((acc, curr) => {
        return `${acc}<li>${JSON.stringify(curr)}</li>`
    }, '').concat(pendingTasks.reduce((acc, curr) => {
        return `${acc}<li style="font-size: 6px" ><div class="spinner spinner--gray"></div></li>`
    }, ''))
}

chain.subscribe((data) => {
    console.log(data)
    render(data.slice(1).map(el => {
        return el?._data
    }))
})

const form = document.getElementById('todo-form')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const {task} = form
    if (task) {
        chain.add(new Block({
            operation: 'CREATE',
            data: {
                task: task.value,
                id: uid()
            }
        }))
        task.value = ''
    }
})
