import React, { useState, useContext, useEffect } from 'react'
import { feed_edit_url, feed_delete_url} from '../helper/dependency';
import { store } from '../context';
import Paginate from './child/Paginate';
import { resetCentralStore, clearPopupData, storePopupData, toggleLoading } from '../actions';
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
const DefaultFeed = () => {
    const [state1, setState] = useState(initial)
    const { state, switchState, dispatch, switchDispatch } = useContext(store)
    const { value } = switchState;
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

    let indexOfLastPost = 0, indexOfFirstPost = 0, currentPosts = 0;
    if (state1.data && state1.data.length > 0) {
        indexOfLastPost = state.currentPage * state.postsPerPage;
        indexOfFirstPost = indexOfLastPost - state.postsPerPage;
        currentPosts = state1.data.slice(indexOfFirstPost, indexOfLastPost);
    }
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
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        fetch(`${feed_edit_url}/${switchState.filename}`, options).then(res => res.json()).then(json => {
            if (json) {
                switchDispatch(toggleLoading(false))
                let inp = document.getElementById(id).querySelectorAll('input');
                inp.forEach(ele => {
                    ele.value = data[`${ele.name}`];
                })
                notify("successfully edited",true,'center');
            }
            else {
                switchDispatch(toggleLoading(false))
                notify("unable to upload",false,'right');
            }
        }).catch(err => {
            switchDispatch(toggleLoading(false))
            notify("unable to update", false, 'right')
        });
        document.getElementById("myModal").style.display = "none";
    }
    const deleteHandler = (i) => {
        switchDispatch(toggleLoading(true))
        let url = `${feed_delete_url}/${switchState.filename}/${i}`;
        let permit = window.confirm("Do you want to remove this tag ?");
        if (permit) {
            fetch(url).then(res => {
                switchDispatch(toggleLoading(false))
                setState({
                    ...state1,
                    loading: false,
                    data: state1.data.filter(eid => eid.id !== i)
                })
                notify("successfully deleted",true,'center')
            }).catch(err => {
                switchDispatch(toggleLoading(false))
                notify("Unable to delete", false, 'right');
           })
        }
    }
    return (
        <div>
                <div className="row">
                    <div className="col-md-12">
                        <PopupForm submitHandler={submitHandler} />
                    </div>
                </div>
            {(!state1.loading && state1.data && state1.data.length > 0) ?
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>QueryParamsMatching</th><th>Url</th><th>EncryptQueryParams</th><th>Update</th><th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentPosts.map((e, i) => (
                                <tr key={e.id} id={e.id}>
                                    <td><input name="QueryParamsMatching" style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} type='text' defaultValue={`${e.queryParamsMatching}`} disabled={true} /></td>
                                    <td><input name="Url" type='text' style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} defaultValue={`${e.url}`} disabled={true} /></td>
                                    <td><input name="EncryptQueryParams" type='text' style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} defaultValue={`${e.encryptQueryParams}`} disabled={true} /></td>
                                    <td><button className="btn btn-primary fa fa-edit" onClick={(ex) => editHandler(ex, e.id)}></button></td>
                                    <td><button className="btn btn-danger fa fa-trash" onClick={() => deleteHandler(e.id, i)} ></button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                : <h1 className="text-center text-info text-capitalize">no record found</h1>
                }
            {
                (!state1.loading && state1.data && state1.data.length > 10) ?
                    <Paginate data={state1.data} /> : null
            }
        </div>
    );
}

export default DefaultFeed
