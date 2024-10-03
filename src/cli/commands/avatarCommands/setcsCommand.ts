import translate from '@/translate'
import { CommandDefinition } from '..'

const setcsCommand: CommandDefinition = {
  name: 'setcs',
  usage: 2,
  args: [
    { name: 'id', type: 'num' },
    { name: 'uidInput', type: 'str', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [id, uidInput] = args

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

    const { currentAvatar } = player
    if (!currentAvatar) return printError(translate('generic.playerNoCurAvatar'))

    if (await currentAvatar.skillManager.setCandSkillId(id)) {
      print(translate('cli.commands.setcs.info.setSkill', id))
    } else {
      printError(translate('cli.commands.setcs.error.noSkill'))
    }
  }
}

export default setcsCommand