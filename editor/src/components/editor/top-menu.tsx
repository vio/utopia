import * as React from 'react'
import { MenuIcons, SimpleFlexRow, SquareButton, Tooltip } from '../../uuiui'
import { RightMenuTile } from '../canvas/right-menu'
import { useEditorState } from './store/store-hook'
import * as EditorActions from '../editor/actions/action-creators'
import { betterReactMemo } from '../../uuiui-deps'
import * as TP from '../../core/shared/template-path'
import { FormulaBar } from '../canvas/controls/formula-bar'
import { ComponentOrInstanceIndicator } from './ComponentButton/componentButton'

export const TopMenu = betterReactMemo('TopMenu', () => {
  const dispatch = useEditorState((store) => store.dispatch, 'TopMenu dispatch')
  const navigatorPosition = useEditorState(
    (store) => store.editor.navigator.position,
    'TopMenu navigatorPosition',
  )

  const onClickNavigateTab = React.useCallback(() => {
    dispatch([EditorActions.togglePanel('navigatorPane')])
  }, [dispatch])

  const selectedViews = useEditorState(
    (store) => store.editor.selectedViews,
    'TopMenu selectedViews',
  )
  const formulaBarKey = selectedViews.map(TP.toString).join(',')

  return (
    <SimpleFlexRow style={{ flexGrow: 1, gap: 12, paddingLeft: 8, paddingRight: 8 }}>
      <Tooltip title={'Toggle outline'} placement={'bottom'}>
        <SquareButton
          spotlight={false}
          highlight={true}
          // selected={navigatorPosition !== 'hidden'}
          // highlightSelected={false}
          onClick={onClickNavigateTab}
        >
          <MenuIcons.Navigator />
        </SquareButton>
      </Tooltip>
      <ComponentOrInstanceIndicator />
      <FormulaBar key={formulaBarKey} />
    </SimpleFlexRow>
  )
})
