export const publisher_options = {
    method: 'GET',
    headers: {
        'Content-Type':'application/json'
    }
}
export const UPLOAD_URL = "/api/Home/upload-file";
export const delete_domains_url = `/api/Home/delete-domains`
export const feed_edit_url = `/api/Home/edit-feed`
export const feed_delete_url = `/api/Home/delete-feed`
export const edit_domains_url = `/api/Home/edit-domains`
export const delete_routing_url = `/api/Home/delete-routing-list`
export const edit_routing_url = `/api/Home/edit-route-parameterlist`
export const edit_publisher_url = `/api/Home/edit-publisher`
export const delete_publisher_url = `/api/Home/delete-publisher`
export const edit_options = {
    method: 'POST',
    headers: {
        'Content-Type':'application/json'
    }
}
export const put_options = {
    method: 'PUT',
    headers: {
        'Content-Type':'application/json'
    }
}