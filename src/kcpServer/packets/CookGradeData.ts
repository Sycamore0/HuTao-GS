import Packet, { PacketInterface, PacketContext } from '#/packet'

export interface CookGradeDataNotify {
  grade: number
}

class CookGradeDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('CookGradeData')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const notifyData: CookGradeDataNotify = {
      grade: 3 // what???
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: CookGradeDataPacket
export default (() => packet = packet || new CookGradeDataPacket())()