import { FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE, CHANGE_DATA, PAGINATE_CURRENT_PAGE, STORE_PUBLISHER_ID, STORE_ROUTING_LIST, STORE_ROUTING_ID, EMPTY_DATA_STORE, STORE_URL, RESET_CENTRAL_STORE, STORE_XML_FILE_NAME, DELETE_ROUTING_LIST_ITEM, STORE_DOMAIN_DATA, EDIT_ROUTING_LIST, CLEAR_ROUTINGID_PUBLISHERID, STORE_POPUP_DATA, CLEAR_POPUP_DATA, CLEAR_XML_FILE_NAME, TOGGLE_LOADING,} from "../constants"



export const toggleLoading = (toggle) => {
    return {
        type: TOGGLE_LOADING,
        toggle
    }
}
export const storePopupData = (popupData) => {
    return {
        type: STORE_POPUP_DATA,
        popupData
    }
}
export const clearXmlFile = () => {
    return {
        type: CLEAR_XML_FILE_NAME
    }
}
export const clearPopupData = () => {
    return {
        type: CLEAR_POPUP_DATA
    }
}
export const storeDomainData = (domainData) => {
    return {
        type: STORE_DOMAIN_DATA,
        domainData
    }
}
export const editRoutingList = (updateData,routingIndex) => {
    return {
        type: EDIT_ROUTING_LIST,
        updateData,
        routingIndex
        }
}
export const storeUrl = (url) => {
    return {
        type: STORE_URL,
        url
    }
}
export const storeXmlFile = (file) => {
    return {
        type: STORE_XML_FILE_NAME,
        file
    }
}
export const resetCentralStore = () => {
    return {
        type: RESET_CENTRAL_STORE
    }
}
export const deleteRoutingListItem = (index) => {
    return {
        type: DELETE_ROUTING_LIST_ITEM,
        index
    }
}

export const fetchDataSuccess = (payload) => {
    return {
        type: FETCH_DATA_SUCCESS,
        payload
    }
}

export const fetchDataFailure = (error) => {
    return {
        type: FETCH_DATA_FAILURE,
        error
    }
}

export const paginatePage = (page) =>{
    return {
        type:PAGINATE_CURRENT_PAGE,
        page
    }
}

export const changeData = (key,value) =>{
    return {
        type:CHANGE_DATA,
        key,
        value
    }
}

export const storePublisherId = (publisherId) => {
    return {
        type: STORE_PUBLISHER_ID,
        publisherId
    }
}

export const routingDefinitionsList = (list) => {
    return {
        type: STORE_ROUTING_LIST,
        list
    }
}

export const storeRoutingId = (routingId) => {
    return {
        type: STORE_ROUTING_ID,
        routingId
    }
}

export const emptyDataStore = () => {
    return {
        type: EMPTY_DATA_STORE
    }
}


export const clearRoutingIdPublisherId = () => {
    return {
        type: CLEAR_ROUTINGID_PUBLISHERID
    }
}

