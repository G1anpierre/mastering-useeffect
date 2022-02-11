import './App.css'
import {useState, useEffect, memo, useMemo} from 'react'
import {Usefetch, UsefetchwithOptions, UsefetchwithOptions2} from './useFetch'

const RenderList = ({url}) => {
  const {state} = Usefetch({
    url,
  })

  console.log(state)

  return (
    <div>
      <h1>POSTS or USERS</h1>
      <ul>
        {state.map(post => (
          <li key={post.id}>{post.title ? post.title : post.name}</li>
        ))}
      </ul>
    </div>
  )
}

const MemoizeRenderPosts = memo(RenderList)

const RenderAlbums = ({albums}) => {
  return (
    <div>
      <h2>Albums</h2>
      <ul>
        {albums.map(album => (
          <li key={album.id}>{album.title}</li>
        ))}
      </ul>
    </div>
  )
}

const useStopwatch = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [count])

  return count
}

function App() {
  const URL_TO_FETCH_POSTS = process.env.REACT_APP_FETCH_URL_POST
  const URL_TO_FETCH_USERS = process.env.REACT_APP_FETCH_URL_USERS
  const URL_TO_FETCH_ALBUMS = 'https://jsonplaceholder.typicode.com/albums'
  const URL_TO_FETCH_TODOS = 'https://jsonplaceholder.typicode.com/todos'

  const count = useStopwatch()
  // * useStopwatch() is causing a render of the page in case we use it as process.env.REACT_APP_FETCH_URL_ALBUMS
  // * It looks like it is consider as an object creating new instances everytime the counter change

  // * one solution is to memoize it as we have done in the under comments, and the other solution is to have it as a string which is a primitive value
  // * and its compare by value. and does not make the API call unnecessary on other actions.
  // const URL_TO_FETCH_ALBUMS = useMemo(
  //   () => process.env.REACT_APP_FETCH_URL_ALBUMS,
  //   [],
  // )
  // const URL_TO_FETCH_TODOS = useMemo(
  //   () => process.env.REACT_APP_FETCH_URL_TODOS,
  //   [],
  // )

  // * This option memoize the object {url: URL_TO_FETCH_ALBUMS} instance in order
  // * to avoid infinite loop rerenders
  const optionsMemoize = useMemo(
    () => ({url: URL_TO_FETCH_ALBUMS}),
    [URL_TO_FETCH_ALBUMS],
  )
  const {state: albumsState} = UsefetchwithOptions(optionsMemoize)

  // * This option avoid the infinite loop renders in the UsefetchwithOptions2 hook
  // * handleling separated -> the url string with the array dependencies and the function success
  // * useRef useLayoutEffect trick.
  const {state: todosState} = UsefetchwithOptions2({
    url: URL_TO_FETCH_TODOS,
    success: () => console.log('success with useLayoutEffect'),
  })

  const [state, setState] = useState(0)
  const [url, setUrl] = useState('')

  const handleClick = () => {
    setState(prev => prev + 1)
  }

  const hadleChangeUrl = url => {
    setUrl(url)
  }

  useEffect(() => {
    console.log('running useEffect')
  }, [state])

  return (
    <div className="App">
      <h1>Mastering useEffect</h1>
      <div>Automatic Count :{count}</div>
      <div>{state}</div>
      <button onClick={handleClick}>handle Click Counter</button>
      <button onClick={() => hadleChangeUrl(URL_TO_FETCH_POSTS)}>
        {' '}
        get posts{' '}
      </button>
      <button onClick={() => hadleChangeUrl(URL_TO_FETCH_USERS)}>
        {' '}
        get users
      </button>
      <RenderAlbums albums={albumsState} />
      <MemoizeRenderPosts url={url} />
    </div>
  )
}

export default App
