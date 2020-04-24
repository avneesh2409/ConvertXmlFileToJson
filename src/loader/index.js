import React, { useContext } from 'react'
import '../css/loader.css'
import { store } from '../context'
function Loader() {
    const { switchState } = useContext(store)

    return (
    (switchState.togglebtn)?
            < div className="loading" > Loading &#8230;</div >
            : null
     )
}

export default Loader
