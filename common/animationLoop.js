/**
  *
  * @function animationLoop
  * Creating requestAnimationFrame and get progress from duration
  * @param {number} duration Duration of an loop
  * @param {function({progress: number, runtime: number, remaining: number, runned: number, timestamp: number, requestID: number}):void} callback
  * @param {function(number):void} done
  * @return {number}
  *
*/
function animationLoop(duration, callback, done) {
    let starttime
    let requestID
    function animation(timestamp) {
        const runtime = timestamp - starttime
        const progress = Math.min(runtime / duration, 1)

        const remaining = Math.max(duration - runtime, 0)
        const runned = Math.min(runtime, duration)


        let finish = callback.call(this, { progress, runtime, remaining, runned, timestamp, requestID })

        if (runtime < duration && finish !== false)
            requestID = requestAnimationFrame((timestamp) => animation(timestamp))
        else done && done.call(this, requestID)

    }
    requestID = requestAnimationFrame((timestamp) => {
        starttime = timestamp
        animation(timestamp)
    })

    return requestID
}

module.exports = animationLoop
