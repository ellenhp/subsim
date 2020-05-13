package substrate.utils

import api.Spatial
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin

class Utils {
    companion object {
        fun calculateBearingRadians(pos1: Spatial.Position, pos2: Spatial.Position): Double {
            val deltaLng = pos1.lng - pos2.lng
            val y = sin(deltaLng) * cos(pos2.lat)
            val x = cos(pos1.lat) * sin(pos2.lat) - (sin(pos1.lat)
                    * cos(pos2.lat) * cos(deltaLng))
            val radiansInCircle = Math.PI * 2
            return (atan2(y, x) + radiansInCircle) % radiansInCircle
        }

        fun toMeters(feet: Double): Float {
            return feet.toFloat() / 3.28084f
        }
        fun toFeet(meters: Double): Float {
            return meters.toFloat() * 3.28084f
        }
    }
}