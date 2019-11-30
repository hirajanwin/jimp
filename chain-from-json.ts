type ChainArrayType<FnType = any> = [FnType, ...any[]]

export interface ChainObjectType<FnType = any> {
  fn?: FnType
  params: any
}

export type ChainType<FnType, ObjectType = ChainArrayType<FnType>> =
  | ObjectType
  | FnType

function chainFromJSON<FnType = string, ChainReturnType = any>(
  entryFn,
  chain: ChainType<FnType>[]
): ChainReturnType {
  return chain.reduce((chained, chainItem) => {
    if (typeof chainItem === 'string') {
      return chained[chainItem]()
    } else {
      let fn
      let paramsArr

      if (Array.isArray(chainItem)) {
        fn = chainItem[0]
        paramsArr = chainItem.slice(1, chainItem.length)
      } else {
        fn = chainItem
        paramsArr = []
      }

      return chained[fn](...paramsArr)
    }
  }, entryFn)
}

export default chainFromJSON
