import { GOOGLE_WEB_FONTS_KEY } from '../../../common/env-vars'
import { Either, left, right, traverseEither } from '../../../core/shared/either'
import { DescriptionParseError, descriptionParseError } from '../../../utils/value-parser-utils'
import { string } from 'prop-types'
import { stringOf } from 'fast-check/*'
import { NodeData } from 'react-vtree/dist/es/Tree'
import {
  PushNewFontFamilyVariant,
  RemoveFontFamilyVariant,
} from './google-fonts-resources-list-search'

export const GoogleWebFontsURL = `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_WEB_FONTS_KEY}`

export type FontVariantWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
export function isFontVariantWeight(value: number): value is FontVariantWeight {
  return weightAxisPrettyNames.hasOwnProperty(value)
}
const weightAxisPrettyNames: { [key in FontVariantWeight]: string } = {
  100: 'Thin',
  200: 'Extra-light',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'Semi-bold',
  700: 'Bold',
  800: 'Extra-bold',
  900: 'Black',
}

export interface FontFamilyVariant {
  type: 'font-family-variant'
  fontFamily: string
  fontVariant: FontVariant
}

export function fontFamilyVariant(fontFamily: string, variant: FontVariant): FontFamilyVariant {
  return {
    type: 'font-family-variant',
    fontFamily,
    fontVariant: variant,
  }
}

export interface FontVariant {
  type: 'font-variant'
  weight: FontVariantWeight
  italic: boolean
}

export function fontVariant(weight: FontVariantWeight, italic: boolean): FontVariant {
  return {
    type: 'font-variant',
    weight,
    italic,
  }
}

export type GoogleFontVariantIdentifier =
  | '100'
  | '200'
  | '300'
  | 'regular'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '100italic'
  | '200italic'
  | '300italic'
  | 'italic'
  | '500italic'
  | '600italic'
  | '700italic'
  | '800italic'
  | '900italic'

const fontVariantMap: { [key in GoogleFontVariantIdentifier]: FontVariant } = {
  '100': fontVariant(100, false),
  '200': fontVariant(200, false),
  '300': fontVariant(300, false),
  regular: fontVariant(400, false),
  '500': fontVariant(500, false),
  '600': fontVariant(600, false),
  '700': fontVariant(700, false),
  '800': fontVariant(800, false),
  '900': fontVariant(900, false),
  '100italic': fontVariant(100, true),
  '200italic': fontVariant(200, true),
  '300italic': fontVariant(300, true),
  italic: fontVariant(400, true),
  '500italic': fontVariant(500, true),
  '600italic': fontVariant(600, true),
  '700italic': fontVariant(700, true),
  '800italic': fontVariant(800, true),
  '900italic': fontVariant(900, true),
}

function googleVariantToFontVariant(
  googleVariant: string,
): Either<DescriptionParseError, FontVariant> {
  if (fontVariantMap.hasOwnProperty(googleVariant)) {
    return right(fontVariantMap[googleVariant as GoogleFontVariantIdentifier])
  } else {
    return left(
      descriptionParseError('Only numeric font-weight keyword values are currently supported.'),
    )
  }
}

export function parseAndSortVariants(
  variants: Array<string>,
): Either<DescriptionParseError, Array<FontVariant>> {
  const sorted = [...variants].sort()
  return traverseEither(googleVariantToFontVariant, sorted)
}

export function prettyNameForFontVariant(value: FontVariant): string {
  const prettyWeightName = weightAxisPrettyNames[value.weight]
  const italicKeyword = value.italic ? ' italic' : ''
  return prettyWeightName + italicKeyword
}

export interface GoogleFontFamilyOption {
  label: string
  variants: Array<FontFamilyVariant>
}

export function googleFontFamilyOption(
  label: string,
  variants: Array<FontFamilyVariant>,
): GoogleFontFamilyOption {
  return {
    label,
    variants,
  }
}

export interface FontsRoot extends NodeData {
  type: 'root'
  children: Array<FontFamilyData>
}

export interface FontFamilyData extends NodeData {
  type: 'font-family'
  fontFamily: string
  children: Array<FontVariantData>
}

export function fontFamilyData(
  fontFamily: string,
  children: Array<FontVariantData>,
): FontFamilyData {
  return {
    type: 'font-family',
    id: fontFamily,
    fontFamily,
    children,
    isOpenByDefault: false,
  }
}

export interface FontVariantData extends NodeData {
  type: 'font-variant'
  variant: FontFamilyVariant
  isDownloaded: boolean
  pushNewFontFamilyVariant: PushNewFontFamilyVariant
  removeFontFamilyVariant: RemoveFontFamilyVariant
}
export function fontVariantData(
  variant: FontFamilyVariant,
  isDownloaded: boolean,
  pushNewFontFamilyVariant: PushNewFontFamilyVariant,
  removeFontFamilyVariant: RemoveFontFamilyVariant,
): FontVariantData {
  return {
    type: 'font-variant',
    id: fontVariantID(variant),
    variant,
    isOpenByDefault: false,
    isDownloaded,
    pushNewFontFamilyVariant,
    removeFontFamilyVariant,
  }
}

export function fontVariantID(variant: FontFamilyVariant): string {
  return `${variant.fontFamily}_${prettyNameForFontVariant(variant.fontVariant)}`
}

export type FontNode = FontsRoot | FontFamilyData | FontVariantData
