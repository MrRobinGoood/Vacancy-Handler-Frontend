import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./Header.css"
function Header() {
    return (
        <Container fluid className="container">
            <Row>
                <Col>
                 <div className="header">
                     <img src="logo2.png" className="image" alt=""/>
                     <img src="logo1.png" className="image" alt="" />
                     <img src="logo3.png" className="image" alt="" />
                     <h1 className="text">Главная</h1>
                 </div>
                </Col>
            </Row>
        </Container>
    );
}
export default Header;