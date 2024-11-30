export default function todoReducer (state, action, ...arg) {
    //const ul = state;
    switch (action) {
        case "method:add": 
            const data = arg[0][0];
            state.todoList.push(data);
            return state;
            break;
        default:
            return state;
            break;
    }

}