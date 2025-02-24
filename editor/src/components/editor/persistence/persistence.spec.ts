import { PersistentModel, StoryboardFilePath } from '../store/editor-state'
import { fastForEach, NO_OP } from '../../../core/shared/utils'
import { createPersistentModel, delay } from '../../../utils/utils.test-utils'
import { generateUID } from '../../../core/shared/uid-utils'
import {
  AssetFile,
  isAssetFile,
  ProjectFile,
  TextFile,
} from '../../../core/shared/project-file-types'
import { AssetToSave, SaveProjectResponse, LoadProjectResponse } from '../server'
import { localProjectKey } from '../../../common/persistence'
import { MockUtopiaTsWorkers } from '../../../core/workers/workers'
import {
  addFileToProjectContents,
  AssetFileWithFileName,
  getContentsTreeFileFromString,
} from '../../assets'
import { forceNotNull } from '../../../core/shared/optional-utils'
import { assetFile } from '../../../core/model/project-file-utils'
import { loggedInUser, notLoggedIn } from '../../../common/user'
import { EditorAction, EditorDispatch } from '../action-types'
import { LocalProject } from './generic/persistence-types'
import { PersistenceMachine } from './persistence'
import { PersistenceBackend } from './persistence-backend'

let mockSaveLog: { [key: string]: Array<PersistentModel> } = {}
let mockDownloadedAssetsLog: { [projectId: string]: Array<string> } = {}
let mockUploadedAssetsLog: { [projectId: string]: Array<string> } = {}
let mockProjectsToError: Set<string> = new Set<string>()

let allProjectIds: Array<string> = []
let serverProjects: { [key: string]: PersistentModel } = {}
let localProjects: { [key: string]: LocalProject<PersistentModel> } = {}

const base64Contents = 'data:asset/xyz;base64,SomeBase64'
const AssetFileWithBase64 = assetFile(base64Contents)
const AssetFileWithoutBase64 = assetFile(undefined)

const ProjectName = 'Project Name'
const BaseModel = createPersistentModel()
const FirstRevision = updateModel(BaseModel)
const SecondRevision = updateModel(FirstRevision)
const ThirdRevision = updateModel(SecondRevision)
const FourthRevision = updateModel(ThirdRevision)

function randomProjectID(): string {
  const newId = generateUID(allProjectIds)
  allProjectIds.push(newId)
  return newId
}

function updateModel(model: PersistentModel): PersistentModel {
  const oldFile = forceNotNull(
    'Unexpectedly null.',
    getContentsTreeFileFromString(model.projectContents, StoryboardFilePath),
  )
  const updatedFile = {
    ...oldFile,
    lastRevisedTime: Date.now(),
  }
  return {
    ...model,
    projectContents: addFileToProjectContents(
      model.projectContents,
      StoryboardFilePath,
      updatedFile,
    ),
  }
}

jest.mock('../server', () => ({
  updateSavedProject: async (
    projectId: string,
    persistentModel: PersistentModel | null,
    name: string | null,
  ): Promise<SaveProjectResponse> => {
    if (mockProjectsToError.has(projectId)) {
      return Promise.reject(`Deliberately failing for ${projectId}`)
    }

    if (persistentModel != null) {
      let currentLog = mockSaveLog[projectId] ?? []
      currentLog.push(persistentModel)
      mockSaveLog[projectId] = currentLog
      serverProjects[projectId] = persistentModel
    }

    return Promise.resolve({ id: projectId, ownerId: 'Owner' })
  },
  saveAssets: async (projectId: string, assets: Array<AssetToSave>): Promise<void> => {
    const uploadedAssets = assets.map((a) => a.fileName)
    mockUploadedAssetsLog[projectId] = uploadedAssets
    return Promise.resolve()
  },
  downloadAssetsFromProject: async (
    projectId: string | null,
    allProjectAssets: Array<AssetFileWithFileName>,
  ): Promise<Array<AssetFileWithFileName>> => {
    const downloadedAssets = allProjectAssets
      .filter((a) => a.file.base64 == null)
      .map((a) => a.fileName)
    mockDownloadedAssetsLog[projectId!] = downloadedAssets
    return allProjectAssets.map((assetWithFile) => ({
      ...assetWithFile,
      file: AssetFileWithBase64,
    }))
  },
  createNewProjectID: async (): Promise<string> => {
    return randomProjectID()
  },
  assetToSave: (fileType: string, base64: string, fileName: string): AssetToSave => {
    return {
      fileType: fileType,
      base64: base64,
      fileName: fileName,
    }
  },
  loadProject: async (
    projectId: string,
    _lastSavedTS: string | null = null,
  ): Promise<LoadProjectResponse> => {
    const project = serverProjects[projectId]
    if (project == null) {
      return { type: 'ProjectNotFound' }
    } else {
      return {
        type: 'ProjectLoaded',
        id: projectId,
        ownerId: 'Owner',
        title: 'Project Name',
        createdAt: '',
        modifiedAt: '',
        content: project,
      }
    }
  },
}))

