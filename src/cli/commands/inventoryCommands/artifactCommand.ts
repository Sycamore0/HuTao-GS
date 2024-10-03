import Reliquary from '$/equip/reliquary'
import translate from '@/translate'
import { CommandDefinition } from '..'

const artifactCommand: CommandDefinition = {
  name: 'artifact',
  usage: 3,
  args: [
    { name: 'id', type: 'int' },
    { name: 'count', type: 'int', optional: true },
    { name: 'uidInput', type: 'str', optional: true }
  ],
  allowPlayer: true,
  exec: async (cmdInfo) => {
    const { args, sender, cli, kcpServer } = cmdInfo
    const { print, printError } = cli
    const [id, count = 1, uidInput] = args

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

    print(translate('cli.commands.artifact.info.give', id, count))

    for (let i = 0; i < count; i++) {
      const reliquary = new Reliquary(id, player)
      await reliquary.initNew()
      if (!await player.inventory.add(reliquary)) return printError(translate('generic.inventoryFull'))
    }
  }
}

export default artifactCommand