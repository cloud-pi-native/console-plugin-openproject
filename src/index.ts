import { type Plugin, ServiceInfos } from '@cpn-console/hooks'
import monitor from './monitor.js'
import { deleteProjectOpenProject, upsertProjectOpenProject } from './functions.js'
import { readFileSync } from 'fs'

const imageData = Buffer.from((readFileSync('./files/logo.png')).toString('base64'))

const infos: ServiceInfos = {
  name: 'openproject',
  to: () => 'https://support.dev.numerique-interieur.com/',
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
