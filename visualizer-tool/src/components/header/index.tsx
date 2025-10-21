import "./style.scss";
import Logo from "../../assets/Logo.svg";
import Github from "../../assets/GitHub.svg";

const Header = () => {
  return (
    <div className="header">
      <div>
        <img src={Logo} alt="Logo" />
        <p>Trivia Insights</p>
      </div>

      <a
        href="https://github.com/GarikNahapetyan/visualization-tool.git"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={Github} alt="Github" />
      </a>
    </div>
  );
};

export default Header;
