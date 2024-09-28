import "../../Styles/Hub.css"; // Asegúrate de que la hoja de estilos esté en el lugar correcto

export function NavButton({ iconClass, text, onClick, imgSrc, imgAlt }) {
  return (
    <button className="selector" onClick={onClick}>
        {imgSrc ? (
          <i>
            <img src={imgSrc} alt={imgAlt} className={imgAlt.toLowerCase().replace(" ", "-")} />
          </i>
          ) : (
          <i className={iconClass}></i>
        )}
      <span>{text}</span>
    </button>
  );
}
