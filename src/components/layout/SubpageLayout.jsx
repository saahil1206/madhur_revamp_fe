import { Outlet } from 'react-router-dom'
import Header from './Header'

function SubpageLayout() {
  return (
    <section className="subpage-bg-gradient">
      <Header />
      <Outlet />
    </section>
  )
}

export default SubpageLayout
