// html
function mk(type){ 
    return document.createElement(type);
}


function show(infos, root) {
    infos.map(info => {
        const li = mk('li');
        const item = mk('a');
        
        const del = mk('button');
        del.innerText = 'del';
        del.dataset.url = info.url;

        item.href = info.url;
        item.innerText = info.title;

        li.appendChild(del);
        li.appendChild(item);

        root.appendChild(li);
    });
}

export {
    show
};