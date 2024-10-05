import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'
import ResinChange from './ResinChange'

export interface BuyResinReq { }

export interface BuyResinRsp {
  retcode: RetcodeEnum
  curValue?: number
}

class BuyResinPacket extends Packet implements PacketInterface {
  constructor() {
    super('BuyResin')
  }

  async request(context: PacketContext, data: BuyResinReq): Promise<void> {
    const { player } = context
    let curValue = player.resin

    // always first time
    // Cost primogem [50, 100, 100, 150, 200, 200]
    // Limit 6 times (official server)
    if (player.primogem >= 50) {
      player.addPrimogem(-50)
      player.addResin(60)

      await ResinChange.sendNotify(context)
      await this.response(context, {
        retcode: RetcodeEnum.RET_SUCC,
        curValue: player.resin + 60
      })
    } else {
      await this.response(context, {
        retcode: RetcodeEnum.RET_RESIN_GAIN_FAILED,
        curValue: player.resin
      })
    }

    
  }

  async response(context: PacketContext, data: BuyResinRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: BuyResinPacket
export default (() => packet = packet || new BuyResinPacket())()