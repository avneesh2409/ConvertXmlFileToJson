import React, { useEffect, useContext, useState } from "react";
import "./paginate.css";
import { store } from "../../context";
import { clearDomainPopupData } from "../../actions";

const PopupForm = ({ submitHandler }) => {
    const [state, setState] = useState({error:''})
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
            switchDispatch(clearDomainPopupData())
        }
    }, [])
const clickHandler = () => {
        switchDispatch(clearDomainPopupData())
        document.getElementById("myModal").style.display = "none"
    }
    const onChangeHandler = (e) => {

        if (e.target.value.trim().length === 0) {
            setState({
                error: 'fields cannot be null'
            })
        }
            else {
            setState({
                ...state,
                [e.target.name]: e.target.value,
                error:''
            })
        }
    }
    return (
        <React.Fragment>
            <div id="myModal" className="modal">
                <div className="modal-content">
                    <div className="container text-center" id="myContent">
                        <h6 className="text-danger text-center">{(state.error) ? state.error : null}</h6>
                        {
                            (popupData && popupData.content && popupData.content.length > 0) ?
                            popupData.content.map((ex,i) => (
                                <React.Fragment key={i}>
                                    <small>{ex.name}</small>
                                    <input type="text" className="form-control" defaultValue={ex.value} name={ex.name} onChange={onChangeHandler} required />
                                 </React.Fragment>
                                    )) : null
                        }
                        <button className="btn btn-primary" onClick={(e) => (state.error) ? alert(state.error) : submitHandler(e, (popupData !== undefined) ? popupData.id : null)}>Submit</button>
                        <button className="btn btn-info" onClick={clickHandler}>Dismiss</button>
                  </div>
                </div>
           </div>
        </React.Fragment>
    )
}
export default PopupForm