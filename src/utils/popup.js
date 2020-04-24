import React, { useEffect, useContext, useState } from "react";
import "../css/paginate.css";
import { store } from "../context";
import { clearPopupData } from "../actions";

const PopupForm = ({ submitHandler }) => {
    const [state, setState] = useState({ error: '' })
    const { switchState, switchDispatch } = useContext(store)
    const { popupData } = switchState;
    const modal = document.getElementById("myModal");
    useEffect(() => {
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        return () => {
            window.removeEventListener('click', callback => { })
            switchDispatch(clearPopupData())
        }
    }, [])
    const clickHandler = () => {
        switchDispatch(clearPopupData())
        document.getElementById("myModal").style.display = "none"
    }
    const onChangeHandler = (e) => {
        
        if (e.target.value.trim().length === 0) {
            e.target.style.border = '2px solid rgb(200,0,0)';
            setState({
                error: 'All fields are mandatory'
            })
        }
        else {
            e.target.style.border = '2px solid #f1f1f1';
            setState({
                ...state,
                [e.target.name]: e.target.value,
                error: ''
            })
        }
    }
    const convertToTitleCase = (str) => {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
    return (
        <React.Fragment>
            <div id="myModal" className="modal">
                <div className="modal-content">
                    <div className="container" id="myContent">
                        <h6 className="text-danger text-center">{(state.error) ? state.error : null}</h6>
                        {
                            (popupData && popupData.content && popupData.content.length > 0) ?
                                popupData.content.map((ex, i) => (
                                    <React.Fragment key={i}>
                                        <small>{convertToTitleCase(ex.name)}</small>
                                        <input type="text" className="form-control"  defaultValue={ex.value} name={ex.name} onChange={onChangeHandler} />
                                    </React.Fragment>
                                )) : null
                        }
                        <div className="d-flex justify-content-around">
                            <button className="btn btn-primary" onClick={(e) => (state.error) ? alert(state.error) : submitHandler(e, (popupData !== undefined) ? popupData.id : null, ((popupData !== undefined) ? popupData.index : null))}>Update</button>
                            <button className="btn btn-info" onClick={clickHandler}>Discard</button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
export default PopupForm
