import { useEffect, useSyncExternalStore } from "react";
import SceneManager from "./components/SceneManager";
import AppLoader from "./components/LogoLoader/AppLoader";
import { startLiveUnits, subscribeUnits, unitsVersion } from "./lib/liveUnits";

function App() {

  // Estados de unidades en vivo (los cambia el vendedor desde su panel).
  // Al cambiar, se vuelve a pintar el showroom con el inventario nuevo.
  const version = useSyncExternalStore(subscribeUnits, unitsVersion);
  useEffect(startLiveUnits, []);

  return (
    <>
      <SceneManager unitsVersion={version} />
      <AppLoader />
    </>
  );

}

export default App;
