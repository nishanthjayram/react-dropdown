import styles from "./App.module.css";
import DropdownConfigurator from "./components/DropdownConfigurator/DropdownConfigurator";

function App() {
  return (
    <div className={styles.app}>
      <DropdownConfigurator />
    </div>
  );
}

export default App;
