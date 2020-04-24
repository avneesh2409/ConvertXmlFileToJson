import React, { useState, useContext, useEffect } from 'react'
import { feed_edit_url, feed_delete_url, edit_options } from '../../helper/dependency';
import { store } from '../../context';
import Paginate from './Paginate';
import Loader from '../../loader';
import { resetCentralStore } from '../../actions';
import PopupForm from './popup';

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
    const [popupdata, setpopupdata] = useState({ ispopup: false })
    const { state, switchState, dispatch } = useContext(store)
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
    //const editHandler = (e, i) => {
    //    let inputs = document.getElementById(i).querySelectorAll("input");
    //    e.target.innerHTML = "Submit";
    //    inputs.forEach(element => {
    //        element.disabled = false
    //        element.style.backgroundColor = 'white';
    //    })
    //}
    const editHandler = (e, id) => {
        let inputs = e.target.parentNode.parentNode.querySelectorAll("input");
        let content = []
        for (let i = 0; i < inputs.length; i++) {
            content.push(inputs[i])
        }
        setpopupdata({
            ...state,
            content: content,
            id
        })
        let modal = document.getElementById("myModal");
        modal.style.display = "block";
    }
    const submitHandler = (e, i) => {
        let inputs = document.getElementById(i).querySelectorAll("input");
        let data = {};
        inputs.forEach(element => {
            element.disabled = true;
            element.style.backgroundColor = 'rgb(0,0,0,0)';
        })
            data["id"] = i;
            data["url"] = inputs[1].value;
            data["encryptQueryParams"] = inputs[2].value;
            data["queryParamsMatching"] = inputs[0].value;
            edit_options.body = JSON.stringify(data)
            fetch(feed_edit_url, edit_options).then(res => res.json()).then(json => { alert("successfully edited") }).catch(err => { console.log("unable to update", err) });
        e.target.innerHTML = "Edit";
    }
    const deleteHandler = (i) => {
        let url = `${feed_delete_url}/${i}`;
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
                        <PopupForm content={popupdata.content} id={popupdata.id} />
                    </div>
                </div>
            }
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                <tr>
                        <th>QueryParamsMatching</th><th>Url</th><th>EncryptQueryParams</th>
                </tr>
                </thead>
                <tbody>
                    {(!state1.loading && state1.data && state1.data.length > 0) ?
                        currentPosts.map((e, i) => (
                            <tr key={e.id} id={e.id}>
                                <td><input name="QueryParamsMatching" style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} type='text' defaultValue={`${e.queryParamsMatching}`} disabled={true} /></td>
                                <td><input name="Url" type='text' style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} defaultValue={`${e.url}`} disabled={true} /></td>
                                <td><input name="EncryptQueryParams" type='text' style={{ ...hide, backgroundColor: 'rgba(0,0,0,0)' }} defaultValue={`${e.encryptQueryParams}`} disabled={true} /></td>
                                <td><button className="btn btn-primary" onClick={(ex) => (ex.target.innerHTML === 'Edit') ? editHandler(ex, e.id) : submitHandler(ex, e.id)}>Edit</button></td>
                                <td><button className="btn btn-danger" onClick={() => deleteHandler(e.id)} >Delete</button></td>
                            </tr>
                        ))
                        : null
                        }
                </tbody>
            </table>
            {
                (!state1.loading && state1.data && state1.data.length > 0) ?
                    <Paginate data={state1.data} /> : <Loader />
            }
        </div>
    );
}

export default DefaultFeed
