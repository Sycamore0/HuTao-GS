import Packet, { PacketInterface, PacketContext } from '#/packet'
import { CookRecipeData } from '@/types/proto/CookRecipeData'
import CookData from '$/gameData/data/CookData'

export interface CookDataNotify {
  recipeDataList: CookRecipeData[]
  upgrade: number
}

class CookDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('CookData')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const cookRecipeList = await CookData.getRecipeList()

    const recipeDataList = cookRecipeList.map(recipe => ({
      recipeId: recipe.Id,
      proficiency: recipe.MaxProficiency
    }))

    const notifyData: CookDataNotify = {
      recipeDataList,
      upgrade: 3 // what???
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: CookDataPacket
export default (() => packet = packet || new CookDataPacket())()