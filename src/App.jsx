// QUESTO E' FONDAMENTALE altrimenti ogni componente react-bootstrap utilizzato non si visualizzerà correttamente!
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MyNavbar from "./components/MyNavbar";
import Home from "./components/Home";
import ReservationForm from "./components/ReservationForm";
import ReservationList from "./components/ReservationList";

// Un componente React è una funzione che ritorna del JSX, deve ritornare un singolo elemento.
function App() {
  return (
    <div className="App">
      <MyNavbar brandName="EpicStaurant" />
      {/* qui visualizzeremo le prenotazioni */}
      <ReservationList />

      {/* qui effettuiamo le prenotazioni */}
      <ReservationForm />
      <Home />
    </div>
  );
}

// e dovrà necessariamente essere esportato per essere visibile e utilizzato all'esterno (vedi index.js)
export default App;
