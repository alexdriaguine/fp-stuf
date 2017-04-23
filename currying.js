const R = require('ramda')
const {Maybe} = require('ramda-fantasy')

/**
 * If we want to chain a series of functions together, all these functions can
 * only receive just one input parameter each. But practically speaking, many functions take 
 * multiple arguments. The solution is currying.
 * 
 * Currying converts a function that takes multiple params into a function that takes a single
 * param one at a time. It wont run the function until all params are passed
 * 
 * Currying can also be used in situations when we are accessing global values, i.e. make it pure

 */

const indexURL = {
  en: 'mysite.com/en',
  sp: 'mysite.com/sp',
  jp: 'mysite.com/jp'
}

// Imperative. Simple but error prone and impure (accessing global variable)
const getUrlImperative = language => indexURL[language]

// Functional
// Before currying
const getUrlFunctional = (allUrls, language) => Maybe(allUrls[language])

// After currying
const getUrlCurrying = R.curry((allUrls, language) => Maybe(allUrls[language]))
const maybeGetUrl = getUrlCurrying(indexURL)
// From this point, maybeGetUrl needs only one argyment (languge)
// So we can now chain this like maybe(user).chain(maybeGetUrl).bla().bla()