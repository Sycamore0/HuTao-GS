import Packet, { PacketInterface, PacketContext } from '#/packet'
import CombineData from '$/gameData/data/CombineData'
import Material from '$/material'
import { ItemParam } from '@/types/proto/ItemParam'
import { RetcodeEnum } from '@/types/proto/enum'

export interface CombineReq {
  combineId: number
  combineCount: number
  avatarGuid?: string
}

export interface CombineRsp {
  retcode: RetcodeEnum
  combineId: number
  combineCount: number
  avatarGuid?: string
  costItemList: ItemParam[]
  resultItemList: ItemParam[]
  totalReturnItemList?: ItemParam[]
  totalRandomItemList?: ItemParam[]
  totalExtraItemList?: ItemParam[]
}

class CombinePacket extends Packet implements PacketInterface {
  constructor() {
    super('Combine')
  }

  async request(context: PacketContext, data: CombineReq): Promise<void> {
    const { player } = context
    const { combineId, combineCount, avatarGuid } = data

    const combineData = (await CombineData.getCombineData(combineId)) || []
    const resultItemId = combineData.find(data => data.ResultItemId)?.ResultItemId || 0
    const resultItemCount = combineData.find(data => data.ResultItemCount)?.ResultItemCount || 0
    const scoinCost = combineData.find(data => data.ScoinCost)?.ScoinCost || 0
    const costItemsList = combineData.find(data => data.MaterialItems)?.MaterialItems || []
    const costItemId = costItemsList.find(data => data.Id)?.Id || 0
    const costItemCount = costItemsList.find(data => data.Count)?.Count || 0

    // Combine
    costItemsList.forEach(costItem => {
      if (costItem && costItem.Id !== undefined && costItem.Count !== undefined) {
        player.inventory.remove(costItem.Id, costItem.Count * combineCount)
        // cost resin
        if (costItem.Id === 106) {
          player.addResin(-costItem.Count * combineCount)
        }
      }
    });
    player.addMora(-scoinCost * combineCount) // cost scoin
    const resultItem = await Material.create(player, resultItemId, combineCount)
    player.inventory.add(resultItem)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      combineId: combineId,
      combineCount: combineCount,
      avatarGuid: avatarGuid,
      costItemList: [{
        itemId: costItemId,
        count: costItemCount * combineCount
      }],
      resultItemList: [{
        itemId: resultItemId,
        count: resultItemCount
      }],

      totalReturnItemList: [],
      totalRandomItemList: [],
      totalExtraItemList: []
    })
  }

  async response(context: PacketContext, data: CombineRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: CombinePacket
export default (() => packet = packet || new CombinePacket())()