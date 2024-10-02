import translate from '@/translate'
import config from '@/config'
import { CommandDefinition } from '..'

const scriptCommand: CommandDefinition = {
  name: 'script',
  args: [
    { name: 'name', type: 'str' },
    { name: 'uid', type: 'int', optional: true }
  ],
  allowPlayer: config.allowClientRCE,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli

    const [name, uid] = args

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate('generic.playerNotFound'))

    if (await player.windyRce(name)) print(translate('cli.commands.script.info.send'))
    else printError(translate('cli.commands.script.error.scriptNotFound'))
  }
}

export default scriptCommand