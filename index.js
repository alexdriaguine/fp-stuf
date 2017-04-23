//User object
const joeUser = {
    name: 'joe',
    email: 'joe@example.com',
    prefs: {
        languages: {
            primary: 'sp',
            secondary: 'en'
        }
    }
};
//Global indexURLs map for different languages
const indexURLs = {
    'en': 'http://mysite.com/en',  //English
     'sp': 'http://mysite.com/sp', //Spanish
    'jp': 'http://mysite.com/jp'   //Japanese
}
//apply url to window.location
const showIndexPage = (url) => { console.log(url) };


// Imperative approach, many if-else and null-checks
// relies on global
const getUrlForUserImperative = (user) => {
  if (user == null) {
    // Not logged in, return default page
    return indexURLs['en']
  }
  if (user.prefs.languages.primary && user.prefs.languages.primary != 'undefined') {
    if (indexURLs[user.prefs.languages.primary]) {
      // If translation exists
      return indexURLs[user.prefs.languages.primary]
    } else {
      return indexURLs['en']
    }
  }
}

showIndexPage(getUrlForUserImperative(joeUser))

// Functional approach, uses FP techniques Functors, Maybe Monad and Currying
const {prop, path, curry} = require('ramda')
const {Maybe} = require('ramda-fantasy')

const maybeGetUrl = curry((allUrls, language) => {
  return Maybe(allUrls[language]) // return Moand(url | null)
})(indexURLs) // pass all urls instead of using them globally

const getURLForUserFunctional = (user) => {
  return Maybe(user) // wrap user in a Maybe Monad
    .map(path(['prefs', 'languages', 'primary'])) // use ramda prop to grab primary
    .chain(maybeGetUrl) // pass language to maybeGetUrl & get url or null Monad
}

function boot(user, defaultURL) {
  showIndexPage(getURLForUserFunctional(user).getOrElse(defaultURL))
}

boot(joeUser, 'http://site.com/en')

/**
 * Lets understand some FP concepts used in the above solution
 * 
 * Functors - Any class (or construction function) or a datatype that stores a value and 
 * implements "map" method is called a Functor. Arrays are Functors, because an array can 
 * store values and has map(..) method, and allows us to map a function to the values
 * it is storing. You can write your own functor, it is simply a JS class (constructor function)
 * that stores some value and implements a map method. See the functor.js for implementation
 * The map method applies the function to the stored valye and then creates a new MyFunctor
 * from the result, returning this new functor
 */

const add1 = a => a + 1
const arr = [1, 2, 3, 4]
arr.map(add1) // [2, 3, 4, 5]


/**
 * Monads - Are also Functors, i.e. they have "map" method. They implement more methods than just
 * Map. The implement "Apply" (ap method", "Applicative" (ap and of method) and "Chain" (chain method)
 * 
 * Simple explanation, in JS, monads are classes or constructor functions that store some
 * data and implements map(..), ap(..), of(..) and chain(..) methods. See monad.js for a 
 * simple implementation. This generic monad are not typically used, but more specific and more
 * useful monads like "Maybe Monad" or "Either Monad" are often used in FP.
 */

/**
 * Maybe Monad - Implements Monad spec, takes care of null or undefined values. If the data
 * stored is null/undefined, it's map function does not run the given function at all,
 * avoiding null/undefined issues. 
 * Follow these steps when dealing with null checks of a monad
 */

// 1. If there are any object that might be null or have null props, create a Maybe object
// Imperative
const user = joeUser
if (user == null) {
  console.log('User is null')
}
// Instead do
const maybe = Maybe(user) // Returns Maybe({user}) or Maybe(null)
console.log(maybe)

// 2. Use some library, like ramdajs, that are "Maybe-aware", to access value
// from withing the Monad and work on it
// Imperative
if (user.prefs.languages.primary && user.prefs.languages.primary != 'undefined') {
  if (indexURLs[user.prefs.languages.primary]) {
    console.log('Translation exists!')
  }
}
// Instead do. Here using ramdas path to deal with data inside Maybe Monad
const maybeMapped = maybe.map(path(['prefs', 'languages', 'primary']))

// 3. Provide a default value if the actual value happens to be null
// Imperative
const defaultHardcoded = indexURLs['url']
// Instead do this. All Maybe libs provde orElse or getOrElse method that returns
// either the actual data or a default value
const value = maybeMapped.getOrElse('http://site.com/en')
console.log(value)





