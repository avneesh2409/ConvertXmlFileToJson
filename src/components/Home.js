import React, { useContext } from 'react';
import { store } from '../context';
import { DefaultRouting, DefaultDomain as dd, DefaultFeed, DefaultPublisher } from '../constants';
import Pagination1 from './child/Pagination1';
import Pagination2 from './child/Pagination2';
import Pagination3 from './child/Pagination3';
import Pagination4 from './child/Pagination4';
import Navbar from './child/Navbar';


export const Home = () => {
    const { switchState} = useContext(store)
    let data = null
    switch (switchState.key) {
        case DefaultRouting:
           data = <Pagination2  />
            break;
        case dd:
            data = <Pagination1  />
            break;
        case DefaultFeed:
           data = <Pagination3  />
            break;
        case DefaultPublisher:
          data = <Pagination4  />
            break;
        default:
    }
    return (
        <div style={{marginBottom: '30px'}}>
            <Navbar />
            {(switchState.filename) ? data : <h5 className="text-center text-info">You need to upload the file</h5>
            }
        </div>
    )
}
