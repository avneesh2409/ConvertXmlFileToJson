import React, { useState, useEffect, useContext } from 'react'
import { edit_url, delete_url } from '../../helper/dependency'
import Loader from '../../loader'
import Paginate from './Paginate'
import { store } from '../../context'
import { resetCentralStore, storeDomainPopupData, clearDomainPopupData } from '../../actions'
import PopupForm from './popup'

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
    const [popupdata, setpopupdata] = useState({ ispopup: false })
    const { switchState, switchDispatch, state, dispatch } = useContext(store)
    const { value } = switchState;
    useEffect(() => {
        setState({
            ...state1,
            loading: true
        })
        fetch(value).then(res => res.json()).then(json => setState({
            ...state1,
            loading: false,
            data: json
        })).catch(err => setState({ ...state1, loading: false, error: err.message }))
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
        switchDispatch(storeDomainPopupData({ content, id }))
        let modal = document.getElementById("myModal");
        modal.style.display = "block";
    }
    const submitHandler = (e, id) => {
        switchDispatch(clearDomainPopupData())
        let inputs = e.target.parentNode.querySelectorAll("input");
        let data = {};
        data[`id`] = id;
        inputs.forEach(ele => {
            data[`${ele.name}`] = ele.value
        })
    let options = {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data)
            }
    fetch(edit_url, options).then(res => res.json()).then(json => { console.log(json) }).catch(err => { console.log("unable to update", err) });
        document.getElementById("myModal").style.display = "none";
    }
    const deleteHandler = (i) => {
        let url = `${delete_url}/${i}`;
        let permit = window.confirm("Do you want to remove this tag ?");
        if (permit) { 
            fetch(url).then(res => {
                let inputs = document.getElementById(i);
                inputs.parentNode.removeChild(inputs);   
            }).catch(err => {
                console.log(err)
            })
        }
    }
    return (
        <div>
            {
                <div className="row">
                    <div className="col-md-12">
                        <PopupForm submitHandler={submitHandler} />
                    </div>
                </div>
            }  
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead><tr>
                    <th>DefaultPublisher</th><th>Domain</th><th>DefaultDownloadProvider</th><th>Edit</th><th>Delete</th>
                </tr>
                </thead>
                <tbody>
                    {(!state1.loading && state1.data && state1.data.length > 0) ?
                        currentPosts.map((e) => (
                            <tr key={e.id} id={e.id}>
                                <td><input style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} type='text' name="DefaultPublisher" defaultValue={`${e.defaultPublisher}`} disabled={true} /></td>
                                <td><input type='text' style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} name="Domain" defaultValue={`${e.domain}`} disabled={true} /></td>
                                <td><input type='text' style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} name="DefaultDownloadProvider" defaultValue={`${e.defaultDownloadProvider}`} disabled={true} /></td>
                                <td><button className="btn btn-primary" onClick={(ex) => editHandler(ex, e.id)}>Edit</button></td>
                                <td><button className="btn btn-danger" onClick={() => deleteHandler(e.id)} >Delete</button></td>
                            </tr>
                        ))
                        : null
                    }
                </tbody>
            </table>
            {
                (state1.data && state1.data.length > 0) ? <Paginate data={state1.data} /> : <Loader />
            }
        </div>
    );
}

export default DefaultDomain
