import React from 'react'
import { Route } from 'react-router';
import { Layout } from '../components/child/Layout';
import { Home } from '../components/Home';
function Routers() {
    return (
        <Layout>
            <Route exact path='/' component={Home} />
        </Layout>
    )
}

export default Routers
