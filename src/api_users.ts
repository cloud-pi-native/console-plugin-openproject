import { AxiosInstance, AxiosResponse } from 'axios'

export async function findUserByLogin (client: AxiosInstance, login: string): Promise<AxiosResponse> {
  const params = `filters=[{"login":{"operator":"=","values":"${login}"}}]`
  return client.request({
    url: `/users/?${params}`,
    method: 'get',
  })
}
