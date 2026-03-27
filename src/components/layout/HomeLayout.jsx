import { Outlet } from 'react-router-dom'
import Header from './Header'

function HomeLayout() {
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
