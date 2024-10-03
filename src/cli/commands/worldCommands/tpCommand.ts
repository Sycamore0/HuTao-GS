import Vector from '$/utils/vector'
import translate from '@/translate'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/proto/enum'
import { CommandDefinition } from '..'

const tpCommand: CommandDefinition = {
  name: 'tp',
  usage: 2,
  args: [
    { name: 'x', type: 'str' },
    { name: 'y', type: 'str' },
    { name: 'z', type: 'str' },
    { name: 'uidInput', type: 'str', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [x, y, z, uidInput] = args

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

    const { currentScene, context } = player
    if (!currentScene) return printError(translate('generic.notInScene'))

    const parseCoordinate = (coordinate, currentValue) => {
      if (coordinate === '~') {
        return currentValue;
      }

      // calc the player pos
      const match = coordinate.match(/~(\+|-)?(\d+)/);
      if (match) {
        const offset = parseInt(match[2], 10);
        // check ADD or SUB
        return currentValue + (match[1] === '-' ? -offset : offset);
      }

      return parseInt(coordinate, 10);
    };

    const pos = player.pos;
    if (!pos) return printError(translate('generic.playerNoPos'));

    const parsedX = parseCoordinate(x, pos.x);
    const parsedY = parseCoordinate(y, pos.y);
    const parsedZ = parseCoordinate(z, pos.z);

    print(translate('cli.commands.tp.info.tp', parsedX, parsedY, parsedZ))

    currentScene.join(context, new Vector(parsedX, parsedY, parsedZ), new Vector(), SceneEnterTypeEnum.ENTER_GOTO, SceneEnterReasonEnum.TRANS_POINT)
  }
}

export default tpCommand