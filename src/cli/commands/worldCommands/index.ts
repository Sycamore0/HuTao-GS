import { CommandDefinition } from '..'
import coopCommand from './coopCommand'
import dungeonCommand from './dungeonCommand'
import posCommand from './posCommand'
import sceneCommand from './sceneCommand'
import tpCommand from './tpCommand'

const worldCommands: CommandDefinition[] = [
  posCommand,
  sceneCommand,
  tpCommand,
  coopCommand,
  dungeonCommand
]

export default worldCommands