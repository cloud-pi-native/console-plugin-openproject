import { AxiosInstance, AxiosResponse } from 'axios'

export async function findUserByLogin (client: AxiosInstance, login: string): Promise<AxiosResponse> {
  const params = `filters=[{"login":{"operator":"=","values":"${login}"}}]`
  const resp = await client.request({
    url: `/users/?${params}`,
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
