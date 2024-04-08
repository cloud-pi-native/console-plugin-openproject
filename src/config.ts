import axios, { AxiosInstance } from 'axios'
import { requiredEnv } from '@cpn-console/shared'

const openprojectBaseURL = requiredEnv('OPENPROJECT_BASE_URL')
const openprojectUsername = requiredEnv('OPENPROJECT_USERNAME')
const openprojectPassword = requiredEnv('OPENPROJECT_PASSWORD')

export const client: AxiosInstance = axios.create({
  baseURL: `${openprojectBaseURL}`,
  timeout: 1000,
  auth: {
    username: `${openprojectUsername}`,
    password: `${openprojectPassword}`,
  },
  headers: {
    'Content-type': 'application/json',
  },
})
