import { AxiosInstance, AxiosResponse } from 'axios'
import { requiredEnv } from '@cpn-console/shared'

export async function findProjectByName (client: AxiosInstance, projectName: string): Promise<AxiosResponse> {
  const params = `filters=[{"name":{"operator":"=","values":"${projectName}"}}]`
  const resp = await client.request({
    url: `/projects/?${params}`,
    method: 'get',
  }).then(response => {
    console.log(response)
    return response
  }).catch(response => {
    console.error(response)
    return response
  })

  return resp
}

export async function createProject (client: AxiosInstance, projectName: string): Promise<AxiosResponse> {
  const templateProjectID = requiredEnv('TEMPLATE_PROJECT_ID')
  const ancestorProjectID = requiredEnv('ANCESTOR_PROJECT_ID')

  const resp = client.request({
    url: `/projects/${templateProjectID}/copy`,
    method: 'post',
    data: {
      name: projectName,
      parent: {
        href: `/api/v3/projects/${ancestorProjectID}`,
      },
    },
  }).then(response => {
    console.log(response)
    return response
  }).catch(error => {
    console.error(error)
    return error
  })

  return resp
}
