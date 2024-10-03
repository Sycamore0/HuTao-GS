import translate from '@/translate'
import { CommandDefinition } from '..'

const posCommand: CommandDefinition = {
  name: 'pos',
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
    if (uidInput === '@s') {
      uid = sender?.uid;
    } else if (!isNaN(parseInt(uidInput))) {
      uid = parseInt(uidInput);
    } else {
      return printError(translate('generic.invalidTarget'));
    }

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate('generic.playerNotFound'))

    const pos = player.pos
    if (!pos) return printError(translate('generic.playerNoPos'))

    print(translate('cli.commands.pos.info.posInfo', player.currentScene?.id || '?', pos.x, pos.y, pos.z))
  }
}

export default posCommand