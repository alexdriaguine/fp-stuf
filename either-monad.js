/**
 * Great for dealing with multiple functions when they all can potentially throw error
 * and want to quit immediately after an error so we can pin-point where the error occured
 */

// Imperative solution, multiple error checks..
// const tax = (tax, price) => {
//   if (isNaN(price)) return new Error('Price must be numeric')
//   return price + (tax * price)
// }

// const discount = (dis, price) => {
//   if (isNaN(price)) return new Error('Price must be numeric')
//   if (price < 10) return new Error('discount cant be applied to cheap items')
//   return price - (price * discount)
// }

// const isError = e => e && e.name == 'Error'
// const getItemPrice = item => item.price

// const showTotalPrice = (item, taxPerc, disc) => {
//   const price = getItemPrice(item)
//   let result = tax(taxPerc, price)
//   if (isError(result)) {
//     return console.log('Error: ', result.message)
//   }
  
//   result = discount(disc, result)
//   if (isError(result)) {
//     return console.log('Error: ', result.message)
//   }
//   console.log('Total price: ', result)
// }


/**
 * Lets rewrite it with the Either Monad.
 * The Either Monad provides two construcvtors, Either.Left and Either.Right
 * Think of them as subclasses of Either. Both Left and Right are Monads! The idea is to store 
 * errors/exceptions in Left and useful values in Right. Once we do that we can run map, chain,
 * and so on on those valyes to compose them. Both Right and Left provides "map", "chain" 
 * and so on, but Left does not do anything as it stores errors. Right implements
 * all the functions as it contains an actual result
 * 
 * Step 1: Wrap return values with Left and Right. (Wrap means create an instance of some class).
 * 
 * Step 2: Wrap the initial value in Right because it's a valid value so we can compose it
 * 
 * Step 3: Create two functions, one to handle eventual error and one to handle result.
 * And wrap them in Either.either (ramda-fantasy api) Either.either takes 3 params, success
 * handler, error handler, and an Either Monad. Either is curried, so we can just pass the 
 * handlers for now and pass Either later Once Either.either receives all 3 params, it passes
 * the 3rd param Either to the success handler or error handler depending on if the Either is
 * Right or left
 * 
 * Step 4: Use chain method to compose multiple error throwing functions. Pass their result to 
 * Either.either (eitherLowOrShow) which will take care of passing the result
 * to success or error handler
 */

const R = require('ramda')
const {Either} = require('ramda-fantasy')
const {Left, Right} = Either

const tax = R.curry((tax, price) => 
   typeof price !== 'number'
    ? Left(new Error('price must be numeric'))
    : Right(price + (tax * price))
)

const discount = R.curry((dis, price) => {
  if (typeof price !== 'number') return Left(new Error('price must be numeric'))
  if (price < 10) return Left(new Error('cannot discount cheap items'))
  return Right(price - (price * dis))
})

const getItemPrice = item => Right(item.price)
const addTax = tax(0.25)
const addDiscount = discount(0.10)

const displayTotal = total => console.log('Total Price: ',  total)
const logError = ({message}) => console.log('Error: ', message)
const eitherLogOrShow = Either.either(logError, displayTotal)
const showTotalPrice = item => eitherLogOrShow(
  getItemPrice(item)
    .chain(addDiscount)
    .chain(addTax)
)

const tShirt = {name: 't-shirt', price: 11}
const pant = {name: 'pants', price: '10 dollars'}
const chips = {name: 'chips', price: 5}



showTotalPrice(tShirt)
showTotalPrice(pant)
showTotalPrice(chips)

