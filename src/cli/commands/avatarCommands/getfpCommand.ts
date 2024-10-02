import translate from '@/translate'
import { FightPropEnum } from '@/types/enum'
import { CommandDefinition } from '..'

const getfpCommand: CommandDefinition = {
  name: 'getfp',
  usage: 2,
  args: [
    { name: 'fightProp', type: 'str' },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [fightProp, uid] = args
    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)

    if (!player) return printError(translate('generic.playerNotFound'))

    const prop = isNaN(parseInt(fightProp)) ? FightPropEnum[<string>fightProp] : fightProp
    if (FightPropEnum[prop] == null) return printError(translate('cli.commands.getfp.error.invalidFightProp'))

    const { currentAvatar } = player
    if (!currentAvatar) return printError(translate('generic.playerNoCurAvatar'))

    const value = await currentAvatar.getProp(prop)
    print(translate('cli.commands.getfp.info.get', FightPropEnum[prop], prop, value))
  }
}

export default getfpCommand