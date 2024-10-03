import Vector from '$/utils/vector'
import translate from '@/translate'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/proto/enum'
import { CommandDefinition } from '..'

const tpCommand: CommandDefinition = {
  name: 'tp',
  usage: 2,
  args: [
    { name: 'x', type: 'int' },
    { name: 'y', type: 'int' },
    { name: 'z', type: 'int' },
    { name: 'uidInput', type: 'str', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [x, y, z, uidInput] = args

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

    const { currentScene, context } = player
    if (!currentScene) return printError(translate('generic.notInScene'))

    print(translate('cli.commands.tp.info.tp', x, y, z))

    currentScene.join(context, new Vector(x, y, z), new Vector(), SceneEnterTypeEnum.ENTER_GOTO, SceneEnterReasonEnum.TRANS_POINT)
  }
}

export default tpCommand