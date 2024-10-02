import Monster from '$/entity/monster'
import Gadget from '$/entity/gadget'
import translate from '@/translate'
import { CommandDefinition } from '..'

const spawnCommand: CommandDefinition = {
    name: 'spawn',
    usage: 2,
    args: [
        { name: 'mode', type: 'str', values: ['monster', 'gadget'] },
        { name: 'id', type: 'int', optional: false },
        { name: 'lv', type: 'int', optional: true },
        { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
        const { args, sender, cli, kcpServer } = cmdInfo
        const { print, printError } = cli
        const [mode, id, lv = 1, uid] = args

        const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)
        if (!player) return printError(translate('generic.playerNotFound'))
        const { currentScene, pos } = player
        if (!currentScene || !pos) return printError(translate('generic.playerNoPos'))

        let entity: Monster | Gadget;
        try {
            switch (mode) {
                case 'monster':
                    print(translate('cli.commands.spawn.info.monster', id, lv))
                    entity = new Monster(id, player)
                    break
                case 'gadget':
                    print(translate('cli.commands.spawn.info.gadget', id, lv))
                    entity = new Gadget(id)
                    break
                default:
                    print(translate('cli.commands.help.error.invalidCategory', mode))
                    break
            }

            if (entity) {
                entity.motion.pos.copy(pos);
                entity.bornPos.copy(pos);

                await entity.initNew(lv);
                await currentScene.entityManager.add(entity);
            }
        } catch (err) {
            printError((<Error>err).message || err)
        }
    }
}

export default spawnCommand