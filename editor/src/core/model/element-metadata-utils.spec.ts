import * as TP from '../shared/template-path'
import {
  canvasRectangle,
  localRectangle,
  zeroRectangle,
  LocalRectangle,
  CanvasRectangle,
} from '../shared/math-utils'
import { left, right } from '../shared/either'
import { MetadataUtils } from './element-metadata-utils'
import {
  ElementInstanceMetadata,
  emptySpecialSizeMeasurements,
  JSXElementName,
  jsxElementName,
  jsxTestElement,
  jsxTextBlock,
  jsxElement,
  jsxAttributeValue,
  elementInstanceMetadata,
  emptyComputedStyle,
  ElementInstanceMetadataMap,
  jsxAttributesFromMap,
  emptyAttributeMetadatada,
} from '../shared/element-template'
import { sampleImportsForTests } from './test-ui-js-file.test-utils'
import { BakedInStoryboardUID } from './scene-utils'
import { InstancePath, ScenePath, TemplatePath } from '../shared/project-file-types'
import {
  TestScenePath as TestScenePathForTestProject,
  TestStaticScenePath as TestStaticScenePathForTestProject,
} from '../../components/canvas/ui-jsx.test-utils'
import { createIndexedUid } from '../shared/uid-utils'
import { emptyComments } from '../workers/parser-printer/parser-printer-comments'
import { testStaticInstancePath } from '../shared/template-path.test-utils'

const TestScenePath = 'scene-aaa'

const testComponentMetadataChild1: ElementInstanceMetadata = {
  globalFrame: canvasRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  localFrame: localRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  templatePath: TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), [
    'View',
    'View0',
  ]),
  props: {},
  element: right(jsxTestElement('View', [], [])),
  children: [],
  rootElements: [],
  componentInstance: false,
  isEmotionOrStyledComponent: false,
  specialSizeMeasurements: emptySpecialSizeMeasurements,
  computedStyle: emptyComputedStyle,
  attributeMetadatada: emptyAttributeMetadatada,
  label: null,
}
const testComponentMetadataChild2: ElementInstanceMetadata = {
  globalFrame: canvasRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  localFrame: localRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  templatePath: TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), [
    'View',
    'View1',
  ]),
  props: {},
  element: right(jsxTestElement('View', [], [])),
  children: [],
  rootElements: [],
  componentInstance: false,
  isEmotionOrStyledComponent: false,
  specialSizeMeasurements: emptySpecialSizeMeasurements,
  computedStyle: emptyComputedStyle,
  attributeMetadatada: emptyAttributeMetadatada,
  label: null,
}

const testComponentMetadataGrandchild: ElementInstanceMetadata = {
  globalFrame: canvasRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  localFrame: localRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  templatePath: TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), [
    'View',
    'View2',
    'View0',
  ]),
  props: {
    cica: 'hello',
  },
  element: right(jsxTestElement('View', [], [])),
  children: [],
  rootElements: [],
  componentInstance: false,
  isEmotionOrStyledComponent: false,
  specialSizeMeasurements: emptySpecialSizeMeasurements,
  computedStyle: emptyComputedStyle,
  attributeMetadatada: emptyAttributeMetadatada,
  label: null,
}

const testComponentMetadataChild3: ElementInstanceMetadata = {
  globalFrame: canvasRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  localFrame: localRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  templatePath: TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), [
    'View',
    'View2',
  ]),
  props: {},
  element: right(jsxTestElement('View', [], [])),
  children: [testComponentMetadataGrandchild.templatePath],
  rootElements: [],
  componentInstance: false,
  isEmotionOrStyledComponent: false,
  specialSizeMeasurements: emptySpecialSizeMeasurements,
  computedStyle: emptyComputedStyle,
  attributeMetadatada: emptyAttributeMetadatada,
  label: null,
}

const testComponentRoot1: ElementInstanceMetadata = {
  globalFrame: canvasRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  localFrame: localRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  templatePath: TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), ['View']),
  props: {},
  element: right(jsxTestElement('View', [], [])),
  children: [
    testComponentMetadataChild1.templatePath,
    testComponentMetadataChild2.templatePath,
    testComponentMetadataChild3.templatePath,
  ],
  rootElements: [],
  componentInstance: false,
  isEmotionOrStyledComponent: false,
  specialSizeMeasurements: emptySpecialSizeMeasurements,
  computedStyle: emptyComputedStyle,
  attributeMetadatada: emptyAttributeMetadatada,
  label: null,
}

