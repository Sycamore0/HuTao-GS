import Loader from '$/gameData/loader'
import CookDataGroup, { RecipeData, BonusData } from '@/types/gameData/CookData'

class CookDataLoader extends Loader {
  declare data: CookDataGroup

  constructor() {
    super('CookData', [])
  }

  async getData(): Promise<CookDataGroup> {
    return super.getData()
  }

  async getRecipe(id: number): Promise<RecipeData> {
    return (await this.getRecipeList()).find(data => data.Id === id)
  }

  async getRecipeBonus(recipeId: number): Promise<BonusData[]> {
    return (await this.getBonusList()).filter(data => data.RecipeId === recipeId) || []
  }

  async getRecipeList(): Promise<RecipeData[]> {
    return (await this.getData())?.Recipe || []
  }

  async getBonusList(): Promise<BonusData[]> {
    return (await this.getData())?.Bonus || []
  }
}

let loader: CookDataLoader
export default (() => loader = loader || new CookDataLoader())()