import React, { useState, useEffect, useContext } from 'react'
import { edit_domains_url, delete_domains_url } from '../helper/dependency'
import Paginate from './child/Paginate'
import { store } from '../context'
import { resetCentralStore, storeDomainData, storePopupData, clearPopupData, toggleLoading } from '../actions'
import PopupForm from '../utils/popup';
import { notify } from '../utils/notify';

const hide = {
    border: 'none'
}
const initial = {
    loading: false,
    data: null,
    error:''
}
const DefaultDomain = () => {
    const [state1, setState] = useState(initial)
    const { switchState,switchDispatch, state, dispatch } = useContext(store)
    const { value, domainData } = switchState;
    let indexOfLastPost = 0, indexOfFirstPost = 0, currentPosts = 0;
    useEffect(() => {
        setState({
            ...state1,
            data: domainData
        })
    }, [domainData])

    useEffect(() => {
        setState({
            ...state1,
            loading: true
        })

        let url = `${value}/${switchState.filename}`;
            fetch(url).then(res => res.json()).then(json => {
                setState({
                    ...state1,
                    loading: false,
                    data: json
                })
                switchDispatch(storeDomainData(json))
            }).catch(err => {
                setState({ ...state1, loading: false, error: err.message })

            })
    
        return () => {
            setState(initial)
            dispatch(resetCentralStore())
        }
    }, [])

    const editHandler = (e, id) => {
        let inputs = e.target.parentNode.parentNode.querySelectorAll("input");
        let content = []
        for (let i = 0; i < inputs.length; i++) {
            content.push(inputs[i])
        }
        switchDispatch(storePopupData({ content, id }))
        let modal = document.getElementById("myModal");
        modal.style.display = "block";
    }
    const submitHandler = (e, id) => {
        switchDispatch(toggleLoading(true))
        switchDispatch(clearPopupData())
        let inputs = e.target.parentNode.parentNode.querySelectorAll("input");
        let data = {};
        data[`id`] = id;
        inputs.forEach(ele => {
            data[`${ele.name}`] = ele.value
        })
        if (parseInt(data["DefaultDownloadProvider"]) < 255) {
            data["DefaultDownloadProvider"] = parseInt(data["DefaultDownloadProvider"]);
            let options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            fetch(`${edit_domains_url}/${switchState.filename}`, options).then(res => res.json()).then(json => {
                if (json) {
                    switchDispatch(toggleLoading(false))
                    let inp = document.getElementById(id).querySelectorAll('input');
                    inp.forEach(ele => {
                        ele.value = data[`${ele.name}`];
                    })
                    notify("successfully edited", true, 'center');
                }
                else {
                    switchDispatch(toggleLoading(false))
                    notify("unable to upload", false, 'right');
                }
            }).catch(err => {
                switchDispatch(toggleLoading(false))
                notify("unable to update", false, 'right')
            });
        }
        else {
            switchDispatch(toggleLoading(false))
            notify("Unable to Update !!!! DefaultDownloadProvider field should be integer less than equals 255", false, 'right');
        }
        document.getElementById("myModal").style.display = "none";
    }
    
    const deleteHandler = (i, id) => {
        
        let url = `${delete_domains_url}/${switchState.filename}/${i}`;
        let permit = window.confirm("Do you want to remove this tag ?");
        if (permit) {
            switchDispatch(toggleLoading(true))
            fetch(url, {method:'POST'}).then(res => {
                setState({
                    ...state1,
                    loading: false,
                    data: state1.data.filter(eid => eid.id !== id)
                })
                switchDispatch(toggleLoading(false))
                notify("successfully deleted",true,"center")
            }).catch(err => {
                switchDispatch(toggleLoading(false))
                notify("Unable to delete !!!",false,'right')
            })
        }
    }
    

    if (state1.data && state1.data.length > 0) {
        indexOfLastPost = state.currentPage * state.postsPerPage;
        indexOfFirstPost = indexOfLastPost - state.postsPerPage;
        currentPosts = state1.data.slice(indexOfFirstPost, indexOfLastPost);
    }
    
    return (
        <div className="container pb-20">
                <div className="row">
                    <div className="col-md-12">
                        <PopupForm submitHandler={submitHandler} />
                    </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    {(!state1.loading && state1.data && state1.data.length > 0) ?
                    <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead><tr>
                    <th>DefaultPublisher</th><th>Domain</th><th>DefaultDownloadProvider</th><th>Edit</th><th>Delete</th>
                </tr>
                </thead>
                <tbody>
                                {
                        currentPosts.map((e, i) => (
                            <tr key={e.id} id={i}>   
                                <td><input style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} type='text' name="DefaultPublisher" defaultValue={`${e.defaultPublisher}`} disabled={true} /></td>
                                <td><input type='text' style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} name="Domain" defaultValue={`${e.domain}`} disabled={true} /></td>
                                <td><input type='number' style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} name="DefaultDownloadProvider" defaultValue={`${e.defaultDownloadProvider}`} disabled={true} /></td>
                                <td><button className="btn btn-primary fa fa-edit" onClick={(ex) => editHandler(ex, e.id)}></button></td>
                                <td><button className="btn btn-danger fa fa-trash" onClick={() => deleteHandler(i, e.id)} ></button></td>
                            </tr>
                        ))
                       
                    }
                </tbody>
                        </table>
                        :<h5 className="text-center text-info text-capitalize">no record found</h5>
                 }

            {
                (state1.data && state1.data.length > 10) ? <Paginate data={state1.data} /> : null
            }
                </div>
            </div>
        </div>
    );
}

export default DefaultDomain
