import { AxiosInstance, AxiosResponse } from 'axios'

export async function getMembershipsForProject (client: AxiosInstance, projectId: number): Promise<AxiosResponse> {
  const params = `filters=[{"project":{"operator":"=","values":"${projectId}"}}]`
  return client.request({
    url: `/memberships/?${params}`,
    method: 'get',
  })
}

// Add a user to a project with a particular role
export async function createMembership (client: AxiosInstance, projectId: number, userId: number, roleId: number): Promise<AxiosResponse> {
  return client.request({
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
  })
}

// Delete a user from a project
export async function deleteMembership (client: AxiosInstance, membershipID: number): Promise<AxiosResponse> {
  const params = `${membershipID}`
  return client.request({
    url: `/memberships/${params}`,
    method: 'delete',
  })
}
