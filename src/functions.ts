import { AxiosResponse } from 'axios'
import { client } from './config.js'
import { findUserByLogin } from './api_users.js'
import { createProject, findProjectByName } from './api_projects.js'
import { parseError, type Project, type StepCall, PluginResult } from '@cpn-console/hooks'
import { requiredEnv } from '@cpn-console/shared'

import { createMembership } from './api_memberships.js'

async function getOrCreateProjectID (projectName: string): Promise<number> {
  let responseProject: AxiosResponse = await findProjectByName(client, projectName)

  if (responseProject?.data?.count === 0) {
    // Création du projet s'il n'existe pas
    await createProject(client, projectName)
    responseProject = await findProjectByName(client, projectName)
  }

  return responseProject?.data?._embedded?.elements[0]?.id
}

async function getUserID (login: string): Promise<number> {
  const resp: AxiosResponse = await findUserByLogin(client, login)

  return resp?.data?._embedded?.elements[0]?.id
}

export const upsertProjectOpenProject: StepCall<Project> = async (_payload) => {
  try {
    const organizationName : string = _payload.args.organization.name
    const projectNameConsole : string = _payload.args.name
    const users = _payload.args.users

    const roleID = parseInt(requiredEnv('MEMBERSHIP_ROLE_ID'))

    // Gestion de l'unicité des noms de projet comme pour la console
    const projectName : string = `${organizationName}-${projectNameConsole}`

    const projectID = await getOrCreateProjectID(projectName)

    if (projectID === undefined) {
      const returnData: PluginResult = {
        status: {
          result: 'OK',
          message: 'Project not found',
        },
        projectName: `${projectName}`,
      }
      return returnData
    }

    const usersKO: Array<string> = []
    const usersOK: Array<number> = []

    for (const user of users) {
      const userID = await getUserID(user.email)

      if (userID === undefined) {
        usersKO.push(user.email)
      } else {
        usersOK.push(userID)
      }
    }

    await Promise.all(usersOK.map(async userID => {
      createMembership(client, projectID, userID, roleID)
    }))

    const returnData: PluginResult = {
      status: {
        result: 'OK',
      },
    }

    if (usersKO.length > 0) {
      returnData.status.message = 'Error users not found'
      returnData.usersKO = usersKO
    }

    return returnData
  } catch (error) {
    return {
      status: {
        result: 'OK',
        message: 'An error happend while creating project/adding users',
      },
      error: parseError(error),
    }
  }
}
