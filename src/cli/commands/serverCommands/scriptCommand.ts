import translate from '@/translate'
import config from '@/config'
import { CommandDefinition } from '..'

const scriptCommand: CommandDefinition = {
  name: 'script',
  args: [
    { name: 'name', type: 'str' },
    { name: 'uidInput', type: 'str', optional: true }
  ],
  allowPlayer: config.allowClientRCE,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli

    const [name, uidInput] = args

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

    if (await player.windyRce(name)) print(translate('cli.commands.script.info.send'))
    else printError(translate('cli.commands.script.error.scriptNotFound'))
  }
}

export default scriptCommand