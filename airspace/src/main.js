import './style.css'
import { startCamera } from './camera.js'
import { startHandTracking } from './handTracking.js'
import { detectGesture } from './gestures.js'
import { createOrbInteraction } from './orbInteraction.js'
import { createAirDrawing } from './drawing.js'

document.querySelector('#app').innerHTML = `
  <main class="airspace">

    <header class="topbar">
      <div class="brand">
        <div class="brand-mark"></div>
        <span>AIRSPACE</span>
      </div>

      <div class="camera-status" id="cameraStatus">
        <span class="status-dot"></span>
        <span id="cameraStatusText">CAMERA OFF</span>
      </div>
    </header>

    <section class="experience">

      <div class="intro">
        <p class="eyebrow">INTERACTIVE HCI EXPERIENCE</p>

        <h1>
          Move beyond<br />
          the screen.
        </h1>

        <p class="intro-text">
          Control the interface with your hands.
          No mouse. No touch.
        </p>

        <button class="camera-button" id="startCamera">
          <span class="button-dot"></span>
          Enable camera
        </button>

        <p class="camera-message" id="cameraMessage">
          Camera access is only used for this experience.
        </p>
      </div>

      <div class="interaction-stage">

        <div class="ambient ambient-one"></div>
        <div class="ambient ambient-two"></div>

        <div class="camera-preview" id="cameraPreview">
          <video id="webcam" autoplay playsinline muted></video>

          <div class="camera-overlay">
            <span>LIVE</span>
          </div>
        </div>
        <canvas
  id="drawingCanvas"
  class="drawing-canvas">
</canvas>

        <div class="orb-holder" id="orbHolder">

          <div class="orb">

            <div class="reveal-art" id="revealArt">
              <div class="art-glow"></div>

              <div class="art-content">
                <span class="art-label">REVEALED</span>

                <div class="art-symbol">✦</div>

                <span class="art-caption">
                  You discovered it.
                </span>
              </div>
            </div>

            <div class="orb-inner"></div>
            <div class="orb-ring ring-one"></div>
            <div class="orb-ring ring-two"></div>

          </div>

        </div>

        <div class="interaction-cursor" id="handCursor"></div>

        <div class="gesture-hint">
          <div class="hand-icon">☝</div>

          <div>
            <span class="hint-label">INTERACTION</span>
            <p id="handStatus">Show your hand to begin</p>
          </div>
        </div>

      </div>

      <div class="bottom-ui">

        <div class="gesture-preview">

          <div class="gesture-item active">
            <span class="gesture-symbol">☝</span>
            <span>POINT</span>
          </div>

          <div class="gesture-item">
            <span class="gesture-symbol">🤏</span>
            <span>PINCH</span>
          </div>

          <div class="gesture-item">
            <span class="gesture-symbol">✌</span>
            <span>REVEAL</span>
          </div>

          <div class="gesture-item">
            <span class="gesture-symbol">✋</span>
            <span>PAUSE</span>
          </div>
          <div class="gesture-item">
  <span class="gesture-symbol">✊</span>
  <span>ERASE</span>
</div>

        </div>

        <div class="stage-progress">
          <span>01</span>

          <div class="progress-line">
            <div class="progress-fill"></div>
          </div>

          <span>04</span>
        </div>

      </div>

    </section>

  </main>
`

const startCameraButton =
  document.querySelector('#startCamera')

const webcam =
  document.querySelector('#webcam')

const cameraPreview =
  document.querySelector('#cameraPreview')

const cameraStatusText =
  document.querySelector('#cameraStatusText')

const cameraMessage =
  document.querySelector('#cameraMessage')

const handCursor =
  document.querySelector('#handCursor')

const handStatus =
  document.querySelector('#handStatus')

const revealArt =
  document.querySelector('#revealArt')

const interactionStage =
  document.querySelector('.interaction-stage')
const drawingCanvas =
  document.querySelector('#drawingCanvas')

const airDrawing =
  createAirDrawing(drawingCanvas)

airDrawing.start()

const orbHolder =
  document.querySelector('#orbHolder')

const orbInteraction =
  createOrbInteraction({
    stage: interactionStage,
    orbHolder
  })

const gestureItems =
  document.querySelectorAll('.gesture-item')


