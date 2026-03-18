import {makeAutoObservable} from "mobx";
import {getStore, useStore} from "../index.js";

export class LoadingStore {
    count = 0;
    visible = false;
    constructor(store) {
        this.store = store;
        makeAutoObservable(this, {}, {autoBind: true});
    }
    startLoading() {
        this.count += 1;
    }

    setLoadingState(value) {
        if(value){
            this.visible = value;
        } else{
            this.count = Math.max(0, this.count - 1);
            if (this.count === 0) {
                this.visible = value;
            }
        }
    }
}
export const useLoadingStore = () => {
    return useStore().loadingStore;
}

export const getLoadingStore = () => {
    return getStore().loadingStore;
}
