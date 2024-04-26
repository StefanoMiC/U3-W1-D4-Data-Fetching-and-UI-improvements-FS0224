// questa modalità di import potrebbe essere più leggera, importando il singolo pacchetto
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

// con questo approccio stiamo caricando l'intera libreria per poi usare singole parti di essa, il peso caricato risulta maggiore
// il vantaggio è la sintassi concisa
// import {Navbar, Container, Nav, NavDropdown} from "react-bootstrap"

const MyNavbar = props => (
  <Navbar expand="lg" className="bg-body-tertiary">
    <Container fluid="xl">
      <Navbar.Brand href="#home">{props.brandName}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link">Prenota</Nav.Link>
          <Nav.Link href="#link">Admin</Nav.Link>
          <Nav.Link href="#link">Contatti</Nav.Link>
          <Nav.Link href="#link">Dove Siamo</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default MyNavbar;