jest.mock('../actions/actions', () => ({
  ...(jest.requireActual('../actions/actions') as any), // This pattern allows us to only mock a single function https://jestjs.io/docs/en/jest-object#jestrequireactualmodulename
  load: async (): Promise<void> => {
    return Promise.resolve()
  },
}))

jest.mock('../../../common/server', () => ({
  checkProjectOwnership: async (projectId: string) => ({
    isOwner: true,
  }),
}))
jest.setTimeout(10000)

jest.mock('localforage', () => ({
  getItem: async (id: string): Promise<LocalProject<PersistentModel> | null> => {
    return Promise.resolve(localProjects[id])
  },
  setItem: async (id: string, project: LocalProject<PersistentModel>) => {
    localProjects[id] = project
  },
  removeItem: async (id: string) => {
    delete localProjects[id]
  },
  keys: async () => {
    return Object.keys(localProjects)
  },
}))

function setupTest(saveThrottle: number = 0) {
  let capturedData = {
    newProjectId: undefined as string | undefined,
    updatedFiles: {} as { [fileName: string]: AssetFile },
    dispatchedActions: [] as Array<EditorAction>,
    projectNotFound: false,
    createdOrLoadedProject: undefined as PersistentModel | undefined,
  }
  const testDispatch: EditorDispatch = (actions: ReadonlyArray<EditorAction>) => {
    capturedData.dispatchedActions.push(...actions)
    fastForEach(actions, (action) => {
      if (action.action === 'SET_PROJECT_ID') {
        capturedData.newProjectId = action.id
      } else if (action.action === 'UPDATE_FILE' && isAssetFile(action.file)) {
        capturedData.updatedFiles[action.filePath] = action.file
      }
    })
  }
  const onProjectNotFound = () => (capturedData.projectNotFound = true)
  const onCreatedOrLoadedProject = (
    _projectId: string,
    _projectName: string,
    createdOrLoadedProject: PersistentModel,
  ) => (capturedData.createdOrLoadedProject = createdOrLoadedProject)

  const testMachine = new PersistenceMachine(
    PersistenceBackend,
    testDispatch,
    onProjectNotFound,
    onCreatedOrLoadedProject,
    saveThrottle,
  )
  return {
    capturedData: capturedData,
    testDispatch: testDispatch,
    testMachine: testMachine,
  }
}

describe('Saving', () => {
  it('Saves locally when logged out', async () => {
    const { capturedData, testMachine } = setupTest()

    testMachine.createNew(ProjectName, BaseModel)
    await delay(20)
    testMachine.save(ProjectName, FirstRevision, 'force')
    await delay(20)
    testMachine.stop()

    expect(capturedData.newProjectId).toBeDefined()
    expect(mockSaveLog[capturedData.newProjectId!]).toBeUndefined()
    expect(localProjects[localProjectKey(capturedData.newProjectId!)]).toBeDefined()
    expect(localProjects[localProjectKey(capturedData.newProjectId!)]!.model).toEqual(FirstRevision)
  })

  it('Saves to server when logged in', async () => {
    const { capturedData, testMachine } = setupTest()

    testMachine.login()
    await delay(20)
    testMachine.createNew(ProjectName, BaseModel)
    await delay(20)
    testMachine.save(ProjectName, FirstRevision, 'force')
    await delay(20)
    testMachine.stop()

    expect(localProjects[localProjectKey(capturedData.newProjectId!)]).toBeUndefined()
    expect(capturedData.newProjectId).toBeDefined()
    expect(mockSaveLog[capturedData.newProjectId!]).toEqual([BaseModel, FirstRevision])
  })

  it('Throttles saves', async () => {
    const { capturedData, testMachine } = setupTest(10000)

    testMachine.login()
    await delay(20)
    testMachine.createNew(ProjectName, BaseModel)
    await delay(20)
    testMachine.save(ProjectName, FirstRevision, 'throttle') // Should be throttled and replaced by the next save
    await delay(20)
    testMachine.save(ProjectName, SecondRevision, 'throttle') // Should be throttled and replaced by the next save
    await delay(20)
    testMachine.save(ProjectName, ThirdRevision, 'throttle')
    await delay(20)
    testMachine.sendThrottledSave()
    await delay(20)
    testMachine.save(ProjectName, FourthRevision, 'throttle') // Should be throttled and won't save before the end of the test
    await delay(20)
    testMachine.stop()

    expect(localProjects[localProjectKey(capturedData.newProjectId!)]).toBeUndefined()
    expect(capturedData.newProjectId).toBeDefined()
    expect(mockSaveLog[capturedData.newProjectId!]).toEqual([BaseModel, ThirdRevision])
  })

  it('Does not throttle forced saves', async () => {
    const { capturedData, testMachine } = setupTest(10000)

    testMachine.login()
    await delay(20)
    testMachine.createNew(ProjectName, BaseModel)
    await delay(20)
    testMachine.save(ProjectName, FirstRevision, 'force')
    await delay(20)
    testMachine.save(ProjectName, SecondRevision, 'force')
    await delay(20)
    testMachine.save(ProjectName, ThirdRevision, 'force')
    await delay(20)
    testMachine.save(ProjectName, FourthRevision, 'force')
    await delay(20)
    testMachine.stop()

    expect(localProjects[localProjectKey(capturedData.newProjectId!)]).toBeUndefined()
    expect(capturedData.newProjectId).toBeDefined()
    expect(mockSaveLog[capturedData.newProjectId!]).toEqual([
      BaseModel,
      FirstRevision,
      SecondRevision,
      ThirdRevision,
      FourthRevision,
    ])
  })
})

