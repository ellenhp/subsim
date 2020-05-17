package substrate.vessel

import api.Spatial
import java.lang.RuntimeException
import java.time.Duration
import java.time.Instant
import java.time.Instant.now
import java.util.concurrent.ConcurrentHashMap

class PositionBuffer(private val bufferDuration: Duration) {
    private val positions = ConcurrentHashMap<Instant, Spatial.Position>()

    fun addPosition(position: Spatial.Position) {
        positions[now()] = position
        prunePositions()
    }

    fun prunePositions() {
        val cutoffTime = now().minus(bufferDuration)
        positions.keys.filter { it.isBefore(cutoffTime) }.forEach {
            positions.remove(it)
        }
    }

    fun getNearestPositionAt(time: Instant): Spatial.Position {
        val cutoffTime = now().minus(bufferDuration)
        if (time.isBefore(cutoffTime)) {
            throw NoPositionInBufferException(time)
        }
        val copy = positions.toList()
        val closest = copy.minBy { Duration.between(it.first, time).abs().toNanos() } ?: throw NoPositionInBufferException(time)
        return closest.second
    }
}

class NoPositionInBufferException(val instant: Instant) : RuntimeException("No position for time: ${instant.toEpochMilli()}") {}