const testComponentSceneChildElementRootChild: ElementInstanceMetadata = {
  globalFrame: canvasRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  localFrame: localRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  templatePath: TP.instancePath(
    TP.scenePath([[BakedInStoryboardUID, TestScenePath, 'Scene-Child']]),
    ['Scene-Child-Root', 'Child'],
  ),
  props: {},
  element: right(jsxTestElement('View', [], [])),
  children: [],
  rootElements: [],
  componentInstance: false,
  isEmotionOrStyledComponent: false,
  specialSizeMeasurements: emptySpecialSizeMeasurements,
  computedStyle: emptyComputedStyle,
  attributeMetadatada: emptyAttributeMetadatada,
  label: null,
}

const testComponentSceneChildElementRoot: ElementInstanceMetadata = {
  globalFrame: canvasRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  localFrame: localRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  templatePath: TP.instancePath(
    TP.scenePath([[BakedInStoryboardUID, TestScenePath, 'Scene-Child']]),
    ['Scene-Child-Root'],
  ),
  props: {},
  element: right(jsxTestElement('View', [], [])),
  children: [testComponentSceneChildElementRootChild.templatePath],
  rootElements: [],
  componentInstance: false,
  isEmotionOrStyledComponent: false,
  specialSizeMeasurements: emptySpecialSizeMeasurements,
  computedStyle: emptyComputedStyle,
  attributeMetadatada: emptyAttributeMetadatada,
  label: null,
}

const testComponentSceneChildElement: ElementInstanceMetadata = {
  globalFrame: canvasRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  localFrame: localRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  templatePath: TP.instancePath(TP.emptyScenePath, [
    BakedInStoryboardUID,
    TestScenePath,
    'Scene-Child',
  ]),
  props: {},
  element: right(jsxTestElement('View', [], [])),
  children: [],
  rootElements: [testComponentSceneChildElementRoot.templatePath],
  componentInstance: false,
  isEmotionOrStyledComponent: false,
  specialSizeMeasurements: emptySpecialSizeMeasurements,
  computedStyle: emptyComputedStyle,
  attributeMetadatada: emptyAttributeMetadatada,
  label: null,
}

const testComponentSceneElement: ElementInstanceMetadata = {
  globalFrame: canvasRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  localFrame: localRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  templatePath: TP.instancePath(TP.emptyScenePath, [BakedInStoryboardUID, TestScenePath]),
  props: {
    style: {
      width: 100,
      height: 100,
    },
  },
  element: left('Scene'),
  children: [testComponentSceneChildElement.templatePath],
  rootElements: [testComponentRoot1.templatePath],
  componentInstance: false,
  isEmotionOrStyledComponent: false,
  specialSizeMeasurements: emptySpecialSizeMeasurements,
  computedStyle: emptyComputedStyle,
  attributeMetadatada: emptyAttributeMetadatada,
  label: null,
}

const testStoryboardGrandChildElement: ElementInstanceMetadata = {
  globalFrame: canvasRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  localFrame: localRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  templatePath: TP.instancePath(TP.emptyScenePath, [BakedInStoryboardUID, 'Child', 'GrandChild']),
  props: {},
  element: right(jsxTestElement('View', [], [])),
  children: [],
  rootElements: [],
  componentInstance: false,
  isEmotionOrStyledComponent: false,
  specialSizeMeasurements: emptySpecialSizeMeasurements,
  computedStyle: emptyComputedStyle,
  attributeMetadatada: emptyAttributeMetadatada,
  label: null,
}

const testStoryboardChildElement: ElementInstanceMetadata = {
  globalFrame: canvasRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  localFrame: localRectangle({ x: 0, y: 0, width: 100, height: 100 }),
  templatePath: TP.instancePath(TP.emptyScenePath, [BakedInStoryboardUID, 'Child']),
  props: {},
  element: right(jsxTestElement('View', [], [])),
  children: [testStoryboardGrandChildElement.templatePath],
  rootElements: [],
  componentInstance: false,
  isEmotionOrStyledComponent: false,
  specialSizeMeasurements: emptySpecialSizeMeasurements,
  computedStyle: emptyComputedStyle,
  attributeMetadatada: emptyAttributeMetadatada,
  label: null,
}

