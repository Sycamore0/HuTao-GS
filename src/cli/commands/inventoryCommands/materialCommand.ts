import Material from '$/material'
import translate from '@/translate'
import { CommandDefinition } from '..'

const materialCommand: CommandDefinition = {
  name: 'material',
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
    if (uidInput === '@s' || uidInput === undefined) {
      uid = sender?.uid;
    } else if (!isNaN(parseInt(uidInput))) {
      uid = parseInt(uidInput);
    } else {
      return printError(translate('generic.invalidTarget'));
    }

    const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)

    if (!player) return printError(translate('generic.playerNotFound'))

    const material = await Material.create(player, id, count)
    print(translate('cli.commands.material.info.give', id, material.count))

    if (!await player.inventory.add(material)) printError(translate('generic.inventoryFull'))
  }
}

export default materialCommand