import { Component } from "react";
import { Alert, Badge, Carousel, Col, Container, Image, ListGroup, Row } from "react-bootstrap";
import menu from "../data/menu.json";

// vogliamo avere una memoria interna al componente, come fare?
// attraverso lo State, stato interno del componente stesso
// in passato era prerogativa solamente di componenti a Classe, in futuro troveremo il modo di applicarlo anche a componenti fatti a funzione
// ma per il momento faremo un refactor del nostro componente Home da funzione a Classe, per potergli creare il suo stato interno!

class Home extends Component {
  // lo State è una memoria interna ad un componente a Classe
  // lo State è sempre un oggetto

  // in passato per creare uno stato avevamo bisogno di ricorrere al constructor, in cui chiamavamo super passandogli le props,
  // e creavamo lo stato agganciandolo all'istanza della classe con this

  // constructor(props) {
  //     super(props)
  //     this.state = {}
  // }

  // oggi semplicemente creiamo un oggetto nel contesto principale (deve chiamarsi obbligatoriamente "state")

  state = {
    stefano: true,
    selectedPasta: menu[0] // dopo il cambio di approccio, nel quale facciamo cambiare lo stato dall'evento del carosello (e non più al click della slide),
    // abbiamo deciso di impostare di default il primo oggetto nello stato,
    // per visualizzare subito le recensioni anche per il primo oggetto del menu

    // mentre prima avevamo questa condizione di stato iniziale:

    // selectedPasta: null
    // null è un valore iniziale migliore quando prevediamo di ricevere un oggetto in un secondo momento
    // null è falsy quindi viene valutato a false nel contesto booleano (es. if) mentre oggetto vuoto {} è truthy e viene valutato come true
    // non utile a evitarci un problema in caso di valore non ancora esistente
  };

  // regola nr.1 degli stati in React:
  // - MAI MUTARE LO STATO DIRETTAMENTE!!!

  // come facciamo quindi a modificare o manipolare lo State?
  // attraverso un metodo DEDICATO: .setState()

  // this.setState(object)
  // il metodo setState è un metodo asincrono! si aspetta un oggetto con le chiavi da modificare
  // (non dev'essere necessariamente identico allo stato globale, non è necessario ripetere TUTTE le proprietà esistenti, ma solo quella che vogliamo cambiare)

  // chiamare setState NOTIFICHERA' React di un avvenuto cambiamento nel suo stato interno
  // di conseguenza richiamerà il metodo render() un'altra volta

  // si capisce quindi perché non è possibile mutare lo stato direttamente, non si attiverebbero queste logiche automatiche,
  // e l'interfaccia non rifletterebbe in automatico il cambiamento

  render() {
    // console.log("RENDER AVVENUTO");
    // mai chiamare setState fuori dal contesto di un evento
    // risulterebbe in un loop infinito di setState che chiama render e render che chiama setState
    return (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs={12} md={8} lg={6}>
            {/* onSlide è un metodo regalatoci da react-bootstrap, 
            il suo funzionamento è particolare e prevede di passarci l'indice della nuova slide appena cambiata come parametro della nostra funzione
            possiamo quindi mettere insieme l'indice della posizione della slide visualizzata con la posizione nell'array menu, 
            trovando quindi l'oggetto del nuovo elemento visualizzato a schermo. 

            A quel punto lo possiamo salvare nello State andando ad attivare l'aggiornamento della porzione di interfaccia collegata allo State!*/}
            <Carousel onSlide={slideIndex => this.setState({ selectedPasta: menu[slideIndex] })}>
              {/* per usare il map all'interno del JSX abbiamo bisogno di creare un'area di contenuto dinamico per 
            andare a risolvere l'espressione direttamente sul posto, quindi risolvere il map, 
            che si lascerà dietro di sé un array di elementi React che verranno renderizzati nella pagina.
            
            Per un corretto uso del map, avremo bisogno di applicare SEMPRE una prop key sul primo elemento ritornato dal map,
            per evitare che React ricrei l'intera lista nel caso in cui uno degli elementi debba cambiare nel tempo.
            */}
              {menu.map(dish => {
                return (
                  <Carousel.Item
                    key={`dish-${dish.id}`}
                    // onClick={e => {
                    //   console.log("CLICK AVVENUTO");
                    //   this.setState({ selectedPasta: dish });
                    // }}
                  >
                    <Image src={dish.image} className="w-100" />
                    <Carousel.Caption>
                      <h3>{dish.name}</h3>
                      <p>
                        {dish.description} <Badge bg="dark">{dish.price}€</Badge>
                      </p>
                    </Carousel.Caption>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </Col>
        </Row>
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={8} lg={6}>
            {/* il blocco sottostante prevede un'espressione ternaria che ci permette di gestire l'interfaccia nel visualizzare 
            un messaggio alternativo quando lo stato fosse ancora falsy (per esempio al primo avvio del componente) */}
            {this.state.selectedPasta ? (
              <h4>Recensioni per {this.state.selectedPasta.name}: </h4>
            ) : (
              <Alert variant="info">Quando il carosello si attiverà vedrai le recensioni</Alert>
            )}

            <ListGroup>
              {/* Quando abbiamo a che fare con valori di stato è buona prassi controllare la loro esistenza
                specialmente per il primo render iniziale, nel quale lo stato potrebbe non essere ancora presente
                
                Grazie a questo ternario, nel caso in cui lo stato sia vuoto inizialmente non si genererà un errore,
                ma ci sarà il fallback sul caso else del ternario stesso, generando un elemento alternativo ed
                evitando così errori che potrebbero nascere dalla lettura di null.comments ad esempio
                */}
              {/* corto circuito (short circuit) è un espressione che serve a prevenire errori al primo avvio di un componente quando il dato manca */}
              {/* questo previene la lettura della linea successiva, che però verrà sbloccata nel momento in cui lo stato cambierà da valore falsy a oggetto effettivo */}
              {this.state.selectedPasta &&
                this.state.selectedPasta.comments.map((review, i) => {
                  return (
                    <ListGroup.Item
                      key={`comment-${review.id}`}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {review.author} — {review.comment}
                      </span>
                      <Badge bg={review.rating > 3 ? "success" : "danger"} pill>
                        {review.rating}
                      </Badge>
                    </ListGroup.Item>
                  );
                })}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
