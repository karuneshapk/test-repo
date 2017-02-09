export default {
  mice: {
    endpoint: '/api/mice',
    method: 'get',
  },
  rights: {
    service: 'INIT',
    endpoint: '/rights',
    method: 'get',
  },
  logout: {
    service: 'ROUTER',
    endpoint: '/private/logout',
    method: 'post',
  },
  generateServiceTicket: {
    service: 'ROUTER',
    endpoint: '/private/ticket/generateServiceTicket',
    method: 'post',
    headers: {
      'content-type': 'text/plain',
    }
  },
  prolong: {
    service: 'ROUTER',
    endpoint: '/private/token/prolong',
    method: 'post',
  },
}
