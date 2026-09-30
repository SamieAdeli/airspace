// import './style.css'
// import { startCamera } from './camera.js'
// import { startHandTracking } from './handTracking.js'
// import { detectGesture } from './gestures.js'
// import { createOrbInteraction } from './orbInteraction.js'

// document.querySelector('#app').innerHTML = `
//   <main class="airspace">

//     <header class="topbar">
//       <div class="brand">
//         <div class="brand-mark"></div>
//         <span>AIRSPACE</span>
//       </div>

//       <div class="camera-status" id="cameraStatus">
//         <span class="status-dot"></span>
//         <span id="cameraStatusText">CAMERA OFF</span>
//       </div>
//     </header>

//     <section class="experience">

//       <div class="intro">
//         <p class="eyebrow">INTERACTIVE HCI EXPERIENCE</p>

//         <h1>
//           Move beyond<br />
//           the screen.
//         </h1>

//         <p class="intro-text">
//           Control the interface with your hands.
//           No mouse. No touch.
//         </p>

//         <button class="camera-button" id="startCamera">
//           <span class="button-dot"></span>
//           Enable camera
//         </button>

//         <p class="camera-message" id="cameraMessage">
//           Camera access is only used for this experience.
//         </p>
//       </div>

//       <div class="interaction-stage">

//         <div class="ambient ambient-one"></div>
//         <div class="ambient ambient-two"></div>

//         <div class="camera-preview" id="cameraPreview">
//           <video id="webcam" autoplay playsinline muted></video>

//           <div class="camera-overlay">
//             <span>LIVE</span>
//           </div>
//         </div>

//         <div class="orb-holder" id="orbHolder">

//           <div class="orb">

//             <div class="reveal-art" id="revealArt">
//               <div class="art-glow"></div>

//               <div class="art-content">
//                 <span class="art-label">REVEALED</span>

//                 <div class="art-symbol">✦</div>

//                 <span class="art-caption">
//                   You discovered it.
//                 </span>
//               </div>
//             </div>

//             <div class="orb-inner"></div>
//             <div class="orb-ring ring-one"></div>
//             <div class="orb-ring ring-two"></div>

//           </div>

//         </div>

//         <div class="interaction-cursor" id="handCursor"></div>

//         <div class="gesture-hint">
//           <div class="hand-icon">☝</div>

//           <div>
//             <span class="hint-label">NEXT</span>
//             <p id="handStatus">Show your hand to begin</p>
//           </div>
//         </div>

//       </div>

//       <div class="bottom-ui">

//         <div class="gesture-preview">

//           <div class="gesture-item active">
//             <span class="gesture-symbol">☝</span>
//             <span>POINT</span>
//           </div>

//           <div class="gesture-item">
//             <span class="gesture-symbol">🤏</span>
//             <span>PINCH</span>
//           </div>

//           <div class="gesture-item">
//             <span class="gesture-symbol">✌</span>
//             <span>REVEAL</span>
//           </div>

//           <div class="gesture-item">
//             <span class="gesture-symbol">✋</span>
//             <span>PAUSE</span>
//           </div>

//         </div>

//         <div class="stage-progress">
//           <span>01</span>

//           <div class="progress-line">
//             <div class="progress-fill"></div>
//           </div>

//           <span>04</span>
//         </div>

//       </div>

//     </section>

//   </main>
// `

// const startCameraButton =
//   document.querySelector('#startCamera')

// const webcam =
//   document.querySelector('#webcam')

// const cameraPreview =
//   document.querySelector('#cameraPreview')

// const cameraStatusText =
//   document.querySelector('#cameraStatusText')

// const cameraMessage =
//   document.querySelector('#cameraMessage')

// const handCursor =
//   document.querySelector('#handCursor')

// const handStatus =
//   document.querySelector('#handStatus')

// const revealArt =
//   document.querySelector('#revealArt')

// const interactionStage =
//   document.querySelector('.interaction-stage')

// const orbHolder =
//   document.querySelector('#orbHolder')

// const orbInteraction =
//   createOrbInteraction({
//     stage: interactionStage,
//     orbHolder
//   })

// const gestureItems =
//   document.querySelectorAll('.gesture-item')


// startCameraButton.addEventListener(
//   'click',
//   async () => {

//     startCameraButton.disabled = true
//     startCameraButton.innerHTML = 'Connecting...'

//     try {

//       await startCamera(webcam)

//       cameraPreview.classList.add('active')

//       cameraStatusText.textContent =
//         'CAMERA ON'

