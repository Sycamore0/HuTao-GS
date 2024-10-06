export interface RecipeData {
    Id: number // RecipeId
    FoodType: string
    CookMethod: string
    IsDefaultUnlocked: boolean
    MaxProficiency: number
    QualityOutputVec: {
        id?: number
        count?: number
    }[]
    InputVec: {
        id?: number
        count?: number
    }[]

    RankLevel?: number
    Icon?: string
    NameTextMapHash?: number
    DescTextMapHash?: number
    EffectDesc?: number[]
    QteParam?: string
    QteQualityWeightVec?: number[]
}

export interface BonusData {
    RecipeId: number
    AvatarId: number
    BonusType: string
    ParamVec: number[]
    ComplexParamVec: number[]
}

export default interface CookDataGroup {
    Recipe: RecipeData[]
    Bonus: BonusData[]
}