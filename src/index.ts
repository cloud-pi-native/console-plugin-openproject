import { type Plugin, ServiceInfos } from '@cpn-console/hooks'
import monitor from './monitor.js'
import { deleteProjectOpenProject, upsertProjectOpenProject } from './functions.js'

const infos: ServiceInfos = {
  name: 'supportserviceteam',
  to: ({ clusters }) => 'https://support.dev.numerique-interieur.com/',
  title: 'Support',
  imgSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAOVBMVEX///8ggMDg7fZ5stmy0urq8/kuiMQEcLgAbrcJc7phpNMCb7hGlcv2+v2iyeXN4vFpqdWKvN7v9vsUXcS/AAABRklEQVRYw+1WwZaDIAwUEBIgIPD/H7vEttbu27qCe+lb5qBcMiQwkzBNAwMDLQiaEXrDF0WGQWrpCS9KIKL3vn5Fbs8iJPDwgLeqmSGvgcjwzBAb46XBGmZcSskJTsXoNoLI+5O8HSZVBju3ESisaT8Of7YAmNsIHAJuWctaBKpB8OEEi/XNOkhMUO6+cqzlX8xQlvkFVJUo4rqMVIUIQh6GZ7KvWF18XyL74rACSYBP8/8IOjKjJjwM9gjusADFuyPYt6BYDgvghmFdnN9hKSd6Rwr9zf+ld0xaSqm332mC7ZYLCSGqalX9Uekg0AY9Opayx7N99DsB3Ajg0wn2buwiiBYxnZ2C+7mz9o56jSG6fFYHPHfALM8pBo2DtKxmFNscRSMbtTxbf2mST0HZ3VsCenyVr71m+PDypffUH7zoBgb+Kb4AdPAVKqT5cCwAAAAASUVORK5CYII=',
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
