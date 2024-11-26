// import swiper from 'swiper';
// import 'swiper/css';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'
const todo = (function () {
    const $ = document.querySelector.bind(document);
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
                    <button class="todos__filter-item todos__filter-item--selected" todos-filter-option="completed">completed</button>
                    <button class="todos__filter-item" todos-filter-option="all">all</button>
                </div>
            </div>`;

            
        let main = HTML`
            <div class="todos__view">
                <div class="swiper" todos-sliding-container="switch-mode">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">Lorem</div>
                        <div class="swiper-slide todos__view-item">
                            <div class="todos__header">
                                <img src="./../app/img/folder.svg" alt="active list" class="todos__icon todos__icon--folder">
                                <p class="todos__title">active list</p>
                                <div class="todos__separator"></div>
                                <div class="todos__number">3</div>
                            </div>
                            <div class="todos__container">
                                <div class="swiper" todos-slide-view="active">
                                    <div class="todos__list">
                                        ${renderItem({itemType: "active", itemName: "job 1"})}
                                        ${renderItem({itemType: "active", itemName: "go to cgv cinema d.10"})}
                                        ${renderItem({itemType: "active", itemName: "go to cgv cinema d.10"})}
                                        ${renderItem({itemType: "active", itemName: "go to cgv cinema d.10"})}
                                        ${renderItem({itemType: "active", itemName: "go to cgv cinema d.10"})}
                                        ${renderItem({itemType: "active", itemName: "job 5"})}
                                        ${renderItem({itemType: "active", itemName: "job 6"})}
                                        ${renderItem({itemType: "active", itemName: "job 7"})}
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
        view = objNode.querySelector(".todos__view");
    }

    function renderItem ({itemType, itemName}) {
        switch (itemType) {
            case 'active':
                return HTML`<div class="swiper-slide">
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
            }
        });
    }

    return function (node) {
        if (!node) {
            throw new Error ("Cannot identify object")
        } else {
            id = `todos-app-${node.id}` || window.crypto.randomUUID();
            objNode = node;
            clearNode();
            identify();

            includeSwiper();
            setTimeout(()=>swiperMap.switchMode.slideNext(),3000) // only for quick access
        }
        
    }
})();

export default todo;
