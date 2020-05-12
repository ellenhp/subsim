package substrate

import java.lang.RuntimeException

class NoSuchWorldException(override val message: String) : RuntimeException("Action could not be completed: $message") {
}