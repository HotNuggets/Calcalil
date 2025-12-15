import { useNavigate } from "react-router-dom";
import styles from "./BackToWelcomeButton.module.scss";

const BackToWelcomeButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className={styles.backButton}
      onClick={() => navigate("/")}
    >
      ← Back to Home
    </button>
  );
};

export default BackToWelcomeButton;