const testStoryboardElement: ElementInstanceMetadata = {
  globalFrame: canvasRectangle({ x: 0, y: 0, width: 0, height: 0 }),
  localFrame: localRectangle({ x: 0, y: 0, width: 0, height: 0 }),
  templatePath: TP.instancePath(TP.emptyScenePath, [BakedInStoryboardUID]),
  props: {},
  element: right(jsxTestElement('Storyboard', [], [])),
  children: [testComponentSceneElement.templatePath, testStoryboardChildElement.templatePath],
  rootElements: [],
  componentInstance: true,
  isEmotionOrStyledComponent: false,
  specialSizeMeasurements: emptySpecialSizeMeasurements,
  computedStyle: emptyComputedStyle,
  attributeMetadatada: emptyAttributeMetadatada,
  label: null,
}

const testElementMetadataMap: ElementInstanceMetadataMap = {
  [TP.toString(testComponentMetadataChild1.templatePath)]: testComponentMetadataChild1,
  [TP.toString(testComponentMetadataChild2.templatePath)]: testComponentMetadataChild2,
  [TP.toString(testComponentMetadataChild3.templatePath)]: testComponentMetadataChild3,
  [TP.toString(testComponentMetadataGrandchild.templatePath)]: testComponentMetadataGrandchild,
  [TP.toString(testComponentRoot1.templatePath)]: testComponentRoot1,
  [TP.toString(
    testComponentSceneChildElementRootChild.templatePath,
  )]: testComponentSceneChildElementRootChild,
  [TP.toString(
    testComponentSceneChildElementRoot.templatePath,
  )]: testComponentSceneChildElementRoot,
  [TP.toString(testComponentSceneChildElement.templatePath)]: testComponentSceneChildElement,
  [TP.toString(testComponentSceneElement.templatePath)]: testComponentSceneElement,
  [TP.toString(testStoryboardGrandChildElement.templatePath)]: testStoryboardGrandChildElement,
  [TP.toString(testStoryboardChildElement.templatePath)]: testStoryboardChildElement,
  [TP.toString(testStoryboardElement.templatePath)]: testStoryboardElement,
}

const testJsxMetadata = testElementMetadataMap

describe('findElements', () => {
  it('Finds the element metadata', () => {
    const foundViewsWithHelloProp = MetadataUtils.findElements(
      testElementMetadataMap,
      (element) => {
        return element.props['cica'] != null
      },
    )

    expect(foundViewsWithHelloProp).toHaveLength(1)
    expect(foundViewsWithHelloProp[0].props.cica).toEqual('hello')

    const notFoundViews = MetadataUtils.findElements(
      testElementMetadataMap,
      (element) => element.props.nonexistentProp != null,
    )
    expect(notFoundViews).toHaveLength(0)
  })
})

describe('getElementByInstancePathMaybe', () => {
  it('works with an empty object', () => {
    const actualResult = MetadataUtils.getElementByInstancePathMaybe(
      {},
      TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), ['View', 'View0']),
    )
    expect(actualResult).toBeNull()
  })
  it('returns null for a nonsense path', () => {
    const actualResult = MetadataUtils.getElementByInstancePathMaybe(
      {},
      TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), ['Hats', 'Cats']),
    )
    expect(actualResult).toBeNull()
  })
  it('returns null for a partially nonsense path', () => {
    const actualResult = MetadataUtils.getElementByInstancePathMaybe(
      {},
      TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), ['View', 'Cats']),
    )
    expect(actualResult).toBeNull()
  })
  it('returns the element from the map', () => {
    const actualResult = MetadataUtils.getElementByInstancePathMaybe(
      testElementMetadataMap,
      TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), ['View']),
    )
    expect(actualResult).toBe(testComponentRoot1)
  })
  it('returns the element for a child of the root', () => {
    const actualResult = MetadataUtils.getElementByInstancePathMaybe(
      testElementMetadataMap,
      TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), ['View', 'View1']),
    )
    expect(actualResult).toBe(testComponentMetadataChild2)
  })
})

