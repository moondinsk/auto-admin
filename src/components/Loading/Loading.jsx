import React from "react";
import {observer} from "mobx-react";
import LoadingContent from "@/components/Loading/Loading.content.jsx";
import {useStore} from "@/store/index";


const Loading = observer(() => {
    const {loadingStore} = useStore();
    return (
        <>
            {
                loadingStore.visible &&
                <LoadingContent />
            }
        </>
    );
});


export default Loading;
