import React, { useState, useContext } from 'react'
import { UPLOAD_URL } from '../../helper/dependency'
import { store } from '../../context'
import { storeXmlFile, storeDomainData, clearRoutingIdPublisherId, clearXmlFile, toggleLoading } from '../../actions'
import { notify } from '../../utils/notify'


const initialState = {
    file: {},
    filename: 'Upload File',
    toggle: false
}
const UploadXmlFile = () => {
    const [state, setState] = useState(initialState)
    const { switchDispatch, dispatch, switchState } = useContext(store)
    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (state.toggle) {
            switchDispatch(toggleLoading(true))
            let formData = new FormData()
            formData.append("file", state.file)
            const options = {
                method: 'POST',
                body: formData
            }
            fetch(`${UPLOAD_URL}/${state.filename}`, options).then(res => res.json()).then((response) => {
                if (response && response.length > 0) {
                    switchDispatch(storeXmlFile(state.filename))
                    switchDispatch(storeDomainData(response))
                    dispatch(clearRoutingIdPublisherId());
                    switchDispatch(toggleLoading(false))
                    setState({
                        ...state,
                        toggle: false
                    })
                    notify("successfully uploaded", true, 'center')
                    document.getElementById("domainRouteId").click();
                }
                else {
                    switchDispatch(clearXmlFile())
                    switchDispatch(toggleLoading(false))
                    notify("unable to upload", false, 'right')
                }

            }).catch(err => {
                switchDispatch(toggleLoading(false))
                switchDispatch(clearXmlFile())
                notify("unable to upload", false, 'right')
            })
        }
        }      
const onChangeHandler = (e) => {
        if (e.target.files && e.target.files[0] && e.target.files[0].name) {
            setState({
                file: e.target.files[0],
                filename: e.target.files[0].name,
                toggle: true
            })
        }
     }
    return (
        <div className='jumbotron m-0 p-0 text-center'>
            <form onSubmit={onSubmitHandler} >
                <div className="row" >
                    <div className="col-md-3">
                        <div>
                            <input type='file' style={{ opacity: 0, zIndex: 2, position: 'relative', bottom: '-30px' }}
                                name='file'
                                onChange={onChangeHandler}
                            />
                            <div style={{ zIndex: 1, width: '180px', marginLeft: '42%', marginBottom: '20px' }}>
                                <input id="inputid" value={state.filename || switchState.filename} style={{ textAlign: 'center' }} readOnly />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">

                        <button className='btn btn-info' style={{ marginTop: '24px' }} disabled={(state.toggle) ? false : true} >Upload File</button>

                    </div>
                </div>
            </form>
        </div>
    )
}
export default UploadXmlFile
