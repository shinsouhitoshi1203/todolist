// import swiper from 'swiper';
// import 'swiper/css';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import { attach, connect, render, dispatch } from './../core/core.js';

const todo = (function () {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    // messages
    const TXT = {
        empty: "<p style='text-align: center; font-size: 35px; font-weight: 600; color: #bbbbbb'>¯\\_(ツ)_/¯</p><br><p style='text-align: center; color: #bbbbbb'>There is no todo right now. Wanna add one?</p>",

    }
    let id;
    let todoViewMode = 0;
    // 0: active, 1: completed, 2: all;
    let objNode;
    // swiperMode selector
    const swiperMap = {
        switchMode: {},
    }
    // dom objects
    let view;

    function HTML([f, ...subStr],...$$) {
        return subStr.reduce((a,s,i)=>a.concat($$[i], s),[f]).filter(e=>((e && e!==true)||e===0)).join("");
    }
    function clearNode() {
        
        objNode.classList.add("app-todo", "todos");
        let header = HTML`<div class="todos__form">
                <div class="todos__input">
                    <icon class="todos__icon">
                        <i class="fa-solid fa-pen fa-sm"></i>
                    </icon>
                    <input type="text" placeholder="What do you want to do">
                    <button class="todos__button-plain todos__button-plain--posEnd">
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

                        <div class="swiper-slide todos__view-item" todos-view-item="completed" >
                            <div class="todos__header">
                                <img src="./../app/img/folder.svg" alt="active list" class="todos__icon todos__icon--folder">
                                <p class="todos__title">completed</p>
                                <div class="todos__separator"></div>
                                <div class="todos__number"></div>
                            </div>
                            <div class="todos__container">
                                <div class="swiper" todos-slide-view="completed">
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
                                    <div class="todos__list"></div>
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
    {/* <div class="todos__list">
        ${renderItem({itemType: "active", itemName: "go to cgv cinema d.10"})}
        ${renderItem({itemType: "active", itemName: "go to cgv cinema d.10"})}
        ${renderItem({itemType: "active", itemName: "wet theshuvhsdgjksvkjsd"})}
        ${renderItem({itemType: "active", itemName: "Lorem ipsum"})}
        ${renderItem({itemType: "active", itemName: "go to cgv cinema d.10"})}
        ${renderItem({itemType: "active", itemName: "Lorem ipsum"})}
    </div> */}
    function identify() { 
        objNode.setAttribute("todos-id", id);
        view = {
            container: objNode.querySelector(".todos__view"),
            active: {
                container: objNode.querySelector(`.todos__view-item[todos-view-item="active"]`),
                inner: objNode.querySelector(`div.swiper[todos-slide-view="active"] .todos__list`),
            } 
        }

    }
    function renderItem ({itemType, itemName, itemID}) {
        switch (itemType) {
            case 'active':
                return HTML`<div class="swiper-slide" todos-item-id="${itemID}">
                    <div class="todos__item" todos-item-status="active" todos-item-mode="normal">
                        <button class="todos__item-check" title="mark as done"></button>
                        <p class="todos__item-name" title="${itemName}">
                            <input type="text" class="todos__item-edit">
                            <span>${itemName}</span>
                        </p>
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
    function includeSwiper() {
        swiperMap.switchMode = new Swiper (`div[todos-id="${id}"] .swiper[todos-sliding-container="switch-mode"]`, {
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
        
        swiperMap.slideViewCurrent = new Swiper (`div[todos-id="${id}"] .swiper[todos-slide-view="active"]`, {
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
                                return renderItem({itemType: "active", itemName: e.name, itemID: e.id})
                            }
                        )
                    }`;
                } else {
                    htmlsDOM = TXT.empty;
                }
                
                return {
                    // ¯\_(ツ)_/¯ is superior to the shrug emoji
                    getDOM() {
                        return htmlsDOM;
                    },
                    length: ul.length,
                } 
            }
        }
    }

    function updateListLength(nodeReal) {
        return (number, node = nodeReal)=>{
            const ping = nodeReal.querySelector(".todos__number");
            ping.setAttribute("title", `There ${((number<2)?"is":"are")} ${number} active item${((number<2)?"":"s")}.`);
            ping.innerText = ((number<10)?number:"9+");
        }
    }
    function switchTab(option) {
        switch (option) {
            case "all": 
                attach (view.done.inner, connector(renderDone));
                render (view.done.inner);
                break;
            case "active": default: 
                objNode.querySelectorAll('.todos__filter-item').forEach(el=>el.classList.remove("todos__filter-item--selected"));
                objNode.querySelector('.todos__filter-item[todos-filter-option="active"]').classList.add("todos__filter-item--selected");
                swiperMap.slideViewCurrent.slideTo(0);
                break;
        }
    }
    function start(option) {
        const {renderActive} = renderOption();
        const connector = connect();
        switch (option=0) {
            case 1: 
                attach (view.done.inner, connector(renderDone));
                render (view.done.inner);
                break;
            case 0: default: 
                attach (view.active.inner, connector(renderActive));
                render (view.active.inner, updateListLength(view.active.container) );
                switchTab("active");
                break;
        }
    }

    return function (node, {defaultMode} = {}) {
        if (!node) {
            throw new Error ("Cannot identify object")
        } else {
            id = `todos-app-${node.id}` || window.crypto.randomUUID();
            objNode = node;
            clearNode();
            identify();
            includeSwiper();
            
            /// connect to store
            if (!defaultMode) {
                todoViewMode = 1; 
            } else {
                switch (defaultMode) {
                    case "all":
                        todoViewMode = 2; 
                        break;
                    case "done":case "completed":
                        todoViewMode = 1; 
                        break;
                    case "active": default:
                        todoViewMode = 0;
                        break;
                }
            }
            
            start(todoViewMode);

            //runEvent();

            return {
                addQuick(itemName) {
                    function renderRequest(itemName) {
                        const itemID = window.crypto.randomUUID();
                        return {
                            status: "active",
                            id: itemID,
                            status: itemName,
                        }
                    }
                    
                    const itemObj = renderRequest(itemName);
                    dispatch("method:add", itemObj);
                    //start();
                },
                switchNext() {
                    swiperMap.switchMode.slideNext();
                }
            }
        }
        
    }
})();

export default todo;
