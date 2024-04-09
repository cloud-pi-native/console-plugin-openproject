import { AxiosInstance, AxiosResponse } from 'axios'

export async function getMembershipsForProject (client: AxiosInstance, projectId: number): Promise<AxiosResponse> {
  const params = `filters=[{"project":{"operator":"=","values":"${projectId}"}}]`
  const resp = await client.request({
    url: `/memberships/?${params}`,
    method: 'get',
  }).then(response => {
    return response
  }).catch(response => {
    console.error(response)
    return response
  })

  return resp
}

// Add a user to a project with a particular role
export async function createMembership (client: AxiosInstance, projectId: number, userId: number, roleId: number): Promise<AxiosResponse> {
  const resp = await client.request({
    url: '/memberships/',
    method: 'post',
    data: {
      _links: {
        principal: { href: `/api/v3/users/${userId}` },
        roles: [
          { href: `/api/v3/roles/${roleId}` },
        ],
        project: { href: `/api/v3/projects/${projectId}` },
      },
    },
  }).then(response => {
    return response
  }).catch(response => {
    console.error(response)
    return response
  })

  return resp
}

// Delete a user from a project
export async function deleteMembership (client: AxiosInstance, membershipID: number): Promise<AxiosResponse> {
  const params = `${membershipID}`
  const resp = await client.request({
    url: `/memberships/${params}`,
    method: 'delete',
  }).then(response => {
    return response
  }).catch(response => {
    console.error(response)
    return response
  })

  return resp
}
