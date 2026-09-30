export async function startCamera(videoElement) {
    if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API is not supported in this browser.')
    }

    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
        },
        audio: false
    })

    videoElement.srcObject = stream

    await videoElement.play()

    return stream
}