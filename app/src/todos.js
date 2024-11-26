const todo = (function () {
    let id;
    
    return function (node) {
        if (!node) {
            throw new Error ("Cannot identify object")
        } else {
            id = node.id || window.crypto.randomUUID();
            console.log(id)
        }
        
    }
})();


