import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, search } = useLocation()
  const navigationType = useNavigationType()
  const key = pathname + search

  useEffect(() => {
    if (navigationType !== 'POP') {
      const st = () => { document.documentElement.scrollTop = 0; document.body.scrollTop = 0 }
      st()
      const id = setInterval(() => { st() }, 50)
      setTimeout(() => { clearInterval(id) }, 300)
    }
  }, [key, navigationType])

  return null
}
