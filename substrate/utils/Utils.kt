package substrate.utils

import api.Spatial
import kotlin.math.*

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

        fun distanceMeters(pos1: Spatial.Position, pos2: Spatial.Position): Double {
            // Mean radius of the earth
            val radiusMeters = 6_371_008.8
            return 2 * radiusMeters *
                    asin(sqrt(
                            sin((Math.toRadians(pos2.lat) - Math.toRadians(pos1.lat)) / 2).pow(2.0) +
                                    cos(Math.toRadians(pos1.lat)) * cos(Math.toRadians(pos2.lat)) *
                                    sin((Math.toRadians(pos2.lng) - Math.toRadians(pos1.lng)) / 2).pow(2.0)
                    ))
        }

    }
}