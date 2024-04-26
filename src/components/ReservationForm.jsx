import { Component } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

// proprietà che il server si aspetta di ricevere per ogni prenotazione inviata:

// name <-- string
// phone <-- string
// numberOfPeople <-- string/number
// smoking <-- boolean
// dateTime <-- date/string
// specialRequests <-- string

class ReservationForm extends Component {
  // i nostri metodi custom andrebbero creati con arrow function per beneficiare del comportamento automatico di reperire il this dal contesto esterno
  // quindi in questo modo non avremo problemi a riferirci a this anche dentro ai nostri metodi.
  // l'alternativa è quella di fare il bind nel costruttore, cosa non più necessaria!

  state = {
    reservation: {
      name: "",
      phone: "",
      numberOfPeople: "1",
      smoking: false,
      dateTime: "",
      specialRequests: ""
    },
    alert: false,
    alertMsg: "",
    errorMsg: ""
  };

  handleSubmit = e => {
    // in React è ancora più importante evitare il refresh della pagina!
    e.preventDefault();

    console.log("INVIO DEL FORM EFFETTUATO");

    fetch("https://striveschool-api.herokuapp.com/api/reservation", {
      method: "POST",
      body: JSON.stringify(this.state.reservation),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok) {
          this.setState({
            reservation: {
              name: "",
              phone: "",
              numberOfPeople: "1",
              smoking: false,
              dateTime: "",
              specialRequests: ""
            },
            alert: true,
            alertMsg: "Prenotazione effettuata!"
          });

          setTimeout(() => this.setState({ alert: false, alertMsg: "" }), 3000);
        } else {
          throw new Error("Problemi nell'invio dei dati");
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ alert: true, errorMsg: err.message });
      });
  };

  handleFieldChange = (propertyName, propertyValue) => {
    this.setState({ reservation: { ...this.state.reservation, [propertyName]: propertyValue } });
  };

  render() {
    return (
      <Container>
        <h2 className="display-5 text-center mt-4">Prenota un tavolo da noi</h2>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Alert
              variant={this.state.errorMsg ? "danger" : this.state.alertMsg ? "success" : "info"}
              show={this.state.alert}
              onClose={() => this.setState({ alert: false })}
              dismissible
            >
              {/* {this.state.errorMsg ? this.state.errorMsg : this.state.alertMsg ? this.state.alertMsg : "Avviso"} */}
              {/* {this.state.errorMsg && this.state.errorMsg}
              {this.state.alertMsg && this.state.alertMsg} */}

              {this.state.errorMsg || this.state.alertMsg}
            </Alert>

            <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3" controlId="FormName">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Inserisci nome prenotazioni"
                  value={this.state.reservation.name}
                  onChange={
                    // e => this.setState({ reservation: { ...this.state.reservation, name: e.target.value } })
                    e => this.handleFieldChange("name", e.target.value)
                  }
                  required
                />
                {this.state.reservation.name && this.state.reservation.name.toLocaleLowerCase().includes("astolfo") && (
                  <Form.Text className="text-danger">Ma che brutto nome! Metti quello di un tuo amico...</Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="FormPhone">
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="+393*****"
                  value={this.state.reservation.phone}
                  onChange={e => this.handleFieldChange("phone", e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="FormNumOfPeople">
                <Form.Label>Numero di coperti</Form.Label>
                <Form.Select
                  aria-label="Number of seats"
                  value={this.state.reservation.numberOfPeople}
                  onChange={e => this.handleFieldChange("numberOfPeople", e.target.value)}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="FormDate">
                <Form.Label>Data e ora</Form.Label>
                <Form.Control
                  type="datetime-local"
                  onChange={e => this.handleFieldChange("dateTime", e.target.value)}
                  value={this.state.reservation.dateTime}
                  min={new Date().toISOString().split(".")[0].slice(0, -3)}
                  max="2024-04-28T19:59"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="FormSpecialReq">
                <Form.Label>Richieste particolari</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Facci sapere se hai esigenze particolari"
                  onChange={e => this.handleFieldChange("specialRequests", e.target.value)}
                  value={this.state.reservation.specialRequests}
                />
              </Form.Group>
              <Form.Group controlId="FormSmoking">
                <Form.Check
                  type="checkbox"
                  label="Fumatori"
                  onChange={e => this.handleFieldChange("smoking", e.target.checked)}
                  checked={this.state.reservation.smoking}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="d-block mx-auto mt-4">
                Invia Prenotazione
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ReservationForm;
