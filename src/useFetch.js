import {useEffect, useState, useRef, useLayoutEffect} from 'react'

// * In this UseFetch I'm destructuring the props object
// * to get the url, and passed it as a dependencie of the useEffect
// * as a string which is a primitive and is compare by value
// * only when the url string value change than is going to execute the useEffect
const Usefetch = ({url}) => {
  const [state, setState] = useState([])

  useEffect(() => {
    const getData = () => {
      fetch(url)
        .then(response => response.json())
        .then(json => setState(json))
    }

    getData()
    // ! constraining the dependencie array to primimitives like
    // ! string, booleans and numbers is a goo practice.
  }, [url])

  return {state}
}

// * In this UsefetchwithOptions Im passing an object 'options'
// * which is compare by reference, so everytime the component that call this hook
// * is passing a new object reference and is a cause of bug infinit loop
// TODO : the component that uses this hook, should memoize this object
// TODO : in order to avoid infinit rerenders.
const UsefetchwithOptions = options => {
  const [state, setState] = useState([])

  useEffect(() => {
    const getData = () => {
      fetch(options.url)
        .then(response => response.json())
        .then(json => setState(json))
    }

    getData()
    // ! to pass objects, arrays or functions - values compare by reference
    // ! is not recommended.
  }, [options])

  return {state}
}

const UsefetchwithOptions2 = options => {
  const [state, setState] = useState([])
  const savedOnSuccess = useRef(options.success)

  useLayoutEffect(() => {
    savedOnSuccess.current = options.success
  }, [options.success])

  useEffect(() => {
    const getData = () => {
      fetch(options.url)
        .then(response => response.json())
        .then(json => {
          savedOnSuccess.current?.()
          setState(json)
        })
    }

    getData()
    // ! to pass objects, arrays or functions - values compare by reference
    // ! is not recommended.
  }, [options.url])

  return {state}
}

export {Usefetch, UsefetchwithOptions, UsefetchwithOptions2}
