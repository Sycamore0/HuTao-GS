import translate from '@/translate'
import { CommandDefinition } from '..'

const godCommand: CommandDefinition = {
  name: 'god',
  usage: 2,
  args: [
    { name: 'uidInput', type: 'str', optional: true },
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

    player.godMode = !player.godMode

    if (player.godMode) print(translate('cli.commands.god.info.enable'))
    else print(translate('cli.commands.god.info.disable'))
  }
}

export default godCommand