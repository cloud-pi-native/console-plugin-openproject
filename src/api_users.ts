import { AxiosInstance, AxiosResponse } from 'axios'

export async function findUserByLogin (client: AxiosInstance, login: string): Promise<AxiosResponse> {
  const params = `filters=[{"login":{"operator":"=","values":"${login}"}}]`
  return client.request({
    url: `/users/?${params}`,
    method: 'get',
  })
}

export async function createUser (client: AxiosInstance, firstName: string, lastName: string, email: string): Promise<AxiosResponse> {
  const userPassword: string = Math.random().toString(36).slice(2, 15)

  return client.request({
    url: '/users',
    method: 'post',
    data: {
      login: email,
      password: userPassword,
      firstName: firstName,
      lastName: lastName,
      email: email,
      admin: false,
      status: 'active',
      language: 'fr',
    },
  })
}