describe('targetElementSupportsChildren', () => {
  const dummyInstanceDataForElementType = (
    elementName: JSXElementName | string,
  ): ElementInstanceMetadata => {
    return {
      globalFrame: canvasRectangle({ x: 0, y: 0, width: 100, height: 100 }),
      localFrame: localRectangle({ x: 0, y: 0, width: 100, height: 100 }),
      templatePath: TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), [
        'Dummy',
        'Element',
      ]),
      props: {},
      element: right(jsxTestElement(elementName, [], [])),
      children: [],
      rootElements: [],
      componentInstance: false,
      isEmotionOrStyledComponent: false,
      specialSizeMeasurements: emptySpecialSizeMeasurements,
      computedStyle: emptyComputedStyle,
      attributeMetadatada: emptyAttributeMetadatada,
      label: null,
    }
  }

  it('Returns true for a utopia-api View', () => {
    const element = dummyInstanceDataForElementType('View')
    const actualResult = MetadataUtils.targetElementSupportsChildren(sampleImportsForTests, element)
    expect(actualResult).toBeTruthy()
  })
  it('Returns true for a button', () => {
    const element = dummyInstanceDataForElementType('button')
    const actualResult = MetadataUtils.targetElementSupportsChildren(sampleImportsForTests, element)
    expect(actualResult).toBeTruthy()
  })
  it('Returns true for a div', () => {
    const element = dummyInstanceDataForElementType('div')
    const actualResult = MetadataUtils.targetElementSupportsChildren(sampleImportsForTests, element)
    expect(actualResult).toBeTruthy()
  })
  it('Returns true for a span', () => {
    const element = dummyInstanceDataForElementType('span')
    const actualResult = MetadataUtils.targetElementSupportsChildren(sampleImportsForTests, element)
    expect(actualResult).toBeTruthy()
  })
  it('Returns true for an animated.div', () => {
    const element = dummyInstanceDataForElementType(jsxElementName('animated', ['div']))
    const actualResult = MetadataUtils.targetElementSupportsChildren(sampleImportsForTests, element)
    expect(actualResult).toBeTruthy()
  })
})

describe('isPinnedAndNotAbsolutePositioned', () => {
  it('returns true for a pinned element that is not absolute positioned', () => {
    const elementMapForTest: ElementInstanceMetadataMap = {
      [TP.toString(testComponentRoot1.templatePath)]: {
        ...testComponentRoot1,
        specialSizeMeasurements: {
          ...testComponentRoot1.specialSizeMeasurements,
          parentLayoutSystem: 'flow',
          position: 'static',
        },
      },
    }
    expect(
      MetadataUtils.isPinnedAndNotAbsolutePositioned(
        elementMapForTest,
        TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), ['View']),
      ),
    ).toEqual(true)
  })
  it('returns false for a flex element that is not absolute positioned', () => {
    const elementMapForTest: ElementInstanceMetadataMap = {
      [TP.toString(testComponentRoot1.templatePath)]: {
        ...testComponentRoot1,
        specialSizeMeasurements: {
          ...testComponentRoot1.specialSizeMeasurements,
          parentLayoutSystem: 'flex',
          position: 'static',
        },
      },
    }
    expect(
      MetadataUtils.isPinnedAndNotAbsolutePositioned(
        elementMapForTest,
        TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), ['View']),
      ),
    ).toEqual(false)
  })
  it('returns false for a pinned element that is absolute positioned', () => {
    const elementMapForTest: ElementInstanceMetadataMap = {
      [TP.toString(testComponentRoot1.templatePath)]: {
        ...testComponentRoot1,
        specialSizeMeasurements: {
          ...testComponentRoot1.specialSizeMeasurements,
          parentLayoutSystem: 'flow',
          position: 'absolute',
        },
      },
    }
    expect(
      MetadataUtils.isPinnedAndNotAbsolutePositioned(
        elementMapForTest,
        TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), ['View']),
      ),
    ).toEqual(false)
  })
  it('returns false for a flex element that is absolute positioned', () => {
    const elementMapForTest: ElementInstanceMetadataMap = {
      [TP.toString(testComponentRoot1.templatePath)]: {
        ...testComponentRoot1,
        specialSizeMeasurements: {
          ...testComponentRoot1.specialSizeMeasurements,
          parentLayoutSystem: 'flex',
          position: 'absolute',
        },
      },
    }
    expect(
      MetadataUtils.isPinnedAndNotAbsolutePositioned(
        elementMapForTest,
        TP.instancePath(TP.scenePath([[BakedInStoryboardUID, TestScenePath]]), ['View']),
      ),
    ).toEqual(false)
  })
})

