// import { show, getAllTabs, save, remove, extract } from './util';
// import './style/index.scss';

// const button = document.querySelector('button');
// const root = document.querySelector('#root');

// button.addEventListener('click', () => {
//     getAllTabs()
//     .then(save)
//     .then(newList => {
//         root.innerHTML = '';
//         show(newList, root);
//     });
// });

// document.body.addEventListener('click', e => {
//     const url = e.target.dataset.url;

//     if(url){
//         remove(e.target.dataset.url)
//         .then(newList => {
//             if(newList){
//                 root.removeChild(e.target.parentNode);
//             }
//         });
//     }
// });

// extract()
// .then(infos => {    
//     show(infos, root);
// });


import React from 'react';
import ReactDom from 'react-dom';
import {Main} from './index.jsx';
import './style/index.scss';

ReactDom.render(React.createElement(Main), document.getElementById('root'));