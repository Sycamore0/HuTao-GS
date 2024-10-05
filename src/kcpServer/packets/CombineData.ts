import Packet, { PacketInterface, PacketContext } from '#/packet'
import CombineData from '$/gameData/data/CombineData'

export interface CombineDataNotify {
  combineIdList: number[]
}

class CombineDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('CombineData')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    // Get all combineId
    const combineIdList = (await CombineData.getCombineList()).map(data => data.CombineId)
    const notifyData: CombineDataNotify = {
      combineIdList
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: CombineDataPacket
export default (() => packet = packet || new CombineDataPacket())()