import React from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Msg = (props) => {
    return (
        <div className="text-center">
            <span>{props.message}</span>
        </div>
    )
}
export const notify = (message, type,region) => {
    toast(<Msg message={message} />, {
        position: (region === 'right') ? toast.POSITION.TOP_RIGHT : toast.POSITION.TOP_CENTER,
        className: (type) ? 'text-success text-capitalize' : 'text-danger text-capitalize',
        delay: 0,
        hideProgressBar:true,
        autoClose: 2000
    });
};