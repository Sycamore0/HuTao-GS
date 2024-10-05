import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'

export interface McoinExchangeHcoinReq {
  hcoin: number
  mcoinCost: number
}

export interface McoinExchangeHcoinRsp {
  retcode: RetcodeEnum
  hcoin: number
  mcoinCost: number
}

export interface McoinExchangeHcoinNotify { }

class McoinExchangeHcoinPacket extends Packet implements PacketInterface {
  constructor() {
    super('McoinExchangeHcoin')
  }

  async request(context: PacketContext, data: McoinExchangeHcoinReq): Promise<void> {
    const { player } = context
    const { hcoin, mcoinCost } = data

    player.addGenesisCrystal(-mcoinCost)
    player.addPrimogem(hcoin)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      hcoin: hcoin,
      mcoinCost: mcoinCost
    })
  }

  async response(context: PacketContext, data: McoinExchangeHcoinRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: McoinExchangeHcoinPacket
export default (() => packet = packet || new McoinExchangeHcoinPacket())()