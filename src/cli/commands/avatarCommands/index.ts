import { CommandDefinition } from '..'
import equipCommand from './equipCommand'
import godCommand from './godCommand'
import guidCommand from './guidCommand'
import healCommand from './healCommand'
import rechargeCommand from './rechargeCommand'
import setcsCommand from './setcsCommand'
import talentCommand from './talentCommand'
import fpCommand from './fpCommand'
import setfpCommand from './setfpCommand'
import getfpCommand from './getfpCommand'
import listfpCommand from './listfpCommand'

const avatarCommands: CommandDefinition[] = [
  godCommand,
  healCommand,
  rechargeCommand,
  guidCommand,
  equipCommand,
  fpCommand, // setfp getfp listfp,3 in 1
  setfpCommand,
  getfpCommand,
  listfpCommand,
  setcsCommand,
  talentCommand
]

export default avatarCommands