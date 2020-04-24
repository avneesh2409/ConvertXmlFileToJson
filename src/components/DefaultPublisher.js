import React, { useContext, useEffect, useState } from 'react'
import { store } from '../context';
import { storeRoutingId, resetCentralStore, storePopupData, clearPopupData, toggleLoading } from '../actions';
import { Get_Selected_Publisher } from '../constants';
import Paginate from './child/Paginate';
import PopupForm from '../utils/popup';
import {edit_publisher_url, delete_publisher_url } from '../helper/dependency';
import { notify } from '../utils/notify';

const hide = {
    border: 'none'
}
const initial = {
    loading: false,
    data: null,
    error: ''
}
const DefaultPublisher = () => {
    const [state1, setState] = useState(initial)
    const { state, dispatch, switchState, switchDispatch } = useContext(store);
    const { value } = switchState;
    const [data, setData] = useState(null);
    let indexOfLastPost = 0, indexOfFirstPost = 0, currentPosts = 0;
    const { routingId } = state;

    useEffect(() => {
        switchDispatch(toggleLoading(true))
        setState({
            ...state1,
            loading: true
        })
        let url = `${value}/${switchState.filename}`;
        fetch(url).then(res => res.json()).then(json => {
            switchDispatch(toggleLoading(false))
            setState({
                ...state1,
                loading: false,
                data: json
            })
        }).catch(err => {
            switchDispatch(toggleLoading(false))
            setState({ ...state1, loading: false, error: err.message })
        })
        return () => {
            setState(initial)
            setData(null)
            dispatch(resetCentralStore())
        }
    }, [])
    useEffect(() => {
        switchDispatch(toggleLoading(true))
        const fetchData = () => {
            fetch(`${Get_Selected_Publisher}/${switchState.filename}/${routingId}`).then(res => res.json()).then(json => {
                switchDispatch(toggleLoading(false))
                setData(json)
            }).catch(err => {
                switchDispatch(toggleLoading(false))
                notify("Unable to fetch the records",false,'right')
            });
        }
        fetchData();
        return () => {
            setData(null)
            dispatch(resetCentralStore())
        }
    }, [routingId])


    const editHandler = (e, id, index) => {
        switchDispatch(toggleLoading(true))
        let inputs = e.target.parentNode.parentNode.querySelectorAll("input");
        let content = []
        for (let i = 0; i < inputs.length; i++) {
            content.push(inputs[i])
        }
        switchDispatch(storePopupData({ content, id, index }))
        document.getElementById("myModal").style.display = "block";
    }
    const submitHandler = (e, id, index) => {
        switchDispatch(clearPopupData())
        let check = false;
        let inputs = e.target.parentNode.parentNode.querySelectorAll("input");
        let data = {};
        data[`id`] = index;
        data["routeId"] = `${routingId}`;
        inputs.forEach(ele => {
            data[`${ele.name}`] = ele.value
        })
        let values = { "true": true, "false": false }
        if (isNaN(parseInt(data["publisheridId"]))) {
            check = false
            notify("unable to update !!! publisherId should be integer", false, 'right')
        }
        else {
            check = true
        }
        if ((data["enter"] in values) && (data["enterSpecified"] in values)) {
            check = true
        }
        else {
            notify("unable to update !!! enter and enterSpecified field should be boolean", false, 'right')
            check = false
        }
        if (check) {
            switchDispatch(toggleLoading(true))
            let options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            fetch(`${edit_publisher_url}/${switchState.filename}`, options).then(res => res.json()).then(json => {
                if (json) {
                    switchDispatch(toggleLoading(false))
                    let inp = document.getElementById(index).querySelectorAll('input');
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
        document.getElementById("myModal").style.display = "none";
    }
    const deleteHandler = (deleteEvent, index) => {
        let url = `${delete_publisher_url}/${switchState.filename}/${routingId}/${index}`;
        let permit = window.confirm("Do you want to remove this tag ?");
        if (permit) {
            switchDispatch(toggleLoading(true))
            fetch(url).then(res => {
                if (res) {
                    switchDispatch(toggleLoading(false))
                    document.getElementById(`${index}`).parentNode.removeChild(document.getElementById(`${index}`))
                    notify("successfully deleted", true,'center')
                }
                else {
                    switchDispatch(toggleLoading(false))
                    notify("unable to delete",false,'right')
                }

            }).catch(err => {
                switchDispatch(toggleLoading(false))
                notify("unable to delete",false,'right')
            })
        }
    }
    if (data && data.length > 0) {
        indexOfLastPost = state.currentPage * state.postsPerPage;
        indexOfFirstPost = indexOfLastPost - state.postsPerPage;
        currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
    }
    const changeHandler = (e) => {
        dispatch(storeRoutingId(e.target.value))
    }
    const { defaultFeed, dpid, id } = (state1.data && state1.data.length > 0 && data && data.length > 0) ? state1.data[0] : { defaultFeed: '', dpid: '' }
    return (
        <div>
            {
                <div className="row">
                    <div className="col-md-12">
                        <PopupForm submitHandler={submitHandler} />
                    </div>
                </div>
            }
            <div className="row">
                <div className='col-md-4 '>
                    <select className="mb-4 form-control" onChange={changeHandler}>
                        <option >{(routingId) ? routingId : "Select Publishers"}</option>
                        {
                            state1.data && state1.data.length > 0 && state1.data.map((e, i) => (
                                (e.id !== null) ?
                                    <option key={i} value={`${e.id}`}>{e.id}</option>
                                    : null
                            )
                            )
                        }
                    </select>
                </div>
            </div>
            {(data && data.length > 0 && routingId) ?
               <div>
            <div className='row'>

                <div className="col-md-2">
                    <small>Parameter Name</small>
                    <input type="text" defaultValue={`${defaultFeed}`} className="form-control" disabled />
                </div>
                <div className="col-md-2">
                    <small>Parameter Type</small>
                    <input type="text" defaultValue={`${dpid}`} className="form-control" disabled />
                </div>
            </div>

                            <div className="mt-4">
                    <table className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>Publisher Id</th>
                                <th>Enter</th>
                                <th>Enter Specified</th><th>Update</th><th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentPosts.map((e, i) => (
                                    <tr key={i} id={i}>
                                        <td><input name="publisheridId" style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} type='text' defaultValue={`${e.publisheridId}`} disabled={true} /></td>
                                        <td><input name="enter" type='text' style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} defaultValue={`${e.enter}`} disabled={true} /></td>
                                        <td><input type='text' name="enterSpecified" style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} defaultValue={`${e.enterSpecified}`} disabled={true} /></td>
                                        <td><button className="btn btn-primary fa fa-edit" onClick={(ex) => editHandler(ex, id, i)}></button></td>
                                        <td><button className="btn btn-danger fa fa-trash" onClick={(elx) => deleteHandler(elx, i)} ></button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        </table>
                        {
                            (data.length > 10) ? <Paginate data={data} /> : null
                        }
                    
                    </div>
                </div> : <h5 className="text-center text-info text-capitalize">no record found</h5>
            }
        </div>
    )
}

export default DefaultPublisher
