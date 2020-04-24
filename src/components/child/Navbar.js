import React, { useContext } from 'react'
import { store } from '../../context'
import {DefaultDomain,DefaultFeed,DefaultPublisher,DefaultRouting, DefaultRoutingUrl, DefaultFeedUrl, DefaultPublisherUrl, DefaultDomainUrl} from '../../constants'
import {changeData} from '../../actions'
import UploadXmlFile from './UploadXmlFile'


const style1 = {
    cursor:'pointer'
}
const Navbar = () => {
    const { switchDispatch, switchState } = useContext(store)
    const clickHandler = (e, x) => {
        let childs = e.target.parentNode.parentNode.children
        for (let i = 0; i < childs.length; i++) {
            if (childs[i].classList.contains('active')) {
                childs[i].classList.remove('active')
            }
        }
        switch(x)
        {
            case DefaultRouting:
                e.target.parentNode.classList.add('active')
                switchDispatch(changeData(DefaultRouting, DefaultRoutingUrl))
            break;
            case DefaultFeed:
                e.target.parentNode.classList.add('active')
                switchDispatch(changeData(DefaultFeed, DefaultFeedUrl))
            break;
            case DefaultPublisher:
                e.target.parentNode.classList.add('active')
                switchDispatch(changeData(DefaultPublisher, DefaultPublisherUrl))
            break;
            case DefaultDomain:
                e.target.parentNode.classList.add('active')
                switchDispatch(changeData(DefaultDomain, DefaultDomainUrl))
            break;
            default:
        }
    }    
return (
    <div>
        <UploadXmlFile />
        {
            switchState.filename ? <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                <ul className="navbar-nav" >
                    <li className="nav-item active">
                        <span className="nav-link" id="domainRouteId" style={style1} onClick={(e) => clickHandler(e, DefaultDomain)}>{DefaultDomain}</span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" style={style1} onClick={(e) => clickHandler(e, DefaultRouting)}>{DefaultRouting}</span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" style={style1} onClick={(e) => clickHandler(e, DefaultFeed)}>{DefaultFeed}</span></li>
                    <li className="nav-item">
                        <span className="nav-link" style={style1} onClick={(e) => clickHandler(e, DefaultPublisher)}>{DefaultPublisher}</span>
                    </li>
                </ul>
                        <a style={{ position: 'absolute', right: '0px', margin: '0 5px' }} href={`/api/Home/download-xml/${switchState.filename}`}> <button><i className='fa fa-download'></i></button></a>
            </nav>
                : null
        }


</div>
    )
}

export default Navbar
