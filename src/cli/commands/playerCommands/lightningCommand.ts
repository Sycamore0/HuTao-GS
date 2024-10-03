import translate from '@/translate'
import { CommandDefinition } from '..'

const lightningCommand: CommandDefinition = {
  name: 'lightning',
  args: [
    { name: 'uidInput', type: 'str', optional: true }
  ],
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

    player.thunderTarget = !player.thunderTarget
    if (player.thunderTarget) print(translate('cli.commands.lightning.info.start'))
    else print(translate('cli.commands.lightning.info.stop'))
  }
}

export default lightningCommand