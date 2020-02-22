const LATEST = 'th_latest';
const READED = 'th_readed';

class Storage {
    save(obj) {
        return new Promise((res, rej) => {
            chrome.storage.local.set(obj, e => e ? rej(e) : res())
        })
    }

    fetch(key){
        return new Promise(res => {
            chrome.storage.local.get(key, res)
        })
    }

    delete(key){
        return new Promise(res => {
            chrome.storage.local.remove(key, res)
        })
    }

    clear(){
        return new Promise(res => {
            chrome.storage.local.clear(res)
        })
    }


}

const storage = new Storage()


export {
    storage,
    LATEST,
    READED,
};