describe('getElementLabel', () => {
  const scenePath = TP.scenePath([[BakedInStoryboardUID, 'scene-0']])
  const instancePath = TP.instancePath(TP.emptyScenePath, [BakedInStoryboardUID, `scene-0`])
  const divPath = TP.appendToPath(scenePath, 'div-1')
  const spanPath = TP.appendToPath(divPath, 'span-1')
  const textBlock = jsxTextBlock('test text')
  const spanElement = jsxElement(
    'span',
    jsxAttributesFromMap({ 'data-uid': jsxAttributeValue('span-1', emptyComments) }),
    [textBlock],
  )
  const spanElementMetadata = elementInstanceMetadata(
    spanPath,
    right(spanElement),
    {
      'data-uid': 'span-1',
    },
    zeroRectangle as CanvasRectangle,
    zeroRectangle as LocalRectangle,
    [],
    [],
    false,
    false,
    emptySpecialSizeMeasurements,
    emptyComputedStyle,
    emptyAttributeMetadatada,
    null,
  )
  const divElement = jsxElement(
    'div',
    jsxAttributesFromMap({ 'data-uid': jsxAttributeValue('div-1', emptyComments) }),
    [spanElement],
  )
  const divElementMetadata = elementInstanceMetadata(
    divPath,
    right(divElement),
    {
      'data-uid': 'div-1',
    },
    zeroRectangle as CanvasRectangle,
    zeroRectangle as LocalRectangle,
    [spanElementMetadata.templatePath],
    [],
    false,
    false,
    emptySpecialSizeMeasurements,
    emptyComputedStyle,
    emptyAttributeMetadatada,
    null,
  )
  const metadata: ElementInstanceMetadataMap = {
    [TP.toString(spanElementMetadata.templatePath)]: spanElementMetadata,
    [TP.toString(divElementMetadata.templatePath)]: divElementMetadata,
  }
  it('the label of a spin containing text is that text', () => {
    const actualResult = MetadataUtils.getElementLabel(spanPath, metadata)
    expect(actualResult).toEqual('test text')
  })
})

describe('getStoryboardMetadata', () => {
  it('finds the storyboard instance metadata', () => {
    const actualResult = MetadataUtils.getStoryboardMetadata(testJsxMetadata)
    expect(actualResult).toEqual(testStoryboardElement)
  })
})

describe('getting the root paths', () => {
  it('getAllStoryboardChildren returns instance metadata of all children of the storyboard', () => {
    const actualResult = MetadataUtils.getAllStoryboardChildren(testJsxMetadata)
    const expectedResult: Array<ElementInstanceMetadata> = [
      testComponentSceneElement,
      testStoryboardChildElement,
    ]
    expect(actualResult).toEqual(expectedResult)
  })

  it('getAllStoryboardChildrenPaths returns paths of all children of the storyboard', () => {
    const actualResult = MetadataUtils.getAllStoryboardChildrenPaths(testJsxMetadata)
    const expectedResult: Array<InstancePath> = [
      testComponentSceneElement.templatePath,
      testStoryboardChildElement.templatePath,
    ]
    expect(actualResult).toEqual(expectedResult)
  })

  it('getAllStoryboardChildrenPathsScenesOnly returns paths of only the scene children of the storyboard', () => {
    const actualResult = MetadataUtils.getAllStoryboardChildrenPathsScenesOnly(testJsxMetadata)
    const expectedResult: Array<ScenePath> = [
      TP.scenePathForElementAtInstancePath(testComponentSceneElement.templatePath),
    ]
    expect(actualResult).toEqual(expectedResult)
  })

  it('getAllCanvasRootPaths returns paths of the top level children of the storyboard, replacing scenes with their root views', () => {
    const actualResult = MetadataUtils.getAllCanvasRootPaths(testJsxMetadata)
    const expectedResult: Array<InstancePath> = [
      testComponentRoot1.templatePath,
      testStoryboardChildElement.templatePath,
    ]
    expect(actualResult).toEqual(expectedResult)
  })

  it('getAllPaths returns the instance paths in a depth first manner', () => {
    const actualResult = MetadataUtils.getAllPaths(testJsxMetadata)
    const expectedResult: Array<InstancePath> = [
      testComponentSceneElement.templatePath,
      testComponentRoot1.templatePath,
      testComponentMetadataChild1.templatePath,
      testComponentMetadataChild2.templatePath,
      testComponentMetadataChild3.templatePath,
      testComponentMetadataGrandchild.templatePath,
      testComponentSceneChildElement.templatePath,
      testComponentSceneChildElementRoot.templatePath,
      testComponentSceneChildElementRootChild.templatePath,
      testStoryboardChildElement.templatePath,
      testStoryboardGrandChildElement.templatePath,
    ]
    expect(actualResult).toEqual(expectedResult)
  })
})

