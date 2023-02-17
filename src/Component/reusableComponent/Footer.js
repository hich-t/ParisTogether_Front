// footer basique ajouté manuellement sur chaque page si nécéssaire

const Footer = () => {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="footerdiv">
      <p className="footertitle">
        Made by Mévine, Elyes & Hicham &#128513; <br />© MEH inc.
      </p>
      <button onClick={handleClick} className="footerbacktotopbutton">
        Back to Top
      </button>
    </div>
  );
};

export default Footer;
