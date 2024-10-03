import translate from '@/translate'
import { CommandDefinition } from '..'

const coopCommand: CommandDefinition = {
  name: 'coop',
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
    if (player.isInMp()) return printError(translate('cli.commands.coop.error.inCoop'))

    print(translate('cli.commands.coop.info.changeToCoop'))
    player.hostWorld.changeToMp()
  }
}

export default coopCommand