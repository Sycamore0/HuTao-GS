import Packet, { PacketInterface, PacketContext } from '#/packet'
import { CompoundQueueData } from '@/types/proto/CompoundQueueData'
import { RetcodeEnum } from '@/types/proto/enum'

export interface GetCompoundDataReq { }

export interface GetCompoundDataRsp {
  retcode: RetcodeEnum
  unlockCompoundList?: number[]
  compoundQueDataList?: CompoundQueueData[]
}

class GetCompoundDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetCompoundData')
  }

  async request(context: PacketContext, data: GetCompoundDataReq): Promise<void> {
    await this.response(context, { retcode: RetcodeEnum.RET_UNKNOWN_ERROR })
  }

  async response(context: PacketContext, data: GetCompoundDataRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetCompoundDataPacket
export default (() => packet = packet || new GetCompoundDataPacket())()