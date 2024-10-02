import { CommandDefinition } from '..'
import abilityCommand from './abilityCommand'
import gadgetCommand from './gadgetCommand'
import killallCommand from './killallCommand'
import monsterCommand from './monsterCommand'
import spawnCommand from './spawnCommand'
import vehicleCommand from './vehicleCommand'

const entityCommands: CommandDefinition[] = [
  spawnCommand, // monster gadget,2 in 1
  monsterCommand,
  gadgetCommand,
  vehicleCommand,
  killallCommand,
  abilityCommand
]

export default entityCommands
