
function copy(str){
    const input = document.createElement('input');
    document.body.append(input);
    input.value = str;
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
}


export {
    copy
};