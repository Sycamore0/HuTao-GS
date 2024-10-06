import translate from '@/translate'
import { CommandDefinition } from '..'

const promoteCommand: CommandDefinition = {
    name: 'promote',
    usage: 2,
    args: [
        { name: 'promotion', type: 'num' },
        { name: 'uidInput', type: 'str', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
        const { args, sender, cli, kcpServer } = cmdInfo
        const { print, printError } = cli
        const [promotion, uidInput] = args

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

        const { currentAvatar } = player
        if (!currentAvatar) return printError(translate('generic.playerNoCurAvatar'))

        const targetPromotion = parseInt(promotion)
        if (targetPromotion >= 0 && targetPromotion <= 6) {
            currentAvatar.promoteLevel = targetPromotion
            print(translate('cli.commands.promote.info.promote', currentAvatar.avatarId, currentAvatar.promoteLevel))
        } else {
            printError(translate('cli.commands.promote.error.invalidPromotion', currentAvatar.promoteLevel))
        }
    }
}

export default promoteCommand