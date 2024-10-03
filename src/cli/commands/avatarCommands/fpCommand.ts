import translate from '@/translate'
import { FightPropEnum } from '@/types/enum'
import { CommandDefinition } from '..'

const fpCommand: CommandDefinition = {
  name: 'fp',
  usage: 6,
  args: [
    { name: 'mode', type: 'str', values: ['list', 'get', 'set'] },
    { name: 'uidInput', type: 'str', optional: true },
    { name: 'fightProp', type: 'str', optional: true },
    { name: 'value', type: 'num', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [mode, uidInput, fightProp, value] = args

    let uid;
    if (uidInput === '@s') {
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

    async function listfp(currentAvatar) {
      let propsList = translate('cli.commands.fp.info.listHead')
      for (const [propName, propValue] of Object.entries(FightPropEnum)) {
        if (typeof propValue === 'number' && isNaN(Number(propName)) && propName !== 'FIGHT_PROP_NONE') {
          try {
            const currentValue = await currentAvatar.getProp(propValue)
            propsList += translate('cli.commands.fp.info.list', propName, propValue, currentValue)
          } catch (error) {
            propsList += translate('cli.commands.fp.error.failedGet', propName, propValue, error)
          }
        }
      }
      print(propsList)
    }

    async function getfp(currentAvatar, fightProp) {
      const prop = isNaN(parseInt(fightProp)) ? FightPropEnum[<string>fightProp] : fightProp
      if (FightPropEnum[prop] == null) return printError(translate('cli.commands.fp.error.invalidFightProp'))

      const value = await currentAvatar.getProp(prop)
      print(translate('cli.commands.fp.info.get', FightPropEnum[prop], prop, value))
    }

    async function setfp(currentAvatar, fightProp, value) {
      const prop = isNaN(parseInt(fightProp)) ? FightPropEnum[<string>fightProp] : fightProp
      if (FightPropEnum[prop] == null) return printError(translate('cli.commands.fp.error.invalidFightProp'))
      await currentAvatar.setProp(prop, value, true)
      print(translate('cli.commands.fp.info.set', FightPropEnum[prop], prop, value))
    }

    switch (mode) {
      case 'list':
        listfp(currentAvatar)
        break;
      case 'get':
        getfp(currentAvatar, fightProp)
        break;
      case 'set':
        setfp(currentAvatar, fightProp, value)
        break;
      default:
        print(translate('cli.commands.fp.info.invalidMode', mode)) // Never use
        break;
    }
  }
};

export default fpCommand;