import translate from '@/translate'
import { CommandDefinition } from '..'

const mcoinCommand: CommandDefinition = {
  name: 'mcoin',
  usage: 2,
  args: [
    { name: 'amount', type: 'int' },
    { name: 'uidInput', type: 'str', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [amount, uidInput] = args

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

    print(translate('cli.commands.mcoin.info.give', amount))

    player.addGenesisCrystal(amount)
  }
}

export default mcoinCommand