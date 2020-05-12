package substrate.vessel

import java.lang.RuntimeException

class VesselInstantiationException(override val message: String) : RuntimeException("Vessel could not be instantiated: $message") {
}