//       startCameraButton.innerHTML =
//         'Camera enabled'

//       cameraMessage.textContent =
//         'Your camera is ready for hand tracking.'

//       cameraMessage.classList.add(
//         'success'
//       )


//       await startHandTracking({

//         video: webcam,

//         cursor: handCursor,

//         statusText: handStatus,

//         onHandData: (landmarks) => {

//           const gesture =
//             detectGesture(landmarks)


//           gestureItems.forEach(item => {
//             item.classList.remove('active')
//           })


//           const activeItem =
//             document.querySelector(
//               `.gesture-item:nth-child(${
//                 gesture === 'point' ? 1 :
//                 gesture === 'pinch' ? 2 :
//                 gesture === 'reveal' ? 3 :
//                 gesture === 'open' ? 4 :
//                 1
//               })`
//             )


//           if (activeItem) {
//             activeItem.classList.add('active')
//           }


//           if (!landmarks) {

//             handStatus.textContent =
//               'SHOW YOUR HAND'

//             orbInteraction.reset()

//             return
//           }


//           const indexFinger =
//             landmarks[8]


//           const stageRect =
//             interactionStage.getBoundingClientRect()


//           const x =
//             (1 - indexFinger.x) *
//             stageRect.width

//           const y =
//             indexFinger.y *
//             stageRect.height


//           if (gesture === 'pinch') {

//             const grabbed =
//               orbInteraction.update({
//                 gesture,
//                 x,
//                 y
//               })

//             handStatus.textContent =
//               grabbed
//                 ? 'GRABBING ORB'
//                 : 'MOVE TO THE ORB'

//             handCursor.classList.add(
//               'pinching'
//             )

//             return
//           }


//           orbInteraction.update({
//             gesture,
//             x,
//             y
//           })

//           handCursor.classList.remove(
//             'pinching'
//           )


//           if (gesture === 'reveal') {

//             revealArt.classList.add(
//               'active'
//             )

//             handStatus.textContent =
//               'REVEAL GESTURE'

//             return
//           }


//           if (gesture === 'point') {

//             handStatus.textContent =
//               'POINT'

//             return
//           }


//           if (gesture === 'open') {

//             handStatus.textContent =
//               'OPEN HAND'

//             return
//           }


//           handStatus.textContent =
//             'SHOW YOUR HAND'
//         }
//       })

//     } catch (error) {

//       console.error(error)

//       startCameraButton.disabled =
//         false

//       startCameraButton.innerHTML =
//         'Try again'

//       cameraStatusText.textContent =
//         'CAMERA ERROR'

//       cameraMessage.textContent =
//         'Camera access was blocked or is unavailable.'
//     }
//   }
// )

import {
    FilesetResolver,
    HandLandmarker
} from '@mediapipe/tasks-vision'

let handLandmarker = null
let animationFrameId = null

async function createHandLandmarker() {
    const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm'
    )

    try {
        return await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath:
                    'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                delegate: 'GPU'
            },
            runningMode: 'VIDEO',
            numHands: 2,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5
        })
    } catch (error) {
        console.warn(
            'GPU initialization failed. Falling back to CPU.',
            error
        )

        return await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath:
                    'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                delegate: 'CPU'
            },
            runningMode: 'VIDEO',
            numHands: 2,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5
        })
    }
}

export async function startHandTracking({
    video,
    cursor,
    statusText,
    onHandData
}) {
    if (!handLandmarker) {
        handLandmarker = await createHandLandmarker()
    }

    const detect = () => {
        if (video.readyState < 2) {
            animationFrameId = requestAnimationFrame(detect)
            return
        }

        const results = handLandmarker.detectForVideo(
            video,
            performance.now()
        )

        if (results.landmarks?.length > 0) {
            const firstHand = results.landmarks[0]
            const indexFinger = firstHand[8]

            const x = (1 - indexFinger.x) * 100
            const y = indexFinger.y * 100

            cursor.style.left = `${x}%`
            cursor.style.top = `${y}%`

            cursor.classList.add('visible')

            statusText.textContent =
                results.landmarks.length === 1
                    ? '1 HAND DETECTED'
                    : `${results.landmarks.length} HANDS DETECTED`

            if (onHandData) {
                onHandData(firstHand)
            }
        } else {
            cursor.classList.remove('visible')
            statusText.textContent = 'SEARCHING FOR HAND'

            if (onHandData) {
                onHandData(null)
            }
        }

        animationFrameId = requestAnimationFrame(detect)
    }

    detect()
}

export function stopHandTracking() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }
}