import Packet, { PacketContext, PacketInterface } from '#/packet'
import Monster from '$/entity/monster'
import Vector from '$/utils/vector'
import { ClientStateEnum } from '@/types/enum'
import { ChangeHpReasonEnum, PlayerDieTypeEnum, ProtEntityTypeEnum, RetcodeEnum, SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/proto/enum'
import Logger from '@/logger'
import Gadget from '$/entity/gadget'
import SceneData from '$/gameData/data/SceneData'
import DungeonData from '$/gameData/data/DungeonData'
const logger = new Logger('GMTALK')

export interface GmTalkReq {
  msg: string
}

export interface GmTalkRsp {
  retcode: RetcodeEnum
  msg?: string
  retmsg?: string
}

class GmTalkPacket extends Packet implements PacketInterface {
  constructor() {
    super('GmTalk', {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true
    })
  }

  private async gmtHp(context: PacketContext, amount: number) {
    const { player, seqId } = context
    const { currentAvatar } = player
    if (amount > 0) {
      logger.info(`[${player.uid}]Player's current avatar(id: ${currentAvatar.avatarId}) hp add ${amount}.`)
      await currentAvatar.heal(amount, true, ChangeHpReasonEnum.CHANGE_HP_ADD_GM, seqId)
    }
    else {
      logger.info(`[${player.uid}]Player's current avatar(id: ${currentAvatar.avatarId}) hp sub ${amount}.`)
      await currentAvatar.takeDamage(0, -amount, true, ChangeHpReasonEnum.CHANGE_HP_SUB_GM, seqId)
    }
  }

  private async gmtMonster(context: PacketContext, id: number, count: number, lvl?: number, pose?: number, x?: number, y?: number, z?: number) {
    const { player } = context
    const { currentScene, pos: playerPos } = player
    const { entityManager } = currentScene

    const pos = (x == null || y == null || z == null) ? playerPos.clone() : new Vector(x, y, z)

    for (let i = 0; i < count; i++) {
      logger.info(`[${player.uid}]Summon monster(id: ${id}, lvl: ${lvl}) in [${x}, ${y}, ${z}].`)
      const entity = new Monster(id, player)

      entity.motion.pos.copy(pos)
      entity.bornPos.copy(pos)

      await entity.initNew(lvl || 1)
      await entityManager.add(entity)
    }
  }

  private async gmtKill(context: PacketContext, type: string, all: boolean) {
    const { player } = context
    const { currentScene, currentAvatar, loadedEntityIdList } = player
    const { entityManager } = currentScene

    let entityType: ProtEntityTypeEnum
    switch (type) { // NOSONAR
      case 'MONSTER':
        entityType = ProtEntityTypeEnum.PROT_ENTITY_MONSTER
        logger.info(`[${player.uid}]Killing all monsters.`)
        break
      default:
        return
    }

    if (!all) return

    const entityList = loadedEntityIdList
      .map(id => entityManager.getEntity(id, true))
      .filter(e => e != null && e.protEntityType === entityType && e.isAlive())
      .sort((a, b) => Math.sign(a.distanceTo2D(currentAvatar) - b.distanceTo2D(currentAvatar)))

    let i = 0
    for (const entity of entityList) {
      if (i++ > 32) break
      await entity.kill(0, PlayerDieTypeEnum.PLAYER_DIE_NONE, undefined, true)
    }

    await entityManager.flushAll()
  }

  private async gmtGod(context: PacketContext, enable: boolean, type?: string) {
    const { player } = context
    if (type == null) player.godMode = enable
    logger.info(`[${player.uid}]GodMode set to ${enable}.`)
  }

  private async gmtTp(context: PacketContext, x: number, y: number, z: number) {
    const { player } = context
    const { currentScene } = player
    logger.info(`[${player.uid}]Teleporting to [${x}, ${y}, ${z}].`)
    currentScene.join(context, new Vector(x, y, z), new Vector(), SceneEnterTypeEnum.ENTER_GOTO, SceneEnterReasonEnum.TRANS_POINT)
  }

  private async gmtScoin(context: PacketContext, amount: number) {
    const { player } = context
    player.addMora(amount, true)
    logger.info(`[${player.uid}]Add scoin(amount: ${amount}).`)
  }

  private async gmtGadget(context: PacketContext, id: number, lv: number) {
    const { player } = context
    const gadget = new Gadget(id)
    logger.info(`[${player.uid}]Summon gadget(id: ${id}, lvl: ${lv}) in [${player.pos.x}, ${player.pos.y}, ${player.pos.z}].`)

    gadget.motion.pos.copy(player.pos)
    gadget.bornPos.copy(player.pos)

    await gadget.initNew(lv)
    await player.currentScene.entityManager.add(gadget)
  }

  private async getSceneData(sceneId: number) {
    const sceneData = await SceneData.getScene(sceneId)

    const { BornPos, BornRot } = sceneData
    const pos = new Vector()
    const rot = new Vector()
    pos.setData(BornPos)
    rot.setData(BornRot)

    return { pos, rot }
  }

  private async gmtJump(context: PacketContext, id: number) {
    const { player } = context

    const scene = await player.currentWorld.getScene(id)
    const { pos, rot } = await this.getSceneData(id)

    logger.info(`[${player.uid}]Teleporting to [${pos}] in scene ${id}.`)
    scene.join(context, pos, rot, SceneEnterTypeEnum.ENTER_JUMP, SceneEnterReasonEnum.TRANS_POINT)
  }

  private async gmtDungeon(context: PacketContext, id: number) {
    const { player } = context
    const sceneId = await DungeonData.getSceneByDungeon(id)

    const scene = await player.currentWorld.getScene(sceneId)
    const { pos, rot } = await this.getSceneData(sceneId)

    logger.info(`[${player.uid}]Teleporting to [${pos}] in dungeon ${id}(scene ${sceneId}).`)

    scene.join(context, pos, rot, SceneEnterTypeEnum.ENTER_DUNGEON, SceneEnterReasonEnum.DUNGEON_ENTER)
  }

  private async gmtLevel(context: PacketContext, level: number) {
    const { player } = context
    player.currentAvatar.level = level
    logger.info(`[${player.uid}]Current avatar level set to ${level}.`)
  }

  private async gmtBreak(context: PacketContext, promoteLevel: number) {
    const { player } = context
    player.currentAvatar.promoteLevel = promoteLevel
    logger.info(`[${player.uid}]Current avatar promote level set to ${promoteLevel}.`)
  }

  async request(context: PacketContext, data: GmTalkReq): Promise<void> {
    const { msg } = data
    const cmd = msg?.split(' ')?.[0]?.toLowerCase()
    const args = msg?.split(' ')?.slice(1) || []

    logger.info(`[${context.player.uid}] ${msg}`)

    switch (cmd) {
      case 'hp':
        await this.gmtHp(context, Number(args[0]))
        break
      case 'monster':
        await this.gmtMonster.call(this, context, ...args.map(arg => Number(arg)))
        break
      case 'kill':
        await this.gmtKill(context, args[0], args[1] === 'ALL')
        break
      case 'wudi':
        await this.gmtGod(context, args.slice(-1)[0] === 'ON', args.length > 1 ? args[0] : undefined)
        break
      case 'goto':
        await this.gmtTp(context, Number(args[0]), Number(args[1]), Number(args[2]))
        break
      case 'scoin':
        await this.gmtScoin(context, Number(args[0]))
        break
      case 'gadget':
        await this.gmtGadget(context, Number(args[0]), Number(args[1]))
        break
      case 'jump':
        await this.gmtJump(context, Number(args[0]))
        break
      case 'dungeon':
        await this.gmtDungeon(context, Number(args[0]))
        break
      case 'level':
        await this.gmtLevel(context, Number(args[0]))
        break
      case 'break':
        await this.gmtBreak(context, Number(args[0]))
        break
      default:
        logger.warn(`[${context.player.uid}]Unsupported GM command: ${msg}`)
        await this.response(context, { retcode: RetcodeEnum.RET_UNKNOWN_ERROR })
        return
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      msg
    })
  }

  async response(context: PacketContext, data: GmTalkRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GmTalkPacket
export default (() => packet = packet || new GmTalkPacket())()