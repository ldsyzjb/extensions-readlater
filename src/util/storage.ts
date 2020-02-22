class Storage {
    set(obj: Object): Promise<undefined> {
        return new Promise((res, rej) => {
            chrome.storage.local.set(obj, res);
        })
    }

    get(key: string | string[]): Promise<{[key: string]: any}>{
        return new Promise(res => {
            chrome.storage.local.get(key, res)
        })
    }

    delete(key: string | string[]): Promise<undefined>{
        return new Promise(res => {
            chrome.storage.local.remove(key, res)
        })
    }

    clear(): Promise<undefined>{
        return new Promise(res => {
            chrome.storage.local.clear(res)
        })
    }
}

export const storage =  new Storage()

