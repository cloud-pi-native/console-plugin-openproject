import { AxiosResponse } from 'axios'
import { client } from './config.js'
import { findUserByLogin } from './api_users.js'
import { createProject, deleteProject, findProjectByName } from './api_projects.js'
import { parseError, type Project, type StepCall, PluginResult } from '@cpn-console/hooks'
import { requiredEnv } from '@cpn-console/shared'

import { getMembershipsForProject, createMembership, deleteMembership } from './api_memberships.js'

function delay (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function getProjectID (projectName: string): Promise<number> {
  const responseProject: AxiosResponse = await findProjectByName(client, projectName)

  return responseProject?.data?._embedded?.elements[0]?.id
}

async function getOrCreateProjectID (projectName: string): Promise<number> {
  let projectID = await getProjectID(projectName)

  if (!projectID) {
    // Création du projet s'il n'existe pas
    await createProject(client, projectName)

    // La création d'un projet est asynchrone côté OpenProject, sleep arbitraire
    await delay(3000)
    projectID = await getProjectID(projectName)
  }

  return projectID
}

async function getUserID (login: string): Promise<number> {
  const resp: AxiosResponse = await findUserByLogin(client, login)

  return resp?.data?._embedded?.elements[0]?.id
}

type Membership = {
  membershipID: number,
  userID: number
}

async function getUsersIDForProject (projectID: number): Promise<Array<Membership>> {
  const resp: AxiosResponse = await getMembershipsForProject(client, projectID)

  const memberships: Array<Membership> = []

  const membershipsCount = resp?.data?.count
  if ((membershipsCount === 0) || (!membershipsCount)) {
    return memberships
  }

  for (const element of resp.data._embedded.elements) {
    if (element._type !== 'Membership') {
      continue
    }

    // String de la forme: '/api/v3/roles/33'
    const userHref = element._links.principal.href
    const userID = userHref.split('/').at(-1)

    const mTmp:Membership = {
      membershipID: parseInt(element.id),
      userID: parseInt(userID),
    }

    memberships.push(mTmp)
  }

  return memberships
}

export const upsertProjectOpenProject: StepCall<Project> = async (_payload) => {
  try {
    const organizationName : string = _payload.args.organization.name
    const projectNameDSO : string = _payload.args.name
    const users = _payload.args.users

    const roleID = parseInt(requiredEnv('MEMBERSHIP_ROLE_ID'))

    // Gestion de l'unicité des noms de projet comme pour la console
    const projectNameUniq : string = `${organizationName}-${projectNameDSO}`

    const projectID = await getOrCreateProjectID(projectNameUniq)

    if (!projectID) {
      console.warn(`Project not found: ${projectNameUniq}`)
      const returnData: PluginResult = {
        status: {
          result: 'OK',
          message: 'Project not found',
        },
        projectName: `${projectNameUniq}`,
      }
      return returnData
    }

    const usersNotFound: Array<string> = []
    const usersFound: Array<number> = []

    for (const user of users) {
      const userID = await getUserID(user.email)

      if (!userID) {
        usersNotFound.push(user.email)
      } else {
        usersFound.push(userID)
      }
    }

    const memberships = await getUsersIDForProject(projectID)

    const membershipsToCreate = usersFound.filter((id) => !memberships.some((membership) => membership.userID === id))
    const membershipsToDelete = memberships.filter((membership) => !usersFound.some((id) => membership.userID === id))

    await Promise.all(membershipsToDelete.map(membership => deleteMembership(client, membership.membershipID)))
    await Promise.all(membershipsToCreate.map(userID => createMembership(client, projectID, userID, roleID)))

    const returnData: PluginResult = {
      status: {
        result: 'OK',
      },
      membershipsCreated: `${membershipsToCreate.length}`,
      membershipsDeleted: `${membershipsToDelete.length}`,
    }

    if (usersNotFound.length > 0) {
      returnData.status.message = 'Error users not found'
      returnData.usersNotFound = usersNotFound
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

export const deleteProjectOpenProject: StepCall<Project> = async (_payload) => {
  try {
    const organizationName : string = _payload.args.organization.name
    const projectNameDSO : string = _payload.args.name

    // Gestion de l'unicité des noms de projet comme pour la console
    const projectNameUniq : string = `${organizationName}-${projectNameDSO}`

    const projectID = await getOrCreateProjectID(projectNameUniq)

    if (!projectID) {
      console.warn(`Project not found: ${projectNameUniq}`)
      const returnData: PluginResult = {
        status: {
          result: 'OK',
          message: 'Project not found',
        },
        projectName: `${projectNameUniq}`,
      }
      return returnData
    }

    await deleteProject(client, projectID)

    const returnData: PluginResult = {
      status: {
        result: 'OK',
      },
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