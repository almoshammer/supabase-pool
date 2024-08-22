import React from "react";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";
import { Tab, Tabs, Table,Spinner } from "react-bootstrap";
import { supabase } from "../supabase/client";
// import { getAllPools } from "../context/AuthProvider";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Home = () => {

  const [errorMsg, setErrorMsg] = useState("");
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
            Register to Pool
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Do you want to register for this pool?</h4>
          <p>
            <strong>Name:</strong>{props.pool.name}<br />
            <strong>Location:</strong>{props.pool.location}<br />
            <strong>Openning hours:</strong>{props.pool.opening_hours}<br />
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={props.onRegister} loading={props.rLoading}>
          {
            props.rLoading &&
            <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          }
            Yes, Register</Button>
          <Button variant="secondary" onClick={props.onHide}>No</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  /* Modal Un Register */
  const ModelUnRegister = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Un Register
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure to cancel registeration for this pool?</h4>
          <p>
            <strong>Name:</strong>{props.pool.pool_name}<br />
            <strong>Registration date: </strong>{props.pool.registration_date}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onUnRegister}>
          {
            props.rLoading &&
            <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          }
            Yes, I am sure</Button>
          <Button variant="secondary" onClick={props.onHide}>No</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  /* /Modal Un Register */

  const [registerLoading, setRegsiterLoading] = useState(false);
  const [unRegisterLoading, setUnRegsiterLoading] = useState(false);


  const [currPool, setCurrPool] = useState({});

  const [modalShow, setModalShow] = useState(false);
  const [modalUnReg,setModelUnReg] = useState(false);

  const [pools, setPools] = useState([]);
  const [regPools, setRegPools] = useState([]);
  const { user } = useAuth();

  const handleShow = (index) => {
    setCurrPool(pools.at(index));
    setModalShow(true);
  }

  const handleShowUnRegister = (index) => {
    setCurrPool(regPools.at(index));
    setModelUnReg(true);
  }
  const register = async () => {
    
    setRegsiterLoading(true);

    try {
      const { data, error } = await supabase.rpc("registeruser", { pool_id: currPool.id });
      loadData();
      setModalShow(false);
    } catch (e) {
      setErrorMsg(e);
    } finally {
      setRegsiterLoading(false);
    }

  }

  const UnRegister = async () => {
  
   setUnRegsiterLoading(true);
    try {
      const { data, error } = await supabase.rpc("unregisteruser", { p_pool_id: currPool.pool_id });
      loadData();
      setModelUnReg(false)
    } catch (e) {
      setErrorMsg(e);
    } finally {
      setUnRegsiterLoading(false);
    }

  }
  useEffect(() => {
    loadData();
  }, []);
  const loadData=()=>{
    getPools();
    getRegisterPools();
  };
  const getPools = async () => {
    const { data} = await supabase.rpc("get_pools");
    setPools(data);
  }
  const getRegisterPools = async()=>{
    const { data,error} = await supabase.rpc("getuserpools");
    setRegPools(data);
  }

  return (
    <>
      {errorMsg && (
        <Alert
          variant="danger"
          onClose={() => setErrorMsg("")}
          dismissible>
          {errorMsg}
        </Alert>
      )}
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() =>setModalShow(false)}
        onRegister={register}
        pool={currPool}
        rLoading={registerLoading}
      />

<ModelUnRegister
        show={modalUnReg}
        onHide={() => setModelUnReg(false)}
        onUnRegister={UnRegister}
        pool={currPool}
        rLoading={unRegisterLoading}
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
           <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Registration Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  regPools.map((item, index) => (
                    <tr key={item.pool_id}>
                      <td>{item.pool_id}</td>
                      <td>{item.pool_name}</td>
                      <td>{item.registration_date}</td>
                      <td><Button className="btn btn-danger" onClick={() => handleShowUnRegister(index)}>UnRegister</Button></td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
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
                  pools.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.location}</td>
                      <td>{item.capacity}</td>
                      <td>{0}</td>
                      <td>{item.opening_hours}</td>
                      <td><button className="btn btn-primary" onClick={() => handleShow(index)}>Register</button></td>
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
