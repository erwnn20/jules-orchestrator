import dotenv from 'dotenv'
import path from 'path'


const isDev = process.env.NODE_ENV === 'development'

dotenv.config({
  path: isDev
    ? path.join(__dirname, '../../.env')
    : path.join(process.resourcesPath, '.env')
})