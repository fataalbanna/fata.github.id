/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/list.css";
import axios from "axios";

function ListData() {
  const [showEdit, setShowEdit] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [datas, setDatas] = useState([]);
  const [newRecord, setNewRecord] = useState({
    noOrder: "",
    noSpk: "",
    namaPelanggan: "",
    subPortfolio: "",
    nilai: "",
    nama: "",
    email: "",
    noHp: "",
  });

  const [editRecordId, setEditRecordId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDatas();
    if (editRecordId !== null) {
      axios
        .get(`http://localhost:5000/data/${editRecordId}`)
        .then((response) => {
          setNewRecord(response.data);
        })
        .catch((error) => {
          console.error("Error fetching record:", error);
        });
    }
  }, [editRecordId]);

  const handleClose = () => {
    setShowEdit(false);
  };

  const handleShow = (isAdding, id = null) => {
    setIsAdding(isAdding);
    setEditRecordId(id);
    setShowEdit(true);

    if (!isAdding && id) {
      const dataToEdit = datas.find((data) => data.idData === id);
      if (dataToEdit) {
        setNewRecord({
          ...newRecord,
          noOrder: dataToEdit.noOrder,
          noSpk: dataToEdit.noSpk,
          namaPelanggan: dataToEdit.namaPelanggan,
          subPortfolio: dataToEdit.subPortfolio,
          nilai: dataToEdit.nilai,
          nama: dataToEdit.nama,
          email: dataToEdit.email,
          noHp: dataToEdit.noHp,
        });
      }
    } else {
      setNewRecord((prevRecord) => ({
        ...prevRecord,
        noOrder: "",
        noSpk: "",
        namaPelanggan: "",
        subPortfolio: "",
        nilai: "",
        nama: "",
        email: "",
        noHp: "",
      }));
    }
  };

  const getDatas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/data");
      setDatas(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewRecord({
      ...newRecord,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddData = () => {
    axios
      .post("http://localhost:5000/data", newRecord)
      .then((response) => {
        console.log("Data added:", response.data);
        getDatas();
        handleClose();
      })
      .catch((error) => {
        console.error("Error adding data:", error);
      });
  };

  const handleEditData = () => {
    axios
      .patch(`http://localhost:5000/data/${editRecordId}`, newRecord)
      .then((response) => {
        console.log("Data updated:", response.data);
        getDatas();
        handleClose();
      });
  };

  const handleDeleteData = (idData) => {
    axios.delete(`http://localhost:5000/data/${idData}`).then((response) => {
      console.log("Data deleted:", response.data);
      getDatas();
    });
  };

  return (
    <div className="pt-2 min-height-content">
      <div className="container">
        <div className="p-5 mt-5 rounded card section-padding custom-card">
          <div className="row row-cols-2">
            <div className="col mt-2">
              <h2>
                <b style={{ fontFamily: "Dancing Script, cursive" }}>
                  List Data
                </b>
              </h2>
            </div>
            <div className="col mt-2 mb-4 d-flex justify-content-end">
              <Button variant="success" onClick={() => handleShow(true)}>
                Tambah Data
              </Button>
            </div>
          </div>
          <div className="row">
            <div className="table-responsive text-center">
              <table className="table colors table-bordered">
                <thead>
                  <tr>
                    <th rowSpan={2} style={{ verticalAlign: "middle" }}>
                      No
                    </th>
                    <th rowSpan={2} style={{ verticalAlign: "middle" }}>
                      No Order
                    </th>
                    <th rowSpan={2} style={{ verticalAlign: "middle" }}>
                      No SPK/
                    </th>
                    <th rowSpan={2} style={{ verticalAlign: "middle" }}>
                      Nama Pelanggan
                    </th>
                    <th rowSpan={2} style={{ verticalAlign: "middle" }}>
                      Sub Portfolio
                    </th>
                    <th rowSpan={2} style={{ verticalAlign: "middle" }}>
                      Nilai
                    </th>
                    <th colSpan={3}>Contact Person</th>
                    <th rowSpan={2} style={{ verticalAlign: "middle" }}>
                      Action
                    </th>
                  </tr>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No Hp</th>
                  </tr>
                </thead>
                <tbody>
                  {datas.length === 0 ? (
                    <tr>
                      <td colSpan="10">Tidak terdapat data yang tersimpan</td>
                    </tr>
                  ) : (
                    datas.map((data, index) => (
                      <tr key={data.id}>
                        <td>{index + 1}</td>
                        <td>{data.noOrder}</td>
                        <td>{data.noSpk}</td>
                        <td>{data.namaPelanggan}</td>
                        <td>{data.subPortfolio}</td>
                        <td>{data.nilai}</td>
                        <td>{data.nama}</td>
                        <td>{data.email}</td>
                        <td>{data.noHp}</td>
                        <td>
                          <Link
                            to={`/data/${data.idData}`}
                            className="btn btn-sm btn-success me-1"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm me-1"
                            onClick={() => handleShow(false, data.idData)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteData(data.idData)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* <!--- Model Box ---> */}
          <div className="model_box">
            <Modal
              show={showEdit}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>{isAdding ? "Add Data" : "Edit Data"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="No Order"
                      name="noOrder"
                      value={newRecord.noOrder || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="No SPK"
                      name="noSpk"
                      value={newRecord.noSpk || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Pelanggan"
                      name="namaPelanggan"
                      value={newRecord.namaPelanggan || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Sub Portfolio"
                      name="subPortfolio"
                      value={newRecord.subPortfolio || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nilai"
                      name="nilai"
                      value={newRecord.nilai || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama"
                      name="nama"
                      value={newRecord.nama || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="email"
                      name="email"
                      value={newRecord.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="No Hp"
                      name="noHp"
                      value={newRecord.noHp || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success mt-4"
                    onClick={isAdding ? handleAddData : handleEditData}
                  >
                    {isAdding ? "Add Data" : "Save Changes"}
                  </button>
                </form>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            {/* Model Box Finsihs */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListData;
