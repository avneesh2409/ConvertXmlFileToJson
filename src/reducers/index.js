import { FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE, CHANGE_DATA,STORE_URL, PAGINATE_CURRENT_PAGE, STORE_PUBLISHER_ID, STORE_ROUTING_LIST, STORE_ROUTING_ID, EMPTY_DATA_STORE, RESET_CENTRAL_STORE, STORE_XML_FILE_NAME, DELETE_ROUTING_LIST_ITEM, STORE_DOMAIN_DATA, EDIT_ROUTING_LIST, CLEAR_ROUTINGID_PUBLISHERID, CLEAR_POPUP_DATA, STORE_POPUP_DATA, CLEAR_XML_FILE_NAME, TOGGLE_LOADING} from "../constants"

export const fetchDataReducer = (state,action) =>{
switch(action.type)
{
	case FETCH_DATA_SUCCESS:
		return {
			...state,
			loading: false,
			data:action.payload,
			error:''
		}
	case FETCH_DATA_FAILURE:
		return {
			...state,
			loading: false,
			data:[],
			error: action.error
		}
	case PAGINATE_CURRENT_PAGE:
		return {
			...state,
			currentPage:action.page
		}
	case STORE_PUBLISHER_ID:
		return {
			...state,
			publisherId: action.publisherId
		}
	case STORE_ROUTING_LIST:
		return {
			...state,
			routingList:action.list
		}
	case DELETE_ROUTING_LIST_ITEM:

		state.routingList.routingDefinitionsList.splice(action.index,1)
		return {
			...state,
			routingList: state.routingList
		}
	case EDIT_ROUTING_LIST:
		state.routingList.routingDefinitionsList.map((element, i) => {
			if (i === action.routingIndex) {
				state.routingList.routingDefinitionsList[i] = action.updateData
			}
			return 0;
			})
		return {
			...state,
			routingList: state.routingList 
		}
	case STORE_ROUTING_ID:
		return {
			...state,
			routingId: action.routingId
		}
	case EMPTY_DATA_STORE:
		return {
			...state,
			data:[]
		}
	case RESET_CENTRAL_STORE:
		return {
			...state,
			currentPage:1
		}
	case CLEAR_ROUTINGID_PUBLISHERID:
		return {
			...state,
			routingId: null,
			publisherId: null,
			routingList: null
		}
	default: return state
}
}


export const switchReducer = (state,action) =>{
switch(action.type)
{
	case CHANGE_DATA:
		return {
			...state,
			key:action.key,
			value:action.value
		}
	case STORE_URL:
		return {
			...state,
			url: action.url
		}
	case CLEAR_XML_FILE_NAME:
		return {
			...state,
			filename: null
		}
	case TOGGLE_LOADING:
		return {
			...state,
			togglebtn:action.toggle
		}
	case STORE_XML_FILE_NAME:
		return {
			...state,
			filename:action.file
		}
	case STORE_DOMAIN_DATA:
		return {
			...state,
			domainData: action.domainData
		}
	case CLEAR_POPUP_DATA:
		return {
			...state,
			popupData: null
		}
	case STORE_POPUP_DATA:
		return {
			...state,
			popupData: action.popupData
		}
	default : return state
}
}