import React from 'react';
import { Form, Col, Table, Button } from 'react-bootstrap';
import Select from 'react-select';
import moment from 'moment';
import request from 'utils/request';

import AddEditAccountModal from './AddAccountModal';
import SearchElement from './SearchElement';
import { getYears, getMonths } from './helpers';
import { HomePageStyle } from './style';


export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().format('YYYY'),
      month: moment().subtract(1, 'month').format('MMMM'),
      data: {
        accounts: [],
        monthlyData: {}
      },
      rationSearch: ''
    }
    this.getTableBody = this.getTableBody.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleSaveData = this.handleSaveData.bind(this);
    this.handleFormSave = this.handleFormSave.bind(this);
    this.getTableHeaders = this.getTableHeaders.bind(this);
  }

  componentDidMount() {
    request('/data')
      .then(result => {
        this.setState({ data: result });
      });
  }

  handleSaveData() {
    request('/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.data)
    });
  }

  handleFormSave(formData, rationNumber) {
    const { data } = this.state;
    const account = data.accounts.find(acc => acc.rationNumber === rationNumber);
    if (account) {
      Object.assign(account, formData);
    } else {
      data.accounts.push(formData);
    }
    this.setState({ data }, this.handleSaveData);
  }

  handleCheckBoxChange(rationNumber) {
    const { year, month, data } = this.state;
    const monthLabel = `${year}-${month}`;

    if (data.monthlyData[monthLabel]) {
      const monthData = data.monthlyData[monthLabel];

      if (monthData.includes(rationNumber)) {
        monthData.splice(monthData.indexOf(rationNumber), 1);
      } else {
        monthData.push(rationNumber);
      }
    } else {
      data.monthlyData[monthLabel] = [rationNumber];
    }
    this.setState({ data }, this.handleSaveData);
  }

  getTableHeaders() {
    return (
      <thead className="table-head-wrapper">
        <tr>
          <th className="first-col">#</th>
          <th>
            Ration Number <br />
            <SearchElement
              valueChange={val => this.setState({ rationSearch: val })}
            />
          </th>
          <th>Name</th>
          <th>Dependent Name</th>
          <th>Mother Name</th>
          <th>Unit</th>
          <th>Active Date</th>
          <th>Ration Given</th>
          <th></th>
        </tr>
      </thead>
    );
  }

  getTableBody() {
    let accounts = this.state.data.accounts;
    if (this.state.rationSearch) {
      accounts = accounts.filter(acc => acc.rationNumber.toString().includes(this.state.rationSearch));
    }
    return (
      <tbody>
        {
          accounts.map((item, index) => {
            const monthLabel = `${this.state.year}-${this.state.month}`;
            const checked = this.state.data.monthlyData[monthLabel] &&
              this.state.data.monthlyData[monthLabel].includes(item.rationNumber);
            return (
              <tr key={item.rationNumber}>
                <td className="first-col">{index + 1}</td>
                <td>{item.rationNumber}</td>
                <td>{item.name}</td>
                <td>{item.dependentName}</td>
                <td>{item.motherName}</td>
                <td>{item.unit}</td>
                <td>{item.date}</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    id={`check-${item.rationNumber}`}
                    onChange={() => this.handleCheckBoxChange(item.rationNumber)}
                    checked={!!checked}
                  />
                </td>
                <td>
                  <AddEditAccountModal
                    data={item}
                    text="Edit"
                    btnClass="edit-btn"
                    handleFormSave={this.handleFormSave}
                  />
                </td>
              </tr>
            );
          })
        }
      </tbody>
    );

  }

  render() {
    return (
      <HomePageStyle fluid>
        <Form>
          <Form.Row>
            <Form.Group controlId="year-select-range" md={3} as={Col}>
              <Form.Label className="control-label">Select Year:</Form.Label>
              <div className="element-wrapper">
                <Select
                  options={getYears()}
                  value={{ value: this.state.year, label: this.state.year }}
                  onChange={selected => this.setState({ year: selected.value })}
                />
              </div>
            </Form.Group>
            <Form.Group controlId="month-select-range" md={3} as={Col}>
              <Form.Label className="control-label">Select Month:</Form.Label>
              <div className="element-wrapper">
                <Select
                  options={getMonths()}
                  value={{ value: this.state.month, label: this.state.month }}
                  onChange={selected => this.setState({ month: selected.value })}
                />
              </div>
            </Form.Group>
            <Form.Group controlId="add-person" md={3} as={Col}>
              <Form.Label className="control-label">Add Account:</Form.Label>
              <div className="element-wrapper">
                <AddEditAccountModal
                  text="Add"
                  handleFormSave={this.handleFormSave}
                />
              </div>
            </Form.Group>
            <Form.Group controlId="get-pdf" md={3} as={Col}>
              <Form.Label className="get-pdf">Get PDF:</Form.Label>
              <div className="element-wrapper">
                <Button
                  as="a"
                  variant="success"
                  size="sm"
                  target="_blank"
                  href="/pdf"
                >
                  Get PDF
                </Button>
              </div>
            </Form.Group>
          </Form.Row>
          <Table bordered hover>
            {this.getTableHeaders()}
            {this.getTableBody()}
          </Table>
        </Form>

      </HomePageStyle>
    );
  }
}