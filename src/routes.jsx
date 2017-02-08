import React from 'react'
import Route from 'apollo-appstore/router/Route'

import { prefixedRelativeUrl } from 'apollo-library/utils/common'

import BackofficeLayout from './containers/BackofficeLayout'
import PublicLayout from './components/PublicLayout'
import Dashboard from './components/Dashboard'
import Logout from './containers/Logout'

export default (
  <Route>
    <Route
      public
      component={BackofficeLayout}
      path={prefixedRelativeUrl()}
    >
      <Route path="/" component={Dashboard} />
      <Route path="/logout" component={Logout} />
    </Route>
    <Route
      public
      component={PublicLayout}
      path={prefixedRelativeUrl()}
    >
      { /*<Route path="*" module="login" /> */ }
    </Route>
  </Route>
)