describe('createOrderedTemplatePathsFromElements returns all of the ordered navigator targets, visible and not', () => {
  const expectedNavigatorTargets: Array<TemplatePath> = [
    testStoryboardChildElement.templatePath,
    testStoryboardGrandChildElement.templatePath,
    testComponentSceneElement.templatePath,
    testComponentRoot1.templatePath,
    testComponentMetadataChild3.templatePath,
    testComponentMetadataGrandchild.templatePath,
    testComponentMetadataChild2.templatePath,
    testComponentMetadataChild1.templatePath,
    testComponentSceneChildElement.templatePath,
    testComponentSceneChildElementRoot.templatePath,
    testComponentSceneChildElementRootChild.templatePath,
  ]

  it('with no collapsed paths', () => {
    const actualResult = MetadataUtils.createOrderedTemplatePathsFromElements(
      testJsxMetadata,
      [],
      null,
    )

    expect(actualResult.navigatorTargets).toEqual(expectedNavigatorTargets)
    expect(actualResult.visibleNavigatorTargets).toEqual(expectedNavigatorTargets)
  })

  it('with the scene collapsed', () => {
    const actualResult = MetadataUtils.createOrderedTemplatePathsFromElements(
      testJsxMetadata,
      [testComponentSceneElement.templatePath],
      null,
    )

    expect(actualResult.navigatorTargets).toEqual(expectedNavigatorTargets)
    expect(actualResult.visibleNavigatorTargets).toEqual([
      testStoryboardChildElement.templatePath,
      testStoryboardGrandChildElement.templatePath,
      testComponentSceneElement.templatePath,
    ])
  })

  it('with collapsed roots', () => {
    const actualResult = MetadataUtils.createOrderedTemplatePathsFromElements(
      testJsxMetadata,
      [testComponentRoot1.templatePath, testComponentSceneChildElement.templatePath],
      null,
    )

    expect(actualResult.navigatorTargets).toEqual(expectedNavigatorTargets)
    expect(actualResult.visibleNavigatorTargets).toEqual([
      testStoryboardChildElement.templatePath,
      testStoryboardGrandChildElement.templatePath,
      testComponentSceneElement.templatePath,
      testComponentRoot1.templatePath,
      testComponentSceneChildElement.templatePath,
    ])
  })
})

describe('dynamicPathToStaticPath', () => {
  it('converts a dynamic path to static', async () => {
    const staticPath = MetadataUtils.dynamicPathToStaticPath(
      TP.instancePath(TestScenePathForTestProject, ['aaa', createIndexedUid('bbb', 1)]),
    )
    expect(staticPath).toEqual(
      testStaticInstancePath(TestStaticScenePathForTestProject, ['aaa', 'bbb']),
    )
  })

  it('finds an already static path all right', async () => {
    const staticPath = MetadataUtils.dynamicPathToStaticPath(
      TP.instancePath(TestScenePathForTestProject, ['aaa', 'ccc']),
    )
    expect(staticPath).toEqual(
      testStaticInstancePath(TestStaticScenePathForTestProject, ['aaa', 'ccc']),
    )
  })
})
