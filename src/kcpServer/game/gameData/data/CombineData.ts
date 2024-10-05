import Loader from '$/gameData/loader'
import CombineDataList, { CombineData } from '@/types/gameData/CombineData'

class CombineDataLoader extends Loader {
  declare data: CombineDataList

  constructor() {
    super('CombineData')
  }

  async getData(): Promise<CombineDataList> {
    return super.getData()
  }

  async getCombineData(combineId: number): Promise<CombineData[]> {
    return (await this.getCombineList()).filter(data => data.CombineId === combineId) || []
  }

  async getCombineList(): Promise<CombineData[]> {
    return (await this.getData())
  }
}

let loader: CombineDataLoader
export default (() => loader = loader || new CombineDataLoader())()