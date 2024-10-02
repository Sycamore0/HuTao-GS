import translate from '@/translate'
import { FightPropEnum } from '@/types/enum'
import { CommandDefinition } from '..'

const fpCommand: CommandDefinition = {
  name: 'fp',
  usage: 3,
  args: [
    { name: 'mode', type: 'str', values: ['get', 'list', 'set'] },
    { name: 'fightProp', type: 'str', optional: true },
    { name: 'value', type: 'num', optional: true },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [mode, fightProp, value, uid] = args

    print('TODO')
  }
}

export default fpCommand