import { AxiosInstance, AxiosResponse } from 'axios'
import { requiredEnv } from '@cpn-console/shared'

/**
 * Find project by name and is active
 * @param client AxiosInstance to make the request
 * @param projectName Name of the project
 * @returns the axios response
 */
export async function findProjectByName (client: AxiosInstance, projectName: string): Promise<AxiosResponse> {
  // 
  const params = `filters=[{"name":{"operator":"=","values":"${projectName}"}},{"active":{"operator":"=","values":["t"]}}]`
  const resp = await client.request({
    url: `/projects/?${params}`,
    method: 'get',
  }).then(response => {
    return response
  }).catch(response => {
    console.error(response)
    return response
  })

  return resp
}

/**
 * Create project from a template and under a root-project
 * @param client AxiosInstance to make the request
 * @param projectName Name of the project
 * @param TEMPLATE_PROJECT_ID (env var): ID of the project that serves as a template
 * @param ANCESTOR_PROJECT_ID (env var): root project ID
 * @returns OpenProject treat this request in async mode
 */
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
    return response
  }).catch(error => {
    console.error(error)
    return error
  })

  return resp
}
