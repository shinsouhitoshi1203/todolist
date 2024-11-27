function init() {
    return {
        todoList: [
            {
                id: "vjivioi849-343423-222-33s3",
                name: "Make a cupcake dish",
                status: "active"
            },
            {
                id: "44rfvvccc-33ecddd-33dd-ccd",
                name: "Finish task 3 / chapter 32",
                status: "active"
            },
            {
                id: "44rfvvccc-33ecddd-33dd-ccd",
                name: "Finish task 3 / chapter 32",
                status: "active"
            },
            {
                id: "44rfvvccc-33ecddd-33dd-ccd",
                name: "Finish task 3 / chapter 32",
                status: "active"
            },
            {
                id: "44rfvvccc-33ecddd-33dd-ccd",
                name: "Finish task 3 / chapter 32",
                status: "active"
            },
            {
                id: "44rfvvccc-33ecddd-33dd-ccd",
                name: "Finish task 3 / chapter 32",
                status: "active"
            },
            {
                id: "44rfvvccc-33ecddd-33dd-ccd",
                name: "Finish task 3 / chapter 32",
                status: "active"
            },
            {
                id: "44rfvvccc-33ecddd-33dd-ccd",
                name: "Finish task 3 / chapter 32",
                status: "active"
            },
            {
                id: "44rfvvccc-33ecddd-33dd-ccd",
                name: "Finish task 3 / chapter 32",
                status: "active"
            },
            {
                id: "44rfvvccc-33ecddd-33dd-ccd",
                name: "Finish task 3 / chapter 32",
                status: "active"
            },
            {
                id: "44rfvvccc-33ecddd-33dd-ccd",
                name: "Finish task 3 / chapter 32",
                status: "active"
            },
            {
                id: "44rfvvccc-33ecddd-33dd-ccd",
                name: "Finish task 3 / chapter 32",
                status: "active"
            },
        ]
    }
}


export default function todoReducer (state = init(), action, ...arg) {
    const ul = state.todoList;
    switch (action) {
        case "method:view-active": 
            return ul.filter((e)=>e.status=="active")
            break;
        case "method:add": 
            return ul.filter((e)=>e.status=="active")
            break;
        default:
            return ul;
            break;
    }

}