import { HttpResponse } from 'fts-core'
import chainFromJSON, { ChainType } from '../chain-from-json'
import { Jimp, UnionToIntersection, GetPluginVal } from '@jimp/core'
import pluginFn from '@jimp/plugins'

const Jimp: Jimp = require('jimp')

type Plugins = GetPluginVal<ReturnType<typeof pluginFn>>
type PluginIntersection = keyof UnionToIntersection<Plugins>
type AllowedJimpMethods = PluginIntersection | 'quality'
type ChainArrayType = ChainType<AllowedJimpMethods>[]

type ImageType = 'jpeg' | 'png' | 'bmp' | 'tiff' | 'gif'

const jimpFromJSON = (image, chain: ChainArrayType) =>
  chainFromJSON<AllowedJimpMethods, Jimp>(image, chain)

// TODO type check op params, not just names
// TODO support buffer inputs
export default async (
  url: string,
  ops: ChainArrayType,
  type?: ImageType
): Promise<HttpResponse> => {
  const image = await jimpFromJSON(await Jimp.read(url), ops)
  const mime = type ? `image/${type}` : image.getMIME()
  const body = await image.getBufferAsync(mime)

  return {
    headers: { 'Content-Type': mime },
    statusCode: 200,
    body
  }
}
