import React, { useContext} from 'react';
import { store } from '../../context';
import { paginatePage } from '../../actions';
import '../../css/paginate.css';

function getPageList(totalPages, page, maxLength) {
  if (maxLength < 5) throw new Error("maxLength must be at least 5");

  function range(start, end) {
      return Array.from(Array(end - start + 1), (_, i) => i + start); 
  }

  var sideWidth = maxLength < 9 ? 1 : 2;
  var leftWidth = (maxLength - sideWidth*2 - 3) >> 1;
  var rightWidth = (maxLength - sideWidth*2 - 2) >> 1;
  if (totalPages <= maxLength) {

      return range(1, totalPages);
  }
  if (page <= maxLength - sideWidth - 1 - rightWidth) {
 
      return range(1, maxLength - sideWidth - 1)
          .concat(0, range(totalPages - sideWidth + 1, totalPages));
  }
  if (page >= totalPages - sideWidth - 1 - rightWidth) {

      return range(1, sideWidth)
          .concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
  }
 
  return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth),0, range(totalPages - sideWidth + 1, totalPages));
}

const Paginate = ({ data }) => {
  const {state,dispatch} = useContext(store)
  const totalPosts = data.length;
  let pageNumbers = getPageList( Math.ceil(totalPosts/ state.postsPerPage),state.currentPage + 1,state.postsPerPage);
    if (totalPosts <= 1) {
          return null;
    }
    pageNumbers = pageNumbers.filter(x => x !== 0);
    return (
        <div>
    <nav style={{ maxWidth: '100%' }} className="mb-6">
      <ul className='mypaginate' style={{cursor:'pointer'}}>
      <li className={`page-link ml-2`}>
                    <a href="/#" onClick={(e) =>(state.currentPage <= 1)?e.preventDefault() : dispatch(paginatePage(1))}>First</a>
      </li>
      <li className={`page-link ml-2`}>
                        <a href="/#" onClick={(e) =>(state.currentPage <= 1)?e.preventDefault() :dispatch(paginatePage(state.currentPage - 1))}>Previous</a>
      </li>
                  {pageNumbers.map((number, i) => (
                      (number === state.currentPage) ?
                          <li key={i} className='page-item ml-2'>
                              <button onClick={() => dispatch(paginatePage(number))} className='btn btn-primary' style={{ color: 'black', backgroundColor:'white' }}>
              {number}
            </button>
                          </li> :
                          <li key={i} className='page-item mr-2 ml-2'>
                              <button onClick={() => dispatch(paginatePage(number))} className='btn btn-primary'>
                                  {number}
                              </button>
                          </li>
        ))}
         <li className={`page-link ml-2`}>
                        <a href="/#" onClick={(e) =>(state.currentPage > Math.ceil(totalPosts/ state.postsPerPage) - 1)?e.preventDefault():dispatch(paginatePage(state.currentPage + 1))}>Next</a>
        </li>
        <li className={`page-link ${state.currentPage > Math.ceil(totalPosts/ state.postsPerPage) ? 'disabled' : ''} ml-2`}>
                        <a href="/#" onClick={(e) =>(state.currentPage > Math.ceil(totalPosts/ state.postsPerPage) - 1)?e.preventDefault(): dispatch(paginatePage(Math.ceil(totalPosts/ state.postsPerPage)))}>Last</a>
        </li>
      </ul>
    </nav>
    </div>
  );

};

export default Paginate;
