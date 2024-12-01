<b>shinsouhitoshi1203</b>
# todos app structure

here we use a blank div node to store the app
```html
<div id="todos-123"></div>
```
inside the todos-123 is the full structure of the app.
```html

    .todos__wrapper
        .todos__form
            .todos__input
            .todos__filter 
                [button * 3] --> filter the todos by their status

        .todos__view
            .swiper <-- todos-sliding-container="switch-mode"> [active / completed / all]
                .swiper-wrapper 
                    .swiper-slide.todos__view-item [🔴] <-- mode: active
                    .swiper-slide.todos__view-item [🔴] <-- mode: completed
                    .swiper-slide.todos__view-item [🔴] <-- mode: all


```
each `.swiper-slide [🔴].todos__view-item` has the structure below.
```html
    .todos__header

        [ . . . ]

    .todos__container
        .swiper todos-slide-view="active" <-- dragging todo
            .todos__list.swiper-wrapper
                .todos__item-wrap.swiper-slide [🔴]
                    .todos__item 
                        > [///]
                        
                .todos__item-wrap.swiper-slide [🔴]
                    .todos__item 
                        > [///]
                        
                .todos__item-wrap.swiper-slide [🔴]
                    .todos__item 
                        > [///]
                        
```