package substrate.vessel

import java.lang.RuntimeException

class SystemMatchingException(override val message: String) : RuntimeException("Action could not be completed: $message") {
}