import React, { useContext, useEffect, useState } from 'react'
import { store } from '../context'
import { storePublisherId, routingDefinitionsList, resetCentralStore, deleteRoutingListItem, clearPopupData, storePopupData, editRoutingList, toggleLoading } from '../actions';
import { delete_routing_url, edit_routing_url } from '../helper/dependency';
import PopupForm from '../utils/popup';
import Paginate from './child/Paginate';
import { notify } from '../utils/notify';

const hide = {
    border: 'none'
}
const initial = {
    loading: false,
    data: null,
    error: ''
}
const DefaultRouting = () => {
    const [state1, setState] = useState(initial)
    const { dispatch, state, switchState, switchDispatch } = useContext(store);
    const { value } = switchState;
    const { publisherId, routingList } = state
    const { parameterName, parameterType, id, comparisonOperator, enter, enterSpecified } = routingList ? routingList : { parameterName: '', parameterType: '', comparisonOperator: '', enter: '', enterSpecified: '', id: null };
    let indexOfLastPost = 0, indexOfFirstPost = 0, currentPosts = 0;
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
            dispatch(resetCentralStore())
        }
    }, [])
    useEffect(() => {
        if (state1.data && state1.data.length > 0) {
            let x = state1.data.filter(e => e.id === publisherId)
            if (x && x.length > 0) {
                dispatch(routingDefinitionsList(x[0]));
            } else {
                dispatch(routingDefinitionsList([]));
            }
        }
    }, [publisherId])

    const editHandler = (e, id, index) => {
        let inputs = e.target.parentNode.parentNode.querySelectorAll("input");
        let content = []
        for (let i = 0; i < inputs.length; i++) {
            content.push(inputs[i])
        }
        switchDispatch(storePopupData({ content, id, index }))
        document.getElementById("myModal").style.display = "block";
    }
    const submitHandler = (e, id, index) => {
        switchDispatch(toggleLoading(true))
        switchDispatch(clearPopupData())
        let inputs = e.target.parentNode.parentNode.querySelectorAll("input");
        let data = {};
        data[`publisherId`] = `${publisherId}`;
        data["routingId"] = index;
        inputs.forEach(ele => {
            data[`${ele.name}`] = ele.value
        })
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        fetch(`${edit_routing_url}/${switchState.filename}`, options).then(res => res.json()).then(json => {
            if (json) {
                switchDispatch(toggleLoading(false))
                dispatch(editRoutingList(data, index));
               let inp = document.getElementById(index).querySelectorAll('input');
                inp.forEach(ele => {
                    ele.value = data[`${ele.name}`];
                })
                notify("successfully edited", true, 'center');
            }
            else {
                notify("unable to upload",false,'right');
            }
        }).catch(err => {
            switchDispatch(toggleLoading(false))
            notify("unable to update", false, 'right')
        });
        document.getElementById("myModal").style.display = "none";
    }
    const deleteHandler = (deleteEvent, id, index) => {
        switchDispatch(toggleLoading(true))
        let url = `${delete_routing_url}/${switchState.filename}/${publisherId}/${index}`;
        let permit = window.confirm("Do you want to remove this tag ?");
        if (permit) {
            fetch(url).then(res => {
                if (res) {
                    switchDispatch(toggleLoading(false))
                    dispatch(deleteRoutingListItem(index))
                    notify("Successfully deleted",true,'center')
                }
                else {
                    switchDispatch(toggleLoading(false))
                    notify("Unable to delete",false,'right')
                }
            }).catch(err => {
                switchDispatch(toggleLoading(false))
                notify("Unable to delete",false,'right')
            })
        }
    }
    if (routingList && routingList.routingDefinitionsList && routingList.routingDefinitionsList.length > 0) {
        indexOfLastPost = state.currentPage * state.postsPerPage;
        indexOfFirstPost = indexOfLastPost - state.postsPerPage;
        currentPosts = routingList.routingDefinitionsList.slice(indexOfFirstPost, indexOfLastPost);
    }
    const changeHandler = (e) => {
        dispatch(storePublisherId(e.target.value))
    }
    return (
        <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <PopupForm submitHandler={submitHandler} />
                    </div>
                </div>
            <div className="row">
                <div className='col-md-4'>
                    <select className="mb-4 form-control" onChange={changeHandler}>
                        <option>{(publisherId) ? publisherId : "Select Publishers"}</option>
                        {
                            state1.data && state1.data.length > 0 && state1.data.map((e) => (
                                (e.id !== null) ?
                                    <option key={e.id} value={`${e.id}`}>{e.id}</option>
                                    : null
                            ))
                        }
                    </select>
                </div>
            </div>
            {(routingList && routingList.routingDefinitionsList && routingList.routingDefinitionsList.length > 0) ?
                <React.Fragment>
                    <div className='row'>
                        <div className="col-md-2">
                            <small>Parameter Name</small>
                            <input type="text" defaultValue={`${parameterName || ''}`} className="form-control" disabled />
                        </div>
                        <div className="col-md-2">
                            <small>Parameter Type</small>
                            <input type="text" defaultValue={`${parameterType || ''}`} className="form-control" disabled />
                        </div>
                        <div className=" col-md-2">
                            <small>Comparison Operator</small>
                            <input type="text" defaultValue={`${comparisonOperator || ''}`} className="form-control" disabled />
                        </div>
                        <div className=" col-md-2">
                            <small>Enter</small>
                            <input type="text" defaultValue={`${enter || ''}`} className="form-control" disabled />
                        </div>
                        <div className="col-md-2">
                            <small>Enter Specified</small>
                            <input type="text" defaultValue={`${enterSpecified || ''}`} className="form-control" disabled />
                        </div>
                    </div>
                    <div className="mt-4">
                        <table className='table table-striped dtable' aria-labelledby="tabelLabel">
                            <thead>
                                <tr>
                                    <th>overrideFeed</th>
                                    <th>parameterValue</th>
                                    <th>range</th>
                                    <th>countryList</th>
                                    <th>Update</th><th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentPosts.map((e, i) => (
                                        <tr key={i} id={i}>
                                            <td><input name="overrideFeed" style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} type='text' value={`${e.overrideFeed}`} disabled={true} /></td>
                                            <td><input name="parameterValue" type='text' style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} value={`${e.parameterValue}`} disabled={true} /></td>
                                            <td><input name="range" type='text' style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} value={`${e.range}`} disabled={true} /></td>
                                            <td><input name="countryList" type='text' style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} value={`${e.countryList}`} disabled={true} /></td>
                                            <td><button className="btn btn-primary fa fa-edit" onClick={(ex) => editHandler(ex, id, i)}></button></td>
                                            <td><button className="btn btn-danger fa fa-trash" onClick={(el) => deleteHandler(el, id, i)} ></button></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            (routingList.routingDefinitionsList.length > 10) ? <Paginate data={routingList.routingDefinitionsList} /> : null
                        }

                    </div>
                </React.Fragment> : <h5 className="text-center text-info text-capitalize">no record found</h5>
            }
        </div>
    )



}

export default DefaultRouting
