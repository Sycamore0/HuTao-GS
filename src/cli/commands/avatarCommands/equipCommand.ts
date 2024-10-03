import translate from '@/translate'
import { CommandDefinition } from '..'

const equipCommand: CommandDefinition = {
  name: 'equip',
  usage: 2,
  args: [
    { name: 'guid', type: 'str' },
    { name: 'uidInput', type: 'str', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [guid, uidInput] = args

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

    const equip = player.getEquip(BigInt(guid || 0))
    if (!equip) return printError(translate('cli.commands.equip.error.noEquip'))

    await currentAvatar.equip(equip)
    print(translate('cli.commands.equip.info.equip', guid))
  }
}

export default equipCommand