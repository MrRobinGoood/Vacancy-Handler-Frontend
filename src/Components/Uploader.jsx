import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./Uploader.css"
import {FilePicker} from "./file-picker";
function Uploader() {

    return (

        <Container fluid className="containerUp">
            <Row>
                <Col>
                    <div className="uploader">
                        <FilePicker uploadURL={"http://127.0.0.1:8000/upload"}/>
                    </div>

                </Col>
            </Row>
        </Container>
    );
}

export default Uploader;