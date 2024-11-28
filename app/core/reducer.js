function init() {
    return {
        todoList: [
            // {
            //     id: "vjivioi849-343423-222-33s3",
            //     name: "Make a cupcake dish",
            //     status: "done"
            // },
            // {
            //     id: "44rfvvccc-33ecddd-33dd-ccd",
            //     name: "Finish task 3 / chapter 32",
            //     status: "done"
            // },
            // {
            //     id: "de4vvvffd-33ecddd-eeef-tee",
            //     name: "Order a hamburger",
            //     status: "active"
            // },
        ],
        bruh: [1,2,3,4,5,6]
    }
}


export default function todoReducer (state = init(), action, ...arg) {
    //const ul = state;
    switch (action) {
        case "method:add": 
            const data = arg[0][0];
            //console.log(state);
            state.todoList.push(data);
            return state;
            break;
        default:
            return state;
            break;
    }

}