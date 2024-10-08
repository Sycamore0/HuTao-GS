import translate from '@/translate'
import { EquipTypeEnum } from '@/types/enum'
import { CommandDefinition } from '..'

const guidCommand: CommandDefinition = {
  name: 'guid',
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

    const { currentAvatar } = player
    if (!currentAvatar) return printError(translate('generic.playerNoCurAvatar'))

    const { guid, equipMap } = currentAvatar
    const equips = Object.entries(equipMap).map(e => `${EquipTypeEnum[parseInt(e[0])]}: ${e[1]?.guid?.toString()}`)

    print(`Avatar: ${guid?.toString()}`)
    for (const equip of equips) print(equip)
  }
}

export default guidCommand