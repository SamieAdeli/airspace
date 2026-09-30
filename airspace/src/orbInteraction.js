export function createOrbInteraction({ stage, orbHolder }) {
    let grabbed = false
    let grabOffset = { x: 0, y: 0 }

    function update({ gesture, x, y }) {
        const stageRect = stage.getBoundingClientRect()

        if (gesture === 'pinch') {
            if (!grabbed) {
                const orbRect = orbHolder.getBoundingClientRect()

                const orbCenterX =
                    orbRect.left - stageRect.left + orbRect.width / 2

                const orbCenterY =
                    orbRect.top - stageRect.top + orbRect.height / 2

                const distanceFromOrb = Math.hypot(
                    x - orbCenterX,
                    y - orbCenterY
                )

                if (distanceFromOrb < orbRect.width * 0.65) {
                    grabbed = true

                    grabOffset = {
                        x: x - orbCenterX,
                        y: y - orbCenterY
                    }

                    orbHolder.classList.add('grabbed')
                }
            }

            if (grabbed) {
                const stageCenterX = stageRect.width / 2
                const stageCenterY = stageRect.height / 2

                let moveX =
                    x - stageCenterX - grabOffset.x

                let moveY =
                    y - stageCenterY - grabOffset.y

                const maxX = Math.min(stageRect.width * 0.3, 220)
                const maxY = Math.min(stageRect.height * 0.25, 170)

                moveX = Math.max(-maxX, Math.min(maxX, moveX))
                moveY = Math.max(-maxY, Math.min(maxY, moveY))

                orbHolder.style.transform =
                    `translate(${moveX}px, ${moveY}px)`
            }

            return grabbed
        }

        if (grabbed) {
            grabbed = false

            orbHolder.classList.remove('grabbed')

            orbHolder.style.transform =
                'translate(0, 0)'
        }

        return false
    }

    function reset() {
        grabbed = false

        orbHolder.classList.remove('grabbed')

        orbHolder.style.transform =
            'translate(0, 0)'
    }

    return {
        update,
        reset
    }
}