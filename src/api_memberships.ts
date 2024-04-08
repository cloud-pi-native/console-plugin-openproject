import { AxiosInstance, AxiosResponse } from 'axios'

// Add a user to a project with a particular role
export async function createMembership(client: AxiosInstance, projectId: number, userId: number, roleId: number): Promise<AxiosResponse> {
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
    console.log(response)
    return response
  }).catch(response => {
    console.error(response)
    return response
  })

  return resp
}
