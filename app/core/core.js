import todoReducer from "./reducer.js";
export default HTML;
// just in case
function HTML([f, ...subStr],...$$) {
    return subStr.reduce((a,s,i)=>a.concat($$[i], s),[f]).filter(e=>((e && e!==true)||e===0)).join("");
}
// redux core 2
function createStore(reducer) {
    return function (appData) {
        let state={};
        const appMap = new Map();
        function renderAll() {
            for (const [root, component] of appMap) {
                root.innerHTML = component().dom;
            }
        }
        return {
            // dinh kem lenh
            initStore() {
                const appStore = appData.store.data;
                state = appStore;
            },
            attach(domNode, component) {
                appMap.set(domNode, component);
            },
            render(root = "all", callback = ()=>{}) {
                if (root == "all") {
                    renderAll();
                } else {
                    const component = appMap.get(root);
                    const output = component();
                    root.innerHTML = output.getDOM();
                    callback(output.length);
                }
            },
            connect(selector = (state)=>state) { // connectWith (app), connectWith = connect(state=>{state})
                return (component)=>{ // connectWith (app)
                    return (props, ...args) => {
                        // console.log(Object.assign({}, props, selector(state), args))
                        return component(Object.assign({}, props, selector(state), args)); // connectWith (appBruh)
                    }
                }
            },
            dispatch(action, ...arg) {
                state = reducer(state, action, arg);
            }
        }
    }
}

// redux core.
function createStore2( reducer ) {
    let state = reducer();
    const appMap = new Map();
    function renderAll() {
        for (const [root, component] of appMap) {
            root.innerHTML = component().dom;
        }
    }
    return {
        // dinh kem lenh
        initStore(appData) {
            const appStore = appData.store.data;
            state
        },
        attach(domNode, component) {
            appMap.set(domNode, component);
        },
        render(root = "all", callback = ()=>{}) {
            if (root == "all") {
                renderAll();
            } else {
                const component = appMap.get(root);
                const output = component();
                root.innerHTML = output.getDOM();
                callback(output.length);
            }
        },
        connect(selector = (state)=>state) { // connectWith (app), connectWith = connect(state=>{state})
            return (component)=>{ // connectWith (app)
                return (props, ...args) => {
                    
                    return component(Object.assign({}, props, selector, args)); // connectWith (appBruh)
                }
            }
        },
        dispatch(action, ...arg) {
            state = reducer(state, action, arg);
        }
    }
}

const initStore = createStore(todoReducer);

// const { attach, connect, dispatch, render, initStore } = 
export { initStore };
// export { attach, connect, dispatch, render, initStore } ;
