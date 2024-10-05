import Packet, { PacketInterface, PacketContext } from '#/packet'

export interface ResinChangeNotify {
  nextAddTimestamp: number
  curBuyCount: number
  curValue: number
}

class ResinChangePacket extends Packet implements PacketInterface {
  constructor() {
    super('ResinChange')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const { player } = context

    const notifyData: ResinChangeNotify = {
      nextAddTimestamp: Date.now(),
      curBuyCount: 0,
      curValue: player.resin + 60
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: ResinChangePacket
export default (() => packet = packet || new ResinChangePacket())()