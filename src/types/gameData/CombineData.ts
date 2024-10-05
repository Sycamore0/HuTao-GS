export interface CombineData {
  CombineId: number
  IsDefaultShow?: boolean
  CombineType: number
  ResultItemId: number
  ResultItemCount: number
  MaterialItems: {
    Id: number
    Count: number
  }[]

  PlayerLevel?: number
  ScoinCost?: number
  SubCombineType?: number
  RandomItems?: {
    Count?: number
  }[]
  RecipeType?: string
}

type CombineDataList = CombineData[]

export default CombineDataList