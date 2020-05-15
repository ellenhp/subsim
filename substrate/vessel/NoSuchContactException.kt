package substrate.vessel

import java.lang.RuntimeException

class NoSuchContactException(override val message: String) : RuntimeException("Action could not be completed: $message") {

}
