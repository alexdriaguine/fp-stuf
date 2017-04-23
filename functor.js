// Functor, implements a map function
class MyFunctor {
  constructor(value) {
    this.value = value
  }

  map(fn) {
    return new MyFunctor(fn(this.value))
  }
}

const temp = new MyFunctor(1)
const myFunctor = temp.map(a => a + 1)
console.log(myFunctor) // MyFunctor { value : 2 }

module.exports = MyFunctor

