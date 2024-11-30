export default function todoReducer (state, action, ...args) {
    //const ul = state;
    const _args = args[0];
    const [itemID, itemName] = _args;

    function pos(itemID) {
        const i = state.todoList.findIndex(it=>{
            return it.id==itemID;
        });
        if (i>=0) {
            return i;
        } else {
            throw new Error ("the todo doesnt exist")
        }
    }
    switch (action) {
        case "method:add": 
            state.todoList.push(_args[0]);
            return state;
            break;
        case "method:modify":
            const i = pos(itemID);
            state.todoList[i].name = itemName; 
            return state;
            break;
        default:
            return state;
            break;
    }

}