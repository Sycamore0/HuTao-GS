import translate from '@/translate'
import { PlayerDieTypeEnum, ProtEntityTypeEnum } from '@/types/proto/enum'
import { CommandDefinition } from '..'

const killallCommand: CommandDefinition = {
  name: 'killall',
  usage: 2,
  args: [
    { name: 'uidInput', type: 'str', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [uidInput] = args

    let uid;
    if (uidInput === '@s' || uidInput === undefined) {
      uid = sender?.uid;
    } else if (!isNaN(parseInt(uidInput))) {
      uid = parseInt(uidInput);
    } else {
      return printError(translate('generic.invalidTarget'));
    }

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate('generic.playerNotFound'))

    const { currentScene, currentAvatar, loadedEntityIdList } = player
    if (!currentAvatar) return printError(translate('generic.playerNoCurAvatar'))
    if (!currentScene) return printError(translate('generic.notInScene'))

    print(translate('cli.commands.killall.info.killMonsters'))

    const { entityManager } = currentScene
    const entityList = loadedEntityIdList
      .map(id => entityManager.getEntity(id, true))
      .filter(e => e != null && e.protEntityType === ProtEntityTypeEnum.PROT_ENTITY_MONSTER && e.isAlive())
      .sort((a, b) => Math.sign(a.distanceTo2D(currentAvatar) - b.distanceTo2D(currentAvatar)))

    let i = 0
    for (const entity of entityList) {
      if (i++ > 32) break
      await entity.kill(0, PlayerDieTypeEnum.PLAYER_DIE_NONE, undefined, true)
    }

    await entityManager.flushAll()
  }
}

export default killallCommand