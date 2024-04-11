import { AxiosInstance, AxiosResponse } from 'axios'
import { requiredEnv } from '@cpn-console/shared'

/**
 * Find project by name and is active
 * @param client AxiosInstance to make the request
 * @param projectName Name of the project
 * @returns the axios response
 */
export async function findProjectByName (client: AxiosInstance, projectName: string): Promise<AxiosResponse> {
  const params = `filters=[{"name":{"operator":"=","values":"${projectName}"}},{"active":{"operator":"=","values":["t"]}}]`

  return client.request({
    url: `/projects/?${params}`,
    method: 'get',
  })
}

/**
 * Create project from a template and under a root-project
 * @param client AxiosInstance to make the request
 * @param projectName Name of the project
 * @param OPENPROJECT_TEMPLATE_PROJECT_ID (env var): ID of the project that serves as a template
 * @param OPENPROJECT_ANCESTOR_PROJECT_ID (env var): root project ID
 * @returns OpenProject treat this request in async mode
 */
export async function createProject (client: AxiosInstance, projectName: string): Promise<AxiosResponse> {
  const templateProjectID = requiredEnv('OPENPROJECT_TEMPLATE_PROJECT_ID')
  const ancestorProjectID = requiredEnv('OPENPROJECT_ANCESTOR_PROJECT_ID')

  return client.request({
    url: `/projects/${templateProjectID}/copy`,
    method: 'post',
    data: {
      name: projectName,
      parent: {
        href: `/api/v3/projects/${ancestorProjectID}`,
      },
    },
  })
}

/**
 * Delete a project
 * @param client AxiosInstance to make the request
 * @param projectID Name of the project
 * @returns OpenProject treat this request in async mode
 */
export async function deleteProject (client: AxiosInstance, projectID: number): Promise<AxiosResponse> {
  return client.request({
    url: `/projects/${projectID}`,
    method: 'delete',
  })
}
