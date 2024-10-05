import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ShopGoods } from '@/types/proto'
import { RetcodeEnum } from '@/types/proto/enum'
import Material from '$/material'

export interface BuyGoodsReq {
  buyCount: number
  shopType: number
  goods: ShopGoods
}

export interface BuyGoodsRsp {
  retcode: RetcodeEnum
  buyCount: number
  shopType: number
  goods: ShopGoods
  goodsList?: ShopGoods[]
}

class BuyGoodsPacket extends Packet implements PacketInterface {
  constructor() {
    super('BuyGoods')
  }

  async request(context: PacketContext, data: BuyGoodsReq): Promise<void> {
    const { game, player } = context
    const { buyCount, shopType, goods } = data

    const goodsList = await game.shopManager.exportGoodsList(shopType, player)

    // cost
    if (goods.scoin !== undefined || 0) {
      player.addMora(-goods.scoin)
    } else if (goods.hcoin !== undefined || 0) {
      player.addPrimogem(-goods.hcoin)
    } else if (goods.mcoin !== undefined || 0) {
      player.addGenesisCrystal(-goods.mcoin)
    } else {
      const costItemList = goods.costItemList
      costItemList.forEach(costItem => {
        if (costItem && costItem.itemId !== undefined && costItem.count !== undefined) {
          player.inventory.remove(costItem.itemId, costItem.count);
        }
      });
    }

    const { itemId: goodItemId, count: goodItemCount } = goods.goodsItem
    const goodItem = await Material.create(player, goodItemId, goodItemCount * buyCount)
    player.inventory.add(goodItem)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      buyCount: buyCount,
      shopType: shopType,
      goods: goods,
      goodsList
    })
  }

  async response(context: PacketContext, data: BuyGoodsRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: BuyGoodsPacket
export default (() => packet = packet || new BuyGoodsPacket())()