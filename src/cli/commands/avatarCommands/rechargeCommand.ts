import translate from '@/translate'
import { CommandDefinition } from '..'

const rechargeCommand: CommandDefinition = {
  name: 'recharge',
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
    if (uidInput === '@s' || uidInput === undefined) {
      uid = sender?.uid;
    } else if (!isNaN(parseInt(uidInput))) {
      uid = parseInt(uidInput);
    } else {
      return printError(translate('generic.invalidTarget'));
    }

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
    if (!player) return printError(translate('generic.playerNotFound'))

    const avatarList = player.teamManager.getTeam()?.avatarList || []
    for (const avatar of avatarList) await avatar.rechargeEnergy(true)

    print(translate('cli.commands.recharge.info.recharge'))
  }
}

export default rechargeCommand