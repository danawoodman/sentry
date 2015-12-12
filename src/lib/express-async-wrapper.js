/**
 * Wrap an async express route so that middleware properly
 * cathes thrown exceptions in the route.
 *
 * Wraps the express route in a function that passes the
 * `next` method from the route to the promise's catch
 * statement which allows the middleware to catch the
 * exception.
 *
 * @param {Function} fn The Express function to wrap
 * @returns {Function} The wrapped function
 * @see {@link https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/#usinges7asyncawait}
 * @example
 *
 * import wrap from 'lib/express-async-wrapper'
 *
 * //.. some express setup stuff
 *
 * app.get('/foo', wrap(someAsyncRouteFunction))
 */
export default fn => {
  return (...args) => {
    return fn(...args).catch(args[2])
  }
}
