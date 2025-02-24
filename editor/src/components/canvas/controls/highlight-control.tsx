import * as React from 'react'
import { CanvasRectangle, CanvasPoint } from '../../../core/shared/math-utils'
import { useColorTheme } from '../../../uuiui'
import { betterReactMemo } from '../../../uuiui-deps'
import { isZeroSizedElement, ZeroControlSize } from './outline-utils'
import { ZeroSizeHighlightControl } from './zero-sized-element-controls'

interface HighlightControlProps {
  frame: CanvasRectangle
  canvasOffset: CanvasPoint
  scale: number
  color?: string
}

export const HighlightControl = betterReactMemo(
  'HighlightControl',
  (props: HighlightControlProps) => {
    const colorTheme = useColorTheme()
    const outlineWidth = 1.5 / props.scale
    const outlineColor =
      props.color === null ? colorTheme.canvasSelectionPrimaryOutline.value : props.color

    if (isZeroSizedElement(props.frame)) {
      return (
        <ZeroSizeHighlightControl
          frame={props.frame}
          canvasOffset={props.canvasOffset}
          scale={props.scale}
          color={outlineColor}
        />
      )
    } else {
      return (
        <div
          className='role-component-highlight-outline'
          style={{
            position: 'absolute',
            left: props.canvasOffset.x + props.frame.x,
            top: props.canvasOffset.y + props.frame.y,
            width: props.frame.width,
            height: props.frame.height,
            boxShadow: `0px 0px 0px ${outlineWidth}px ${outlineColor}`,
            pointerEvents: 'none',
          }}
        />
      )
    }
  },
)
