package substrate

import java.lang.RuntimeException

class VesselMatchingException(override val message: String) : RuntimeException("Action could not be completed: $message") {
}