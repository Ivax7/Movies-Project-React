import Film from '../Film/Film.jsx';
import '../../Styles/RecentFilms.css'
function ContainerFilms() {
  return (
    <>
      <h1 className='recent-films'>Most recent films</h1>
      <main className="container">
        <Film />
      </main>
    </>
  )
}

export default ContainerFilms