import React from "react";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";
import { Tab, Tabs, Table } from "react-bootstrap";
import { supabase } from "../supabase/client";
// import { getAllPools } from "../context/AuthProvider";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const MyVerticallyCenteredModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

const Home = () => {
  
const [modalShow, setModalShow] = React.useState(false);
  const [pool, setPools] = useState([]);
  const { user } = useAuth();
  
  useEffect(() => {
    getPools();
  }, []);
  const getPools = async () => {

    const { data } = await supabase.from("t_pool").select();
    console.log(data);

    setPools(data);
  }

  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      <div className="border p-4 rounded mt-4">
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>
                <strong>
                  Email:
                </strong>
              </td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td>
                <strong>
                  ID:
                </strong>
              </td>
              <td>{user.id}</td>
            </tr>
            <tr>
              <td>
                <strong>
                  Last Login:
                </strong>
              </td>
              <td>{user.last_sign_in_at}</td>
            </tr>
          </tbody>
        </table>
        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="profile" title="profile">
            Profile
          </Tab>
          <Tab eventKey="register-bools" title="register-bools">
            Registed Pools
          </Tab>
          <Tab eventKey="new-bool" title="new-bool">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Active</th>
                  <th>Opening hours</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  pool.map((item, index) => (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.location}</td>
                      <td>{item.capacity}</td>
                      <td>{0}</td>
                      <td>{item.opening_hours}</td>
                      <td><button className="btn btn-primary">Register</button></td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default Home;
