import React, { useReducer, useEffect } from 'react';
import { store } from './context';
import './css/custom.css';
import { fetchDataReducer, switchReducer } from './reducers';
import { storeUrl } from './actions';
import { ToastContainer, toast } from 'react-toastify';
import Routers from './router';
import { DefaultRouting, DefaultDomain, DefaultFeed, DefaultPublisher, DefaultRoutingUrl, DefaultDomainUrl, DefaultFeedUrl, DefaultPublisherUrl } from './constants';
import Loader from './loader';

const initialState = {
    currentPage:1,
    postsPerPage: 10,
    publisherId: '',
    routingList: [],
    routingId: ''
}
toast.configure({
    draggable: false
})
const App = () => {
    const [state, dispatch] = useReducer(fetchDataReducer, initialState)
    const [switchState, switchDispatch] = useReducer(switchReducer, { key: DefaultDomain, value: DefaultDomainUrl})
    let url = null;
    switch(switchState.key)
    {
        case DefaultRouting:
        url = DefaultRoutingUrl
        break;
        case DefaultDomain:
        url = DefaultDomainUrl
        break;
        case DefaultFeed:
        url = DefaultFeedUrl
        break;
        case DefaultPublisher:
        url = DefaultPublisherUrl
        break;
        default:
    }
    useEffect(() => {
        dispatch(storeUrl(url));
    }, [url])

    return (
        <store.Provider value={{ state, switchState, switchDispatch, dispatch }}>
            <ToastContainer />
            <Loader />
                <Routers />
            </store.Provider>
    );
}
export default App;