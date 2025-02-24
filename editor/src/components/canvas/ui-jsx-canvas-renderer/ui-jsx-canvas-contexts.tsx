import * as React from 'react'
import type { MapLike } from 'typescript'
import { atomWithPubSub } from '../../../core/shared/atom-with-pub-sub'
import { Either, left } from '../../../core/shared/either'
import type { ElementPath } from '../../../core/shared/project-file-types'
import { ProjectContentTreeRoot } from '../../assets'
import type { TransientFilesState, UIFileBase64Blobs } from '../../editor/store/editor-state'

export interface MutableUtopiaCtxRefData {
  [filePath: string]: {
    mutableContext: {
      requireResult: MapLike<any>
      fileBlobs: UIFileBase64Blobs
      rootScope: MapLike<any>
      jsxFactoryFunctionName: string | null
    }
  }
}

export function updateMutableUtopiaCtxRefWithNewProps(
  ref: React.MutableRefObject<MutableUtopiaCtxRefData>,
  newProps: MutableUtopiaCtxRefData,
): void {
  ref.current = newProps
}

interface RerenderUtopiaContextProps {
  hiddenInstances: Array<ElementPath>
  canvasIsLive: boolean
  shouldIncludeCanvasRootInTheSpy: boolean
}

export const RerenderUtopiaCtxAtom = atomWithPubSub<RerenderUtopiaContextProps>({
  key: 'RerenderUtopiaCtxAtom',
  defaultValue: {
    hiddenInstances: [],
    canvasIsLive: false,
    shouldIncludeCanvasRootInTheSpy: false,
  },
})

interface UtopiaProjectCtxProps {
  projectContents: ProjectContentTreeRoot
  openStoryboardFilePathKILLME: string | null
  transientFilesState: TransientFilesState | null
  resolve: (importOrigin: string, toImport: string) => Either<string, string>
}
const EmptyResolve = (importOrigin: string, toImport: string): Either<string, string> => {
  return left(`Error while resolving ${toImport}, the resolver is missing`)
}

export const UtopiaProjectCtxAtom = atomWithPubSub<UtopiaProjectCtxProps>({
  key: 'UtopiaProjectCtxAtom',
  defaultValue: {
    projectContents: {},
    openStoryboardFilePathKILLME: null,
    transientFilesState: null,
    resolve: EmptyResolve,
  },
})

interface SceneLevelContextProps {
  validPaths: Array<ElementPath>
}

export const SceneLevelUtopiaCtxAtom = atomWithPubSub<SceneLevelContextProps>({
  key: 'SceneLevelUtopiaCtxAtom',
  defaultValue: {
    validPaths: [],
  },
})