describe('Login state', () => {
  it('Logging in mid-session will switch to server saving and delete the local save', async () => {
    const { capturedData, testMachine } = setupTest()

    testMachine.createNew(ProjectName, BaseModel)
    await delay(20)

    // Check it was saved locally only
    expect(capturedData.newProjectId).toBeDefined()
    expect(mockSaveLog[capturedData.newProjectId!]).toBeUndefined()
    expect(localProjects[localProjectKey(capturedData.newProjectId!)]).toBeDefined()
    expect(localProjects[localProjectKey(capturedData.newProjectId!)]!.model).toEqual(BaseModel)

    testMachine.login()
    await delay(20)

    // Check that logging in uploaded it and deleted the local version
    expect(mockSaveLog[capturedData.newProjectId!]).toEqual([BaseModel])
    expect(localProjects[localProjectKey(capturedData.newProjectId!)]).toBeUndefined()

    testMachine.save(ProjectName, FirstRevision, 'force')
    await delay(20)
    testMachine.stop()

    // Check that future saves go to the server
    expect(mockSaveLog[capturedData.newProjectId!]).toEqual([BaseModel, FirstRevision])
    expect(localProjects[localProjectKey(capturedData.newProjectId!)]).toBeUndefined()
  })

  it('Logging out mid-session will switch to local saving', async () => {
    const { capturedData, testMachine } = setupTest()

    testMachine.login()
    await delay(20)
    testMachine.createNew(ProjectName, BaseModel)
    await delay(20)

    // Check it was saved to the server
    expect(localProjects[localProjectKey(capturedData.newProjectId!)]).toBeUndefined()
    expect(capturedData.newProjectId).toBeDefined()
    expect(mockSaveLog[capturedData.newProjectId!]).toEqual([BaseModel])

    testMachine.logout()
    await delay(20)

    testMachine.save(ProjectName, FirstRevision, 'force')
    await delay(20)
    testMachine.stop()

    // Check it was saved locally
    expect(localProjects[localProjectKey(capturedData.newProjectId!)]).toBeDefined()
    expect(localProjects[localProjectKey(capturedData.newProjectId!)]!.model).toEqual(FirstRevision)
    expect(mockSaveLog[capturedData.newProjectId!]).toEqual([BaseModel]) // Should be no new saves
  })
})

describe('Loading a project', () => {
  function addServerProject(id: string, model: PersistentModel) {
    serverProjects[id] = model
  }

  function addLocalProject(id: string, model: PersistentModel) {
    const now = new Date().toISOString()
    localProjects[localProjectKey(id)] = {
      model: model,
      createdAt: now,
      lastModified: now,
      thumbnail: '',
      name: ProjectName,
    }
  }

  it('Loads a server project', async () => {
    const { capturedData, testMachine } = setupTest()

    const projectId = randomProjectID()
    addServerProject(projectId, BaseModel)

    testMachine.load(projectId)
    await delay(20)

    expect(capturedData.projectNotFound).toBeFalsy()
    expect(capturedData.createdOrLoadedProject).toEqual(BaseModel)
  })

  it('Loads a local project', async () => {
    const { capturedData, testMachine } = setupTest()

    const projectId = randomProjectID()
    addLocalProject(projectId, BaseModel)

    testMachine.load(projectId)
    await delay(20)

    expect(capturedData.projectNotFound).toBeFalsy()
    expect(capturedData.createdOrLoadedProject).toEqual(BaseModel)
  })

  it('Favours a local project over a server project', async () => {
    const { capturedData, testMachine } = setupTest()
    const serverProject = BaseModel
    const localProject = updateModel(BaseModel)

    const projectId = randomProjectID()
    addServerProject(projectId, serverProject)
    addLocalProject(projectId, localProject)

    testMachine.load(projectId)
    await delay(20)

    expect(capturedData.projectNotFound).toBeFalsy()
    expect(capturedData.createdOrLoadedProject).toEqual(localProject)
  })
})

