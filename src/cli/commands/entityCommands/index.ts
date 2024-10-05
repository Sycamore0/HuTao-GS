import { CommandDefinition } from '..'
import abilityCommand from './abilityCommand'
import killallCommand from './killallCommand'
import spawnCommand from './spawnCommand'
import vehicleCommand from './vehicleCommand'

const entityCommands: CommandDefinition[] = [
  spawnCommand, // monster gadget,2 in 1
  vehicleCommand,
  killallCommand,
  abilityCommand
]

export default entityCommands
