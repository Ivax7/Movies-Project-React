import "../../Styles/Hub.css"

function Hub() {

  return (
<div id="container">
    <nav>
      
      <div className="actions">
        <div className="black-mode">
          <button><i className="fa-regular fa-moon"></i></button>
          {/* <i class="fa-solid fa-moon"></i> */}
        </div>

        <div className="desplegable">
          <button><i className="fa-solid fa-bars"></i></button>
        </div>
      </div>
      
      

        <button className="selector"><i className="fa-solid fa-house"></i><span>Home</span></button>
        <button className="selector"><i className="fa-solid fa-magnifying-glass"></i><span>Search</span></button>
        <button className="selector"><i className="fa-solid fa-film"></i><span>Lists</span></button>


        <button className="selector log-in"><i className="fa-solid fa-right-to-bracket"></i><span>Log-in</span></button>

    </nav>
    <main>
      <div id="top-section">
        <div id="review">
          <h2>Malditos Bastardos (2009)</h2>
          <p>Segunda Guerra Mundial (1939-1945). En la Francia ocupada por los alemanes, Shosanna Dreyfus (Mélanie Laurent) presencia la ejecución de su familia por orden del coronel Hans Landa (Christoph Waltz). Después de huir a París, adopta una nueva identidad como propietaria de un cine. En otro lugar de Europa, el teniente Aldo Raine (Brad Pitt) adiestra a un grupo de soldados judíos ("The Basterds") para atacar objetivos concretos. Los hombres de Raine y una actriz alemana (Diane Kruger), que trabaja para los aliados, deben llevar a cabo una misión para hacer caer a los jefes del Tercer Reich. El destino quiere que todos se encuentren bajo la marquesina de un cine donde Shosanna espera para vengarse. (FILMAFFINITY)</p>
        </div>
        <div id="poster">
          <img src="https://es.web.img3.acsta.net/c_310_420/pictures/14/02/19/09/20/260793.jpg" alt="Review Film/Show" />
        </div>
      </div>
      <div id="recent-films">
        <h2>Most Recent Films</h2>
      </div>
    </main>
  </div>

  )
}


export default Hub