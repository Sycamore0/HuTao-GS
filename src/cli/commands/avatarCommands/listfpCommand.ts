import translate from '@/translate'
import { FightPropEnum } from '@/types/enum'
import { CommandDefinition } from '..'

const listfpCommand: CommandDefinition = {
    name: 'listfp',
    args: [
        { name: 'uid', type: 'int', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
        const { args, sender, cli, kcpServer } = cmdInfo
        const { print, printError } = cli
        const [uid] = args
        const player = kcpServer.game.getPlayerByUid(uid || sender?.uid)

        if (!player) return printError(translate('generic.playerNotFound'))

        const { currentAvatar } = player
        if (!currentAvatar) return printError(translate('generic.playerNoCurAvatar'))

        let propsList = 'Fight Prop List\n'
        for (const [propName, propValue] of Object.entries(FightPropEnum)) {
            if (typeof propValue === 'number' && isNaN(Number(propName)) && propName !== 'FIGHT_PROP_NONE') {
                try {
                    const currentValue = await currentAvatar.getProp(propValue);
                    propsList += translate('cli.commaand.listfp.info.list', propName, propValue, currentValue)
                } catch (error) {
                    propsList += translate('cli.commaand.listfp.error.failedGet', propName, propValue, error)
                }
            }
        }

        print(propsList)
    }
}

export default listfpCommand