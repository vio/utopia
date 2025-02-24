import * as React from 'react'
import { Global, css } from '@emotion/react'
import { useEditorState } from '../editor/store/store-hook'
import { betterReactMemo } from '../../uuiui-deps'

const SampleCode = [
  {
    indent: 0,
    code: "import * as React from 'react'",
  },
  {
    indent: 0,
    code: "import { Scene, Storyboard } from 'utopia-api''",
  },
  {
    indent: 0,
    code: "import { App } from '/src/app.js'",
  },
  {
    indent: 0,
    code: 'export var storyboard = (',
  },
  {
    indent: 1,
    code: '<Storyboard>',
  },
  {
    indent: 2,
    code: '<Scene>',
  },
  {
    indent: 3,
    code: "style={{ position: 'absolute', left: 0, top: 0, width: 375, height: 812 }}",
  },
  {
    indent: 2,
    code: '>',
  },
  {
    indent: 3,
    code: '<App />',
  },
  {
    indent: 2,
    code: '</Scene',
  },
  {
    indent: 1,
    code: '</Storyboard>',
  },
  {
    indent: 0,
    code: ')',
  },
]

const Chevron = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
    fill='currentColor'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z'
    />
  </svg>
)

const JSIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width={19} height={19}>
    <path
      fill='#F1DD3F'
      d='M11.4 10h2.7v7.6c0 3.4-1.6 4.6-4.3 4.6-.6 0-1.5-.1-2-.3l.3-2.2c.4.2.9.3 1.4.3 1.1 0 1.9-.5 1.9-2.4V10zm5.1 9.2c.7.4 1.9.8 3 .8 1.3 0 1.9-.5 1.9-1.3s-.6-1.2-2-1.7c-2-.7-3.3-1.8-3.3-3.6 0-2.1 1.7-3.6 4.6-3.6 1.4 0 2.4.3 3.1.6l-.6 2.2c-.5-.2-1.3-.6-2.5-.6s-1.8.5-1.8 1.2c0 .8.7 1.1 2.2 1.7 2.1.8 3.1 1.9 3.1 3.6 0 2-1.6 3.7-4.9 3.7-1.4 0-2.7-.4-3.4-.7l.6-2.3z'
    />
  </svg>
)

export const VSCodeLoadingScreen = betterReactMemo(
  'VSCodeLoadingScreen',
  (): React.ReactElement | null => {
    const vscodeLoadingScreenVisible = useEditorState(
      (store) => store.editor.vscodeLoadingScreenVisible,
      'VSCodeIframeContainer',
    )
    if (!vscodeLoadingScreenVisible) {
      return null
    }
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          fontSize: 13,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: '-apple-system, system-ui, sans-serif',
        }}
      >
        <Global
          styles={css`
            @keyframes placeholderShimmer {
              0% {
                background-position: -468px 0;
              }
              100% {
                background-position: 468px 0;
              }
            }

            .shimmer {
              color: transparent;
              animation-name: placeholderShimmer;
              animation-duration: 1.25s;
              animation-fill-mode: forwards;
              animation-iteration-count: infinite;
              animation-timing-function: linear;
              background: #f6f6f6;
              background: linear-gradient(to right, #f6f6f6 8%, #f0f0f0 18%, #f6f6f6 33%);
              background-size: 800px 104px;
              position: relative;
            }
          `}
        />
        {/* tab row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            height: 35,
            background: '#f3f3f3',
          }}
        >
          {/* single tab */}
          <div
            style={{
              background: '#FAFAFA',
              color: 'rgb(51,51,51)',
              borderRight: '1px solid rgb(243, 243, 243)',
              height: 35,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 12,
              paddingRight: 12,
              width: 140,
            }}
          >
            <div style={{ color: '#b7b73b', display: 'flex' }}>
              <JSIcon />
            </div>
            <span style={{}}>storyboard.js</span>
          </div>
        </div>
        {/* breadcrumbs */}
        <div
          className='monaco-breadcrumbs'
          style={{
            paddingLeft: 15,
            height: 22,
            display: 'flex',
            alignItems: 'center',
            color: '#888',
          }}
        >
          <div
            className='folder monaco-breadcrumb-item'
            role='listitem'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              className='monaco-icon-label'
              style={{
                height: 22,
                lineHeight: '22px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div className='monaco-icon-label-container' title='~/utopia'>
                <span className='monaco-icon-name-container'>
                  <a style={{ color: 'rgba(97, 97, 97, 0.8)' }} className='label-name'>
                    utopia
                  </a>
                </span>
                <span className='monaco-icon-description-container'></span>
              </div>
            </div>
            <div style={{ height: 16 }}>
              <Chevron />
            </div>
          </div>
          <div
            className='file monaco-breadcrumb-item'
            role='listitem'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              className='monaco-icon-label file-icon storyboard.js-name-file-icon js-ext-file-icon ext-file-icon javascript-lang-file-icon'
              style={{
                paddingRight: 6,
                height: 22,
                lineHeight: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ color: '#b7b73b', display: 'flex', paddingRight: 4 }}>
                <JSIcon />
              </div>
              <div className='monaco-icon-label-container' title='~/utopia/storyboard.js'>
                <span className='monaco-icon-name-container'>
                  <a style={{ color: 'rgba(97, 97, 97, 0.8)' }} className='label-name'>
                    storyboard.js
                  </a>
                </span>
                <span className='monaco-icon-description-container'></span>
              </div>
              <div style={{ height: 16 }}>
                <Chevron />
              </div>
            </div>
          </div>
        </div>
        {/* code */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '66px 500px',
            gridTemplateRows: 'repeat(12, 18px)',
            alignItems: 'center',
            fontSize: 12,
            color: '#6d705b',
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          }}
        >
          {SampleCode.map((line, rowNumber) => (
            <React.Fragment key={rowNumber}>
              <span
                style={{
                  textAlign: 'right',
                  paddingRight: 27,
                }}
              >
                {rowNumber}
              </span>
              <div>
                <span
                  className='shimmer'
                  style={{
                    marginLeft: line.indent * 14,
                    wordWrap: 'normal',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {line.code}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  },
)
