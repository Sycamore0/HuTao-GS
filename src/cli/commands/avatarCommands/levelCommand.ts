import translate from '@/translate'
import { CommandDefinition } from '..'

const levelCommand: CommandDefinition = {
    name: 'level',
    usage: 2,
    args: [
        { name: 'lv', type: 'num' },
        { name: 'uidInput', type: 'str', optional: true }
    ],
    allowPlayer: true,
    exec: async (cmdInfo) => {
        const { args, sender, cli, kcpServer } = cmdInfo
        const { print, printError } = cli
        const [lv, uidInput] = args

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

        const targetLv = parseInt(lv)
        if (targetLv >= 1 && targetLv <= 90) {
            currentAvatar.level = targetLv
            print(translate('cli.commands.level.info.level', currentAvatar.avatarId, currentAvatar.level))
        } else {
            printError(translate('cli.commands.level.error.invalidLv', currentAvatar.level))
        }
    }
}

export default levelCommand