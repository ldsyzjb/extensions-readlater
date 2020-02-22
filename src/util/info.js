class Tabs {
    getAll(){
        return new Promise(res => {
            chrome.tabs.query({currentWindow: true}, lists => {
                res(lists.map(item => (
                    {title:item.title, url:item.url, icon: item.favIconUrl}
                )))
            })
        })
    }
    open(url){
        return new Promise(res => {
            chrome.tabs.create({url, active: false}, res)
        })
    }
}

const tabs = new Tabs();

export {
    tabs
};

