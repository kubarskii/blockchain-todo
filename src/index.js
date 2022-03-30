import {Block} from './block'
import {BlockChain} from './blockchain'

const btn = document.getElementById('create')
const list = document.getElementById('task-list')

const chain = new BlockChain({difficulty: 4})

const render = (arr) => {
    list.innerHTML = ''
    list.innerHTML = arr.reduce((acc, curr) => {
        return `${acc}<li>${JSON.stringify(curr)}</li>`
    }, '')
}

chain.subscribe((data) => {
    console.log(data)
    render(data.map(el => {
        return el?._data?.state || ''
    }))
})

/**
 * Contract:
 * {
 *     operation: 'CREATE' | 'DELETE' | 'UPDATE'
 *     change: {Action},
 *     prevState: {S}
 *     state: {S}
 * }
 * */

const actionTypes = {
    TODO_MINING: 'TODO_MINING',
    TODO_CREATE: 'TODO_CREATE',
    TODO_DELETE: 'TODO_DELETE',
    TODO_UPDATE: 'TODO_UPDATE',
}

const todoActions = {
    create: (payload) => ({
        type: actionTypes.TODO_CREATE,
        payload
    }),
    delete: (id) => ({
        type: actionTypes.TODO_DELETE,
        payload: id
    }),
    update: (id, value) => ({
        type: actionTypes.TODO_UPDATE,
        payload: {
            id,
            value
        }
    }),
}

/**
 * @var {Array<ToDo>} defaultTodos.items
 * */
const defaultTodos = {
    items: []
}

const todoReducer = (state = chain.value, action) => {
    const {type, payload} = action

    switch (type) {
        case actionTypes.TODO_CREATE: {
            return {
                ...state,
                items: [
                    ...state.items,
                    payload
                ]
            }
        }
        case actionTypes.TODO_UPDATE: {
            return {
                ...state,
                items: [
                    ...state.items.slice(0, id),
                    payload,
                    ...state.items.slice(id + 1, state.items.length)
                ]
            }
        }
        case actionTypes.TODO_DELETE: {
            return {
                ...state,
                items: [
                    ...state.items.slice(0, id),
                    ...state.items.slice(id + 1, state.items.length)
                ]
            }
        }
        default:
            state
    }

}


btn.addEventListener('click', () => {
    const block = new Block({
        operation: 'CREATE',
        state: Math.random(),
    })
    chain.add(block)
})