describe('Forking a project', () => {
  const AssetFileName = 'asset.xyz'
  const startProject: PersistentModel = {
    ...BaseModel,
    projectContents: addFileToProjectContents(
      BaseModel.projectContents,
      AssetFileName,
      AssetFileWithoutBase64,
    ),
  }
  const startProjectIncludingBase64: PersistentModel = {
    ...BaseModel,
    projectContents: addFileToProjectContents(
      BaseModel.projectContents,
      AssetFileName,
      AssetFileWithBase64,
    ),
  }

  it('Downloads the base 64 for assets and uploads them against the new project id if the user is signed in', async () => {
    const { capturedData, testMachine } = setupTest()

    // Create the initial project
    testMachine.login()
    await delay(20)
    testMachine.createNew(ProjectName, startProject)
    await delay(20)

    expect(capturedData.newProjectId).toBeDefined()
    const startProjectId = capturedData.newProjectId!

    testMachine.fork()
    await delay(20)
    testMachine.stop()

    const forkedProjectId = capturedData.newProjectId!
    expect(forkedProjectId).not.toEqual(startProjectId)
    expect(mockDownloadedAssetsLog[startProjectId]).toEqual([AssetFileName])
    expect(mockUploadedAssetsLog[forkedProjectId]).toEqual([AssetFileName])
    expect(mockSaveLog[forkedProjectId]).toEqual([startProject])
    expect(capturedData.updatedFiles[AssetFileName]).toEqual(AssetFileWithoutBase64)
    expect(
      capturedData.dispatchedActions.some(
        (action) => action.action === 'SET_FORKED_FROM_PROJECT_ID' && action.id === startProjectId,
      ),
    ).toBeTruthy()
  })

  it('Downloads the base 64 for assets and stores them in the project if the user is not signed in', async () => {
    const { capturedData, testMachine } = setupTest()

    // Create the initial project
    testMachine.login()
    await delay(20)
    testMachine.createNew(ProjectName, startProject)
    await delay(20)

    expect(capturedData.newProjectId).toBeDefined()
    const startProjectId = capturedData.newProjectId!

    testMachine.logout()
    await delay(20)
    testMachine.fork()
    await delay(20)
    testMachine.stop()

    const forkedProjectId = capturedData.newProjectId!
    expect(forkedProjectId).not.toEqual(startProjectId)
    expect(mockDownloadedAssetsLog[startProjectId]).toEqual([AssetFileName])
    expect(mockUploadedAssetsLog[forkedProjectId]).toBeUndefined()
    expect(mockSaveLog[forkedProjectId]).toBeUndefined()
    expect(localProjects[localProjectKey(forkedProjectId)]).toBeDefined()
    expect(localProjects[localProjectKey(forkedProjectId)]!.model).toEqual({
      ...startProject,
      projectContents: addFileToProjectContents(
        startProject.projectContents,
        AssetFileName,
        assetFile(base64Contents),
      ),
    })
    expect(capturedData.updatedFiles[AssetFileName]).toEqual(AssetFileWithBase64)
    expect(
      capturedData.dispatchedActions.some(
        (action) => action.action === 'SET_FORKED_FROM_PROJECT_ID' && action.id === startProjectId,
      ),
    ).toBeTruthy()
  })

  it('Does not download or upload anything if the original project constains the base 64 and the user is not signed in', async () => {
    const { capturedData, testMachine } = setupTest()

    // Create the initial project
    await delay(20)
    testMachine.createNew(ProjectName, startProjectIncludingBase64)
    await delay(20)

    expect(capturedData.newProjectId).toBeDefined()
    const startProjectId = capturedData.newProjectId!

    await delay(20)
    testMachine.fork()
    await delay(20)
    testMachine.stop()

    const forkedProjectId = capturedData.newProjectId!
    expect(forkedProjectId).not.toEqual(startProjectId)
    expect(mockDownloadedAssetsLog[startProjectId]).toEqual([])
    expect(mockUploadedAssetsLog[forkedProjectId]).toBeUndefined()
    expect(mockSaveLog[forkedProjectId]).toBeUndefined()
    expect(localProjects[localProjectKey(forkedProjectId)]).toBeDefined()
    expect(localProjects[localProjectKey(capturedData.newProjectId!)]!.model).toEqual(
      startProjectIncludingBase64,
    )
    expect(capturedData.updatedFiles[AssetFileName]).toEqual(AssetFileWithBase64)
    expect(
      capturedData.dispatchedActions.some(
        (action) => action.action === 'SET_FORKED_FROM_PROJECT_ID' && action.id === startProjectId,
      ),
    ).toBeTruthy()
  })
})
