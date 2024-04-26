import { Component } from "react";
import { Alert, Badge, Button, Col, Container, ListGroup, Row, Spinner } from "react-bootstrap";

class ReservationList extends Component {
  state = {
    // questa porzione di stato la useremo per raccogliere e salvare i dati in arrivo dal server (dopo la fetch)
    reservations: [],
    isLoading: false,
    isError: false
  };

  // i metodi custom DEVONO usare SEMPRE ARROW FUNCTIONS (per ereditare il this dell'istanza del nostro componente a classe)
  fetchReservations = () => {
    this.setState({ isLoading: true });

    console.log("fetch in corso...");
    fetch("https://striveschool-api.herokuapp.com/api/reservation")
      .then(response => {
        if (response.ok) {
          console.log("fetch conclusa");
          return response.json();
        } else {
          throw new Error("Errore nella richiesta delle prenotazioni al server");
        }
      })
      .then(reservations => {
        // qui abbiamo ricevuto i dati sotto forma di array, ci basterà sostituire lo stato con array vuoto con questo nuovo array
        console.log(reservations);

        // questo è il momento in cui l'array si salva nello stato e scatterà immediatamente dopo un'altra chiamata di render()
        // che a questo punto nel suo JSX potrà mappare e generare nuovi elementi a partire dai nuovi dati trovati nello stato
        this.setState({ reservations });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isError: true });
      })
      .finally(() => this.setState({ isLoading: false }));
  };

  deleteReservation = resId => {
    fetch("https://striveschool-api.herokuapp.com/api/reservation/" + resId, { method: "DELETE" })
      .then(resp => {
        if (resp.ok) {
          // chiameremo di nuovo la funzione che chiederà al server l'array aggiornato, salvandolo di conseguenza come nuovo state.reservations
          this.fetchReservations();
          return resp.json();
        } else {
          throw new Error("Errore nell'eliminazione");
        }
      })
      .then(deletedObj => {
        // alert("eliminato con successo l'appuntamento di: " + deletedObj.name);
      })
      .catch(err => {
        // alert(err.message);
      });
  };

  componentDidMount() {
    // componentDidMount è il primo metodo di "Lifecycle" (del ciclo di vita del componente) che useremo.
    // senza il suo contributo non riusciremmo a creare un'interfaccia a partire da una chiamata API
    // questo perché al ricevimento dei dati avremo bisogno di settare uno stato, e ci serve un'area del codice che non venga richiamata dopo questo cambio di stato
    // la sua particolarità è che VIENE ESEGUITO UNA VOLTA SOLA! al montaggio del componente, quindi successivo al primo render()
    //1) si istanzia il componente a classe
    //2) si crea il suo stato iniziale (con valori default)
    //3) viene chiamato render() la prima volta
    //4) se presente viene eseguito per la prima e unica volta il metodo componentDidMount()
    //5) se nel componentDidMount, avviene un setState, dopo il reperimento dei dati
    //6) viene ri-eseguito il metodo render(), questo è collegato al fatto che ogni setState in definitiva chiamerà render un'altra volta (ad ogni nuovo cambio di stato)
    //7) le parti di interfaccia collegate allo State a questo punto potrebbero generarsi, o cambiare con il nuovo dato arrivato.

    // di conseguenza il componentDidMount() è il posto perfetto per effettuare chiamate API con cui popolare l'interfaccia al primo caricamento
    console.log("componentDidMount()");
    this.fetchReservations();
  }

  render() {
    console.log("RENDER");
    // this.fetchReservations(); // mai chiamare una fetch dentro a render, perché non potremmo mai salvare i dati nello State, pena un loop in finito e codice rotto
    return (
      <Container>
        <div className="text-center">
          <h2 className="display-5 d-inline-block text-center mt-4">Queste le prenotazioni per oggi</h2>
          {/* in questi casi ci basta il cortocircuito && perché non ci serve di visualizzare qualcos'altro al suo posto,
                semplicemente non deve renderizzarsi nella pagina quando lo state isLoading o isErrore sono false */}
          {this.state.isLoading && <Spinner animation="border" variant="primary" />}
        </div>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            {this.state.isError && <Alert variant="danger">Si è verificato un errore</Alert>}

            {/* questo controllo si preoccupa di visualizzare l'alert nell'unico caso che è quando 
             la fetch HA FINITO (spinner spento e nessun errore) e ha finito senza trovare dati nel server (array che rimane vuoto) */}
            {/*              true                 &&       (!false => true)  &&   (!true => false)*/}

            {this.state.reservations.length === 0 && !this.state.isLoading && !this.state.isError && (
              <Alert variant="info">Nessuna prenotazione</Alert>
            )}

            {/* questo si visualizza quando non siamo in caricamento, non si sono verificati errori, e abbiamo ricevuto almeno un dato nell'array */}
            {this.state.reservations.length > 0 && !this.state.isLoading && !this.state.isError && (
              <ListGroup>
                {this.state.reservations.map(reserv => {
                  return (
                    <ListGroup.Item key={reserv._id} className="d-flex gap-2">
                      <span>{reserv.name}</span> per: <strong>{reserv.numberOfPeople}</strong>
                      {reserv.smoking && <span>🚬</span>}
                      <Badge bg="light" className="ms-auto text-dark">
                        {new Date(reserv.dateTime).toLocaleTimeString()}
                      </Badge>
                      <Button
                        variant="danger"
                        size="sm"
                        className="px-1 py-0"
                        onClick={() => this.deleteReservation(reserv._id)}
                      >
                        <i class="bi bi-trash3"></i>
                      </Button>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ReservationList;
