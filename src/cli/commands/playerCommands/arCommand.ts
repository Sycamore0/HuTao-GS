import translate from '@/translate'
import { CommandDefinition } from '..'

const arCommand: CommandDefinition = {
  name: 'ar',
  usage: 2,
  args: [
    { name: 'level', type: 'int' },
    { name: 'uidInput', type: 'str', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [level, uidInput] = args

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

    await player.setLevel(level)
    print(translate('cli.commands.ar.info.setAR', player.level))
  }
}

export default arCommand