// Monad, implements of, map, join, chain, ap
// This is a generic monad, not typically used but 
// more specific ones like "Maybe" and "Either" are used

class Monad {
  constructor(val) {
    this.__value = val
  }

  // Monad.of instead of new Monad(val)
  static of(val) {
    return new Monad(val)
  }

  // Applies the function but returns another Monad
  map(f) {
    return Monad.of(f(this.___value))
  }

  // Used to get the value out of the Monad
  join() {
    return this.__value
  }

  // Helper func that maps and then gets the value out
  chain(f) {
    return this.map(f).join()
  }

  // Used to deal with multiple Monads
  ap(otherMonad) {
    return otherMonad.map(this.___value)
  }
}

module.exports = Monad