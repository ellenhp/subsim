# Multiplayer Aquatic Simulation System (MASS)

MASS is a piece of software designed to enable players to cooperatively control marine vessels in a semi-realistic way. While focus has been placed on accurate reproduction of a vessel's systems, MASS isn't designed as a training simulator for any particular vessel. Systems shown in this simulation are generic. MASS was written as a part of an entry into the 2020 Sim Jam, and may or may not recieve updates after the conclusion of that game jam.

## Basic Architecture

MASS is composed of three main components, along with a reverse proxy (envoy) that helps glue everything together.

### Substrate

Substrate is the game server. It keeps track of the state of all the games happening. It currently can't be sharded or replicated so it's pretty simple, just keeps track of where stuff is, how loud it's being, who's doing what, etc.

### Bloop

Bloop is our sonar simulation microservice. Bloop could probably eventually be replicated which is pretty slick. All it does all day is propagate sound from one position to another and report back on how much of the energy was lost. Internally it uses bellhop, licensed under the GPLv3, located in //acoustics/bellhop

### Cowfarts

Cowfarts is the sweet frontend for all this, it's written in react, I think. I didn't really work on it so I don't have much to say other than that it's really cool.

## Communication

Everything communicates with gRPC which was an absolute nightmare to set up, but it's really nice once it works. gRPC is great for backend work but for web frontends it's still not quite there.
