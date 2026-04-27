import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import homeBannerImg from '../../assets/images/Home-page-bg.avif'

function HomeLayout() {
  useEffect(() => {
    const existing = document.querySelector(`link[rel="preload"][href="${homeBannerImg}"]`)
    if (existing) return undefined

    const preloadLink = document.createElement('link')
    preloadLink.rel = 'preload'
    preloadLink.as = 'image'
    preloadLink.href = homeBannerImg
    preloadLink.fetchPriority = 'high'
    document.head.appendChild(preloadLink)

    return () => {
      document.head.removeChild(preloadLink)
    }
  }, [])

  return (
    <>
      <section className="header-sticky background-img-ban">
        <Header />
        <Outlet />
      </section>
    </>
  )
}

export default HomeLayout
