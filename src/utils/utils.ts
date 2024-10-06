// utils/dirname.ts
import { fileURLToPath } from 'url'
import path from 'path'
import os from 'os'

export const getDirname = (metaUrl: string) => {
  const __filename = fileURLToPath(metaUrl)
  return path.dirname(__filename)
}

export const getLocalNetworkIp = (): string => {
  const interfaces = os.networkInterfaces()
  let ipAddress = 'localhost' // Fallback to localhost

  for (const name of Object.keys(interfaces)) {
    const ifaceArray = interfaces[name]
    if (ifaceArray) { // Ensure ifaceArray is not undefined
      for (const iface of ifaceArray) {
        if (iface.family === 'IPv4' && !iface.internal) {
          ipAddress = iface.address // Get the local network IP
          break
        }
      }
    }
  }
  return ipAddress
}