function updateGestureUI(gesture) {
  gestureItems.forEach(item => {
    item.classList.remove('active')
  })

  const gestureIndex = {
    point: 1,
    pinch: 2,
    reveal: 3,
    open: 4,
    erase: 5
  }

  const index = gestureIndex[gesture]

  if (index) {
    const activeItem =
      document.querySelector(
        `.gesture-item:nth-child(${index})`
      )

    if (activeItem) {
      activeItem.classList.add('active')
    }
  }
}


startCameraButton.addEventListener(
  'click',
  async () => {

    startCameraButton.disabled = true
    startCameraButton.innerHTML = 'Connecting...'

    try {

      await startCamera(webcam)

      cameraPreview.classList.add('active')

      cameraStatusText.textContent =
        'CAMERA ON'

      startCameraButton.innerHTML =
        'Camera enabled'

      cameraMessage.textContent =
        'Your camera is ready for hand tracking.'

      cameraMessage.classList.add('success')


      await startHandTracking({

        video: webcam,

        cursor: handCursor,

        statusText: handStatus,

        onHandData: (landmarks) => {

          const gesture =
            detectGesture(landmarks)

          updateGestureUI(gesture)


          if (!landmarks) {

            handStatus.textContent =
              'SHOW YOUR HAND'

            handCursor.classList.remove(
              'pinching'
            )

            orbHolder.classList.remove(
              'pinch-ready'
            )

            orbInteraction.reset()

            return
          }


          const indexFinger =
            landmarks[8]

          const stageRect =
            interactionStage.getBoundingClientRect()


          const x =
            (1 - indexFinger.x) *
            stageRect.width

          const y =
            indexFinger.y *
            stageRect.height

          if (gesture === 'point') {
            airDrawing.draw(x, y)
            handStatus.textContent =
              'AIR DRAWING — MOVE YOUR FINGER'
          } else {
            airDrawing.stop()
          }


          // 🤏 PINCH
          if (gesture === 'pinch') {
            handCursor.classList.remove('erasing')

            const grabbed =
              orbInteraction.update({
                gesture,
                x,
                y
              })

            handCursor.classList.add(
              'pinching'
            )

            orbHolder.classList.add(
              'pinch-ready'
            )

            handStatus.textContent =
              grabbed
                ? 'THE ORB IS IN YOUR HAND — MOVE IT'
                : 'PINCH DETECTED — MOVE TO THE ORB'

            return
          }


          // Release pinch
          orbInteraction.update({
            gesture,
            x,
            y
          })

          handCursor.classList.remove(
            'pinching'
          )

          orbHolder.classList.remove(
            'pinch-ready'
          )


          // ✌️ REVEAL
          if (gesture === 'reveal') {
            handCursor.classList.remove('erasing')

            airDrawing.stop()

            revealArt.classList.add(
              'active'
            )

            handStatus.textContent =
              'REVEAL GESTURE'

            return
          }

          if (gesture === 'erase') {

            airDrawing.erase(x, y)

            handCursor.classList.add('erasing')

            handStatus.textContent =
              'ERASER — MOVE YOUR HAND'

            return
          }

          // ☝️ POINT
          if (gesture === 'point') {
            handCursor.classList.remove('erasing')

            const orbRect =
              orbHolder.getBoundingClientRect()

            const stageRect =
              interactionStage.getBoundingClientRect()

            const localX =
              x + stageRect.left

            const localY =
              y + stageRect.top

            const orbCenterX =
              orbRect.left + orbRect.width / 2

            const orbCenterY =
              orbRect.top + orbRect.height / 2

            const distanceFromOrb =
              Math.hypot(
                localX - orbCenterX,
                localY - orbCenterY
              )

            const orbRadius =
              orbRect.width / 2

            if (distanceFromOrb < orbRadius) {

              airDrawing.stop()

              handStatus.textContent =
                'ORB AREA — DRAW OUTSIDE'

              return
            }

            airDrawing.draw(x, y)

            handStatus.textContent =
              'AIR DRAWING — MOVE YOUR FINGER'

            return
          }


          // ✋ OPEN HAND
          if (gesture === 'open') {
            handCursor.classList.remove('erasing')

            handStatus.textContent =
              'OPEN HAND'

            return
          }


          handStatus.textContent =
            'SHOW YOUR HAND'
        }
      })

    } catch (error) {

      console.error(error)

      startCameraButton.disabled =
        false

      startCameraButton.innerHTML =
        'Try again'

      cameraStatusText.textContent =
        'CAMERA ERROR'

      cameraMessage.textContent =
        'Camera access was blocked or is unavailable.'
    }
  }
)