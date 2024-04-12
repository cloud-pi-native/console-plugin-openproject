import { type Plugin, ServiceInfos } from '@cpn-console/hooks'
import { requiredEnv } from '@cpn-console/shared'
import monitor from './monitor.js'
import { deleteProjectOpenProject, upsertProjectOpenProject } from './functions.js'
import { readFileSync } from 'fs'
import { join } from 'path'

const imageData = Buffer.from((readFileSync(join(__dirname, '/files/logo.png'))).toString('base64'))
const openprojectBaseURL = requiredEnv('OPENPROJECT_BASE_URL')

const infos: ServiceInfos = {
  name: 'openproject',
  to: ({ project, organization }) => `${openprojectBaseURL}/projects/${organization}-${project}/work_packages`,
  title: 'Support',
  imgSrc: `data:image/png;base64,${imageData}`,
  description: 'Outil de ticketing pour contacter la Service Team',
}

export const plugin: Plugin = {
  infos,
  subscribedHooks: {
    upsertProject: {
      steps: {
        main: upsertProjectOpenProject,
      },
    },
    deleteProject: {
      steps: {
        main: deleteProjectOpenProject,
      },
    },
  },
  monitor,
}
