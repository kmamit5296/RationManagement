import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { omit } from 'lodash';

export default class AddAccountModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      rationNumber: '',
      name: '',
      dependentName: '',
      motherName: '',
      unit: '',
      date: '',
      formState: false
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.checkFormState = this.checkFormState.bind(this);
  }

  componentDidMount() {
    if (this.props.data) {
      this.setState(this.props.data, this.checkFormState);
    }
  }

  checkFormState() {
    const { rationNumber, name, dependentName, motherName, unit, date } = this.state;
    if (rationNumber != '' && name != '' && dependentName != '' && motherName!= '' && unit !='' && date != '') {
      this.setState({ formState: false })
    } else {
      this.setState({ formState: true })
    }
  }

  handleStateChange(identifier, value) {
    this.setState({ [identifier]: value }, this.checkFormState);
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    const { text, btnClass } = this.props;
    const { show, rationNumber, name, dependentName, motherName, unit, date, formState } = this.state;

    return (
      <>
        <Button
          variant="primary"
          size="sm"
          onClick={this.handleShow}
          className={btnClass}
        >
          {text}
        </Button>

        <Modal size="lg" show={show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Ration Holder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} controlId="ration-number-input">
                <Form.Label column sm="4">
                  Ration Number
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    value={rationNumber}
                    onChange={e => this.handleStateChange('rationNumber', e.target.value)}
                    type="number"
                    placeholder="ration number"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="name-input">
                <Form.Label column sm="4">
                  Name
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={e => this.handleStateChange('name', e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="dependent-name-input">
                <Form.Label column sm="4">
                  Dependent Name
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    placeholder="dependent name"
                    value={dependentName}
                    onChange={e => this.handleStateChange('dependentName', e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="mother-name-input">
                <Form.Label column sm="4">
                  Mother Name
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    placeholder="mother name"
                    value={motherName}
                    onChange={e => this.handleStateChange('motherName', e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="unit-input">
                <Form.Label column sm="4">
                  Unit
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    value={unit}
                    onChange={e => this.handleStateChange('unit', e.target.value)}
                    type="number"
                    placeholder="units"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="unit-input">
                <Form.Label column sm="4">
                  Start Date
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    value={date}
                    onChange={e => this.handleStateChange('date', e.target.value)}
                    type="text"
                    placeholder="date"
                  />
                </Col>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                this.handleClose();
                this.props.handleFormSave(omit(this.state, ['show', 'formState']), rationNumber);
              }}
              disabled={formState}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

AddAccountModal.propTypes = {
  handleFormSave: PropTypes.func,
  btnClass: PropTypes.string,
  text: PropTypes.string,
  data: PropTypes.object
};
