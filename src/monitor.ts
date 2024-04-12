import { type MonitorInfos, MonitorStatus, Monitor, requiredEnv } from '@cpn-console/shared'
import axios from 'axios'

const openprojectBaseURL = requiredEnv('OPENPROJECT_BASE_URL')

const monitor = async (instance: Monitor): Promise<MonitorInfos> => {
  instance.lastStatus.lastUpdateTimestamp = (new Date()).getTime()
  try {
    await axios.get(`${openprojectBaseURL}/health_checks/all`, {
      validateStatus: (res) => res === 200,
    })
    instance.lastStatus.status = MonitorStatus.OK
    instance.lastStatus.message = MonitorStatus.OK
    return instance.lastStatus
  } catch (error) {
    instance.lastStatus.message = 'Erreur lors la requête'
    instance.lastStatus.status = MonitorStatus.UNKNOW
    instance.lastStatus.cause = error
  }
  return instance.lastStatus
}

export default new Monitor(monitor)
