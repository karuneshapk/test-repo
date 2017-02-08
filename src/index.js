import { start } from 'apollo-appstore/start'
import routes from './routes'
import shared from './shared'
import './styles/main'
import 'apollo-library/styles/icons'

start({
  defaultLanguage: 'en',
  languages: ['en'],
  routes,
  shared
})
