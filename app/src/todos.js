// import swiper from 'swiper';
// import 'swiper/css';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
// import { attach, connect, render, dispatch } from './../core/core.js';
import { initStore } from '../core/core.js';
const todo = (function () {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    // messages
    const TXT = {
        empty: "<div todos-message='nothing'><p style='text-align: center; font-size: 35px; font-weight: 600; color: #bbbbbb'>¯\\_(ツ)_/¯</p><br><p style='text-align: center; color: #bbbbbb'>There is no todo right now. Wanna add one?</p></div>",
    }

    const todo = function (node = {}) { // todos__item
        if (!node) throw new Error ("You have selected wrong node, dummy");
        return {
            item: {
                //////////todos main//////////
                get name() {
                    return node.querySelector(".todos__item-name span")?.innerText ?? "";
                },
                set name(itemName) {
                    node.querySelector(".todos__item-name span").setAttribute("title", itemName);
                    node.querySelector(".todos__item-name span").innerText = itemName;
                },
                get id() {
                    return node.getAttribute("todos-item-id");
                },
                get input() {
                    return node.querySelector(".todos__item-name input");
                },
                //////////todos attributes//////////
                get status () {
                    const value = node.getAttribute("todos-item-status");
                    if (!value) {
                        throw new Error ("this node doesnt have this prop");
                    } else {
                        return value;
                    }
                },
                get mode() {
                    const value = node.getAttribute("todos-item-mode");
                    if (!value) {
                        throw new Error ("this node doesnt have this prop");
                    } else {
                        return value;
                    }
                },
                set status(newValue) {
                    const value = this.status;
                    if (!value) {
                        throw new Error ("this node doesnt have this prop");
                    } else {
                        node.setAttribute("todos-item-status", newValue);
                    }
                },
                set mode(newValue) {
                    const value = this.mode;
                    if (!value) {
                        throw new Error ("this node doesnt have this prop");
                    } else {
                        console.log(node);
                        node.setAttribute("todos-item-mode", newValue);
                    }
                }
            }
        }
    };

    function findParent(node, target, attrHTML = "") {
        // batman doesnt like this function
        let count = 0;
        target+=attrHTML;
        target = (target[0]==".")?target:"."+target;
        while (!node.matches(target)) {
            node = node.parentNode;
            count++;
            if (count == 200) return false;
        }
        return node;
    }

    function HTML([f, ...subStr],...$$) {
        return subStr.reduce((a,s,i)=>a.concat($$[i], s),[f]).filter(e=>((e && e!==true)||e===0)).join("");
    }
    function clearNode(appData) {
        const {id, objNode} = appData;
        objNode.classList.add("app-todo", "todos");
        let header = HTML`<div class="todos__form">
                <div class="todos__input">
                    <icon class="todos__icon">
                        <i class="fa-solid fa-pen fa-sm"></i>
                    </icon>
                    <input type="text" todos-input-for="${id}" placeholder="What do you want to do">
                    <button class="todos__button-plain todos__button-plain--posEnd" todos-form-command="clear">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="todos__filter">
                    <button class="todos__filter-item" todos-filter-option="active">active</button>
                    <button class="todos__filter-item" todos-filter-option="completed">completed</button>
                    <button class="todos__filter-item" todos-filter-option="all">all</button>
                </div>
            </div>`;

            
        let main = HTML`
            <div class="todos__view">
                <div class="swiper" todos-sliding-container="switch-mode"> 
                    <div class="swiper-wrapper">
                        
                        <div class="swiper-slide todos__view-item" todos-view-item="active" >
                            <div class="todos__header">
                                <img src="./../app/img/folder.svg" alt="active list" class="todos__icon todos__icon--folder">
                                <p class="todos__title">active list</p>
                                <div class="todos__separator"></div>
                                <div class="todos__number"></div>
                            </div>
                            <div class="todos__container">
                                <div class="swiper" todos-slide-view="active">
                                    <div class="todos__list"></div>
                                </div>
                            </div>
                        </div>

                        <div class="swiper-slide todos__view-item" todos-view-item="done" >
                            <div class="todos__header">
                                <img src="./../app/img/folder.svg" alt="active list" class="todos__icon todos__icon--folder">
                                <p class="todos__title">completed</p>
                                <div class="todos__separator"></div>
                                <div class="todos__number"></div>
                            </div>
                            <div class="todos__container">
                                <div class="swiper" todos-slide-view="done">
                                    <div class="todos__list"></div>
                                </div>
                            </div>
                        </div>

                        <div class="swiper-slide todos__view-item" todos-view-item="all" >
                            <div class="todos__header">
                                <img src="./../app/img/folder.svg" alt="active list" class="todos__icon todos__icon--folder">
                                <p class="todos__title">all todos</p>
                                <div class="todos__separator"></div>
                                <div class="todos__number"></div>
                            </div>
                            <div class="todos__container">
                                <div class="swiper" todos-slide-view="all">
                                    <div class="todos__list">
                                                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            
            </div>
        
        `;

        let htmls = HTML`<div class="todos__wrapper">

            ${header}
            ${main}
        </div>`;

        objNode.innerHTML = htmls;

        
    }
    
    function identify(appData = {}) { 
        
        appData.objNode.setAttribute("todos-id", appData.id);
        appData.view = {
            container: appData.objNode.querySelector(".todos__view"),
            active: {
                container: appData.objNode.querySelector(`.todos__view-item[todos-view-item="active"]`),
                inner: appData.objNode.querySelector(`div.swiper[todos-slide-view="active"] .todos__list`),
            }, 
            all: {
                container: appData.objNode.querySelector(`.todos__view-item[todos-view-item="all"]`),
                inner: appData.objNode.querySelector(`div.swiper[todos-slide-view="all"] .todos__list`),
            }, 
            done: {
                container: appData.objNode.querySelector(`.todos__view-item[todos-view-item="done"]`),
                inner: appData.objNode.querySelector(`div.swiper[todos-slide-view="done"] .todos__list`),
            }, 
        }
        appData.formControls = {
            form: {
                input: appData.objNode.querySelector(`input[todos-input-for="${appData.id}"]`),

                clear: appData.objNode.querySelector('button[todos-form-command="clear"]')

            },
        }
    }
    function renderItem ({itemType, itemName, itemID}) {
        switch (itemType) {
            case 'done':
                return HTML`<div class="swiper-slide" >
                    <div class="todos__item" todos-item-id="${itemID}" todos-item-status="done" todos-item-mode="normal">
                        <button class="todos__item-check" title="mark as done"></button>
                        <p class="todos__item-name" >
                            <input type="text" class="todos__item-edit">
                            <span title="${itemName}">${itemName}</span>
                        </p>
                        <button class="todos__button-plain todos__button-plain--posEnd" title="finish editing this to-do" todos-item-command="cancel">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                        <button class="todos__button-plain todos__button-plain--posEnd" title="delete this to-do" todos-item-command="delete">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                        <button class="todos__button-plain todos__button-plain--posEnd" title="finish editing this to-do" todos-item-command="edit">
                            <i class="fa-solid fa-check"></i>
                        </button>
                    </div>
                </div>`;
                break;
            case 'active':default:
                return HTML`<div class="swiper-slide" >
                    <div class="todos__item" todos-item-id="${itemID}" todos-item-status="active" todos-item-mode="normal">
                        <button class="todos__item-check" title="mark as done"></button>
                        <p class="todos__item-name" >
                            <input type="text" class="todos__item-edit">
                            <span title="${itemName}">${itemName}</span>
                        </p>
                        <button class="todos__button-plain todos__button-plain--posEnd" title="finish editing this to-do" todos-item-command="cancel">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                        <button class="todos__button-plain todos__button-plain--posEnd" title="delete this to-do" todos-item-command="delete">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                        <button class="todos__button-plain todos__button-plain--posEnd" title="finish editing this to-do" todos-item-command="edit">
                            <i class="fa-solid fa-check"></i>
                        </button>
                    </div>
                </div>`;
                break;
        }
    }
    function includeSwiper(appData) {
        appData.swiperMap.switchMode = new Swiper (`div[todos-id="${appData.id}"] .swiper[todos-sliding-container="switch-mode"]`, {
            slidesPerView: 1,
            direction: 'vertical',
            loop: true,
            speed: 500,
            allowTouchMove: false,
            effect: 'creative',
            creativeEffect: {
                prev: {
                    opacity: 0,
                    scale: 0.5,
                },
                next: {
                    opacity: 0,
                    scale: 5,
                }
            }
        });
        
        [
            ["slideViewCurrent","active"], 
            ["slideViewCompleted","done"], 
            ["slideViewAll","all"]
        ].forEach(
            ([ulSwiperName, ulSwiperTarget])=>{
                appData.swiperMap[ulSwiperName] = new Swiper (`div[todos-id="${appData.id}"] .swiper[todos-slide-view="${ulSwiperTarget}"]`, {
                    direction: 'vertical',
                    speed: 500,
                    slidesPerView: 'auto',
                    wrapperClass: "todos__list",
                    spaceBetween: 16,
                    watchOverflow: false,
                    mousewheel: {
                        enabled: true,
                        releaseOnEdges: true,
                    },
                    
                });
            }
        )
        
        
    }

    function renderOption() {
        return {
            renderActive(ul) {
                ul = (Object.values(ul));
                ul = ul.filter(e=>e.status=="active");
                let htmlsDOM = "";
                if (ul.length > 0 ) {
                    htmlsDOM = HTML`${
                        ul.map(
                            (e)=>{
                                return renderItem({itemType: e.status, itemName: e.name, itemID: e.id})
                            }
                        )
                    }`;
                } else {
                    htmlsDOM = TXT.empty;
                }
                
                return {
                    getDOM() {
                        return htmlsDOM;
                    },
                    length: ul.length,
                } 
            },
            renderDone(ul) {
                ul = (Object.values(ul));
                ul = ul.filter(e=>e.status=="done");
                let htmlsDOM = "";
                if (ul.length > 0 ) {
                    htmlsDOM = HTML`${
                        ul.map(
                            (e)=>{
                                return renderItem({itemType: e.status, itemName: e.name, itemID: e.id})
                            }
                        )
                    }`;
                } else {
                    htmlsDOM = TXT.empty;
                }
                
                return {
                    getDOM() {
                        return htmlsDOM;
                    },
                    length: ul.length,
                } 
            },
            renderAll(ul) {
                
                ul = (Object.values(ul));
                let htmlsDOM = "";
                if (ul.length > 0 ) {
                    htmlsDOM = HTML`${
                        ul.map(
                            (e)=>{
                                return renderItem({itemType: e.status, itemName: e.name, itemID: e.id})
                            }
                        )
                    }`;
                } else {
                    htmlsDOM = TXT.empty;
                }
                
                return {
                    getDOM() {
                        return htmlsDOM;
                    },
                    length: ul.length,
                }
            }
        }
    }

    function updateListLength(nodeReal, typeofTodo = "active") {
        function real(number) {
            const ping = nodeReal.querySelector(".todos__number");
            ping.setAttribute(`todos-${typeofTodo}-number`, number);
            ping.setAttribute("title", `There ${((number<2)?"is":"are")} ${number} ${typeofTodo}${(typeofTodo=="") ? "" : " "}item${((number<2)?"":"s")}.`);
            ping.innerText = ((number<10)?number:"9+");
        }
        function getCurrentNumber() {
            const ping = nodeReal.querySelector(".todos__number");
            return ping.getAttribute(`todos-${typeofTodo}-number`);
        }
        return (number = -1)=>{
            if (number == -1) {
                number = getCurrentNumber()*1 + 1;
                real(number);
            } else {
                real(number);
            }
        }
    }

    // input from form header ONLY
    const formOption = function (appData = {}) {
        const {formControls} = appData;
        return {
            clearInput(obj = formControls.form.input) {
                // console.log(formControls);
                obj.value = "";
                obj.focus();
            },
            lockInput (obj = formControls.form.input) {
                obj.disabled = true;
            },
            unlockInput (obj = formControls.form.input) {
                obj.disabled = false;
            },
            setClearButton(value = false) {
                value = (value?"remove":"add");
                formControls.form.clear.classList[value]("app-todo__disable-obj");
            },
            reset() {
                this.clearInput();
                this.unlockInput();
                this.setClearButton();
            }
        }
    }

    // request stuff (only for ITEM interaction)
    const request = function (appData) {
        const { dispatch } = appData;
        const { todoViewMode, swiperMap, view } = appData;
        return {
            switchTab(tabBtn = todoViewMode, fromButton=false) {
                const {todoViewMode} = appData;
                let idTab = 0;
                if (typeof tabBtn == "object") {
                    switch (tabBtn.getAttribute("todos-filter-option")) {
                        case "all":
                            idTab = 2;
                            break;
                        case "completed":
                            idTab = 1;
                            break;
                        case "active":default:
                            idTab = 0;
                            break;
                    }
                } else {
                    idTab = tabBtn;
                }
                if ((idTab===todoViewMode) && (fromButton)) return true;
                jumpToTab(appData, idTab);
                appData.todoViewMode = idTab;
                appData.swiperMap.switchMode.slideTo(idTab);
            },
            // add an Item by DOM node
            addItem(obj) {
                function exportData(itemName) {
                    const id = window.crypto.randomUUID();
                    return {
                        id,
                        name: itemName,
                        status: "active"
                    }
                }
                const itemName = obj.value;
                if (itemName!="") {
                    const data = exportData(itemName);
                    new Promise (
                        function (resolve, reject) {
                            dispatch("method:add", data);
                            formOption(appData).lockInput(obj);
                            resolve(data);
                        }
                    ).then(
                        function (data) {
                            request(appData).fakeRender(data);
                            request(appData).fakeUpdate();
                            formOption(appData).unlockInput(obj);
                            formOption(appData).clearInput(obj);
                            formOption(appData).setClearButton(false);
                        }
                    )
                } 
            },
            editItem(obj) {
                const item = interact(appData).item(obj);
                const itemID = todo(item).item.id;
                const itemName = obj.value;
                if (itemName!="") {
                    new Promise (
                        function (resolve, reject) {
                            dispatch("method:modify", itemID, itemName);
                            interact(appData).input.lock(obj);
                            resolve({itemID, itemName});
                        }
                    ).then(
                        function ({itemID, itemName}) {
                            request(appData).fakeRename(itemID, itemName);
                            formOption(appData).unlockInput(obj);
                            formOption(appData).clearInput(obj);
                        }
                    )
                } 
            },
            async check(obj) {
                let query = "";
                let requireDelete = true;
                const itemID = todo(obj).item.id;
                const itemStatus = todo(obj).item.status;
                const dataResult = {};

                async function handling(itemID,status = "done") {
                    appData.allowEvent = false;
                    todo(obj).item.status=status;
                    return new Promise(
                        function (resolve) {
                            dispatch("method:status", itemID, status);
                            const data = {itemID, itemType: status}
                            setTimeout(()=>{resolve(data)}, 200);

                        }
                    )
                }
                
                switch (todoViewMode) {
                    case 2: // just do request, no need to delete
                        query = (itemStatus=="active")?"done":"active";
                        requireDelete = false;
                        break;
                    case 1: 
                        // do request, delete the node
                        
                        if (itemStatus=="done") {
                            query = "active";
                        } else {
                            return -1;
                        }
                        break;
                    case 0:default: 
                        // do request, delete the node
                        if (itemStatus=="active") {
                            query = "done";
                        } else {
                            return -1;
                        }
                        break;
                }

                (async ()=>{
                    try {
                        const data = await handling(itemID,query);
                        // console.log(data);
                        appData.allowEvent = true;
                        Object.assign(dataResult, data);
                    } catch (e) {
                        console.log(e);
                    } finally {
                        if (requireDelete) {
                            this.fakeDelete(dataResult.itemID);
                        } 
                    }
                })();
            },
            async deleteItem(obj) {
                const itemID = todo(obj).item.id;
                const dataResult = {};

                async function handling(itemID) {
                    appData.allowEvent = false;
                    return new Promise(
                        function (resolve) {
                            dispatch("method:delete", itemID);
                            const data = {itemID}
                            setTimeout(()=>{resolve(data)}, 200);
                        }
                    )
                }
                (async ()=>{
                    try {
                        const data = await handling(itemID);
                        // console.log(data);
                        appData.allowEvent = true;
                        Object.assign(dataResult, data);
                    } catch (e) {
                        console.log(e);
                    } finally {
                        this.fakeDelete(dataResult.itemID);
                    }
                })();
            },
            fakeRender(data) {
                if (todoViewMode == 0 || todoViewMode == 2 ) {
                    const sw = swiperMap[`slideView${(todoViewMode==0)?"Current":"All"}`];
                    const inner = view[`${(todoViewMode==0)?"active":"all"}`].inner;
                    if (inner.querySelector("div[todos-message='nothing']")) {
                        inner.innerHTML = "";
                        sw.update();
                    }
                    sw.appendSlide(
                        renderItem (
                            {
                                itemType: data.status,
                                itemName: data.name, 
                                itemID: data.id
                            }
                        )
                    )
                }
            },
            fakeUpdate(typeofTodo) {
                if ([0,2].includes(todoViewMode)) {
                    if (todoViewMode==0) {
                        updateListLength(view.active.container,"active")();
                    } else {
                        updateListLength(view.all.container,"all")();
                    }
                }
            },
            fakeRename(itemID, itemName) {
                if (todoViewMode == 0 || todoViewMode == 2 ) {
                    const sw = swiperMap[`slideView${(todoViewMode==0)?"Current":"All"}`];
                    const inner = view[`${(todoViewMode==0)?"active":"all"}`].inner;
                    const todoItem = interact(appData).list(inner).find(itemID);
                    if (!todoItem) {
                        sw.appendSlide(
                            renderItem (
                                {
                                    itemType: "active",
                                    itemName: itemName, 
                                    itemID: itemID
                                }
                            )
                        )
                    } else {
                        todo(todoItem).item.mode = "normal";
                        todo(todoItem).item.name = itemName;
                    }
                }
            },
            fakeDelete(itemID) {
                const sw = swiperMap[`slideView${(todoViewMode==0)?"Current":"All"}`];
                const mode = (["active", "done", "all"][todoViewMode]);
                const inner = view[mode].inner;
                const container = view[mode].container;
                const todoItem = interact(appData).list(inner).find(itemID);
                if (todoItem) {
                    const l = interact(appData).list(inner).length;
                    if (l==1) {
                        inner.innerHTML = TXT.empty;
                    } else {
                        todoItem.parentNode.remove();
                    }
                    // update
                    updateListLength(container, mode)(l-1);
                    sw.update();
                }
            }
        }
    }
    const interact = function (appData) {
        return {
            input: {
                txtBox(obj) {
                    return {
                        renameValue(value = "") {
                            obj.value = value;
                            obj.focus();
                            obj.disabled = false;
                        }
                    }
                },
                parent(obj) {
                },
                lock(obj) {
                    formOption(appData).lockInput(obj);
                },
                unlock(obj) {
                    formOption(appData).unlockInput(obj);
                }
            },
            item(obj) {
                const node = findParent(obj, ".todos__item");
                if (!node) {
                    throw new Error ("unable to find the todo, bruh");
                } else {
                    return node;
                }
            },
            blurAll(obj) {
                appData.objNode.querySelectorAll(".todos__item").forEach(it=>{
                    interact(appData).closeEdit(it)
                })
            },
            list(inner) {
                return {
                    find(itemID) {
                        const node = inner.querySelector(`.todos__item[todos-item-id="${itemID}"]`);
                        if (!node) {
                            return false;
                        } else {
                            return node;
                        }
                    },
                    get length() {
                        return inner.querySelectorAll(".todos__item").length;
                    }
                }
            },
            openEdit(todoItem) {
                const inp = todo(todoItem).item.input;
                const currentName = todo(todoItem).item.name;
                todo(todoItem).item.mode = "edit";
                this.input.txtBox(inp).renameValue (currentName);
                
                // events
                inp.addEventListener("keydown", (e)=>{
                    if (e.key=="Escape") {
                        this.closeEdit(todoItem);
                    }
                })
            },
            closeEdit(todoItem) {
                todo(todoItem).item.mode = "normal";
            }
        }
    }

    function switchTabButton(appData,option) {
        const {swiperMap, objNode} = appData;
        objNode.querySelectorAll('.todos__filter-item').forEach(el=>el.classList.remove("todos__filter-item--selected"));
        switch (option) {
            case "all": 
                objNode.querySelector('.todos__filter-item[todos-filter-option="all"]').classList.add("todos__filter-item--selected");
                swiperMap.slideViewCurrent.slideTo(2);
                break;
            case "done": 
                objNode.querySelector('.todos__filter-item[todos-filter-option="completed"]').classList.add("todos__filter-item--selected");
                swiperMap.slideViewCurrent.slideTo(1);
                break;
            case "active": default: 
                objNode.querySelector('.todos__filter-item[todos-filter-option="active"]').classList.add("todos__filter-item--selected");
                swiperMap.slideViewCurrent.slideTo(0);
                break;
        }
    }

    function jumpToTab(appData,option) {
        const { attach, connect, render } = appData;
        // const store = appData.store.data;
        const {renderActive, renderAll, renderDone} = renderOption();
        
        const connector = connect(state=>state.todoList);
        switch (option) {
            case 2: 
                attach (appData.view.all.inner, connector(renderAll));
                render (appData.view.all.inner, updateListLength(appData.view.all.container, "") );
                switchTabButton(appData, "all");
                appData.swiperMap.slideViewAll.update();
                break;
            case 1: 
                attach (appData.view.done.inner, connector(renderDone));
                render (appData.view.done.inner, updateListLength(appData.view.done.container, "completed") );
                switchTabButton(appData, "done");
                appData.swiperMap.slideViewCompleted.update();
                break;
            case 0: default: 
                attach (appData.view.active.inner, connector(renderActive));
                render (appData.view.active.inner, updateListLength(appData.view.active.container) );
                switchTabButton(appData, "active");
                appData.swiperMap.slideViewCurrent.update();
                break;
        }
    }

    function runEvent(appData = {}) {
        const {objNode,id,allowEvent} = appData;
        function checkVar() {
            if (appData.allowEvent == false) {
                objNode.disabled = false;
                return false;
            } else {
                objNode.disabled = true;
            }
        }
        function validateClearBtn(obj) {
            if (obj.value!="") {
                formOption(appData).setClearButton(true);
            } else {
                formOption(appData).setClearButton(false);
            }
        }
        // click
        objNode.addEventListener("click", function (e) {
            const obj = e.target;
            // console.log(obj)
            if (obj.matches("button.todos__filter-item")) {
                request(appData).switchTab(obj,true);
            } else if (obj.matches('button[todos-form-command="clear"], button[todos-form-command="clear"] *')) {
                formOption(appData).reset();
            } else if (obj.matches('.todos__item-name span')) {
                checkVar();
                // check var moment
                const IT = findParent(obj, "todos__item");//todoITem
                if (IT) {
                    // check var (pt.2)
                    if (todo(IT).item.status=="active") {
                        interact(appData).blurAll()
                        interact(appData).openEdit(IT)
                    }
                } else {
                    throw new Error ("You are an idiot, hahahahahahahha");
                }
            } else if (obj.matches('button[todos-item-command="cancel"], button[todos-item-command="cancel"] *')) {
                // check var moment
                const IT = findParent(obj, "todos__item");//todoITem
                if (IT) {
                    // check var (pt.2)
                    if (todo(IT).item.status=="active") {
                        interact(appData).closeEdit(IT)
                    }
                } else {
                    throw new Error ("You are an idiot, hahahahahahahha");
                }
            } else if (obj.matches('button[todos-item-command="edit"], button[todos-item-command="edit"] *')) {
                // check var moment
                const IT = findParent(obj, "todos__item");//todoITem
                if (IT) {
                    // check var (pt.2)
                    if (todo(IT).item.status=="active") {
                        request(appData).editItem(todo(IT).item.input);
                    }
                } else {
                    throw new Error ("You are an idiot, hahahahahahahha");
                }
            } else if (obj.matches(`input[todos-input-for="${id}"]`)) {
                interact(appData).blurAll()
            } else if (obj.matches('.todos__item-check')) {
                checkVar();
                const IT = findParent(obj, "todos__item");//todoITem
                if (IT) {
                    // check var (pt.2)
                    request(appData).check(IT);
                } else {
                    throw new Error ("You are an idiot, hahahahahahahha");
                }
            } else if (obj.matches('button[todos-item-command="delete"], button[todos-item-command="delete"] *')) {
                // check var moment
                checkVar();
                const IT = findParent(obj, "todos__item");//todoITem
                if (IT) {
                    // check var (pt.2)
                    request(appData).deleteItem(IT);
                } else {
                    throw new Error ("You are an idiot, hahahahahahahha");
                }
            }
        })
        // keypress
        objNode.addEventListener("input", function (e) {
            const obj = e.target;
            const key = e.key;
            if (obj.matches(`input[todos-input-for="${id}"]`)) {
                // add new object
                if (key!="Enter") {
                    validateClearBtn(obj);
                }
            } 
        })
        // keydown
        objNode.addEventListener("keydown", function (e) {
            const obj = e.target;
            const key = e.key;
            if (obj.matches(`input[todos-input-for="${id}"]`)) {
                // add new object
                if (key=="Enter") {
                    request(appData).addItem(obj);
                }
            } else if (obj.matches(`input.todos__item-edit`)) {
                // edit new object
                if (key=="Enter") {
                    request(appData).editItem(obj);
                    
                }
            }
        });
        // change 
        appData.formControls.form.input.onchange = function () {
            validateClearBtn(this);
        }
        appData.formControls.form.input.oninput = function (e) {
            if (e.key=="Enter") {
                validateClearBtn(this);
            } 
        } 
    }

    function pushData(appData = {}, srcData) {
        if (!srcData) {
            appData.store = {
                src: "./",
                data: {
                    todoList: [],
                }
            }
        } else {
            appData.store = Object.assign({src: "./"}, {data: srcData});
        }
    }
    
    // test
    return function (node, {defaultMode, srcData} = {}) {
        const appData = {
            // app id
            id: `todos-app-` + window.crypto.randomUUID(),
            // app node
            objNode: node,
            // app view mode
            todoViewMode:0, // 0: active, 1: completed, 2: all,
            // swiperMode selector
            swiperMap : {
                switchMode: {},
            },
            // dom objects
            view: {},
            formControls: {},
            allowEvent: true,
        }
        const reduxMethod = initStore(appData);
        Object.assign(appData, reduxMethod);
        
        if (!node) {
            throw new Error ("Cannot identify object");
        } else {
            
            pushData(appData, srcData);
            appData.initStore();

            clearNode(appData);
            identify(appData);
            includeSwiper(appData);
            
            /// connect to store
            if (!defaultMode) {
                appData.todoViewMode = 0; 
            } else {
                switch (defaultMode) {
                    case "all":case 2:
                        appData.todoViewMode = 2; 
                        break;
                    case "done":case "completed":case 1:
                        appData.todoViewMode = 1; 
                        break;
                    case "active": default:
                        appData.todoViewMode = 0;
                        break;
                }
            }

            formOption(appData).reset();
            request(appData).switchTab();

            runEvent(appData);

            return {
                appid: appData.id,
            }
        }
        
    }
})();

export default todo;



// ${renderItem({itemType: "active", itemName: "go to cgv cinema d.10"})}
