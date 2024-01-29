/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/list.css";
import axios from "axios";

function DetailData() {
  const [arsips, setArsips] = useState([]);
  const [dataArsips, setDataArsips] = useState([]);
  const [dataNamaPelanggan, setDataNamaPelanggan] = useState();
  const [idData, setIdData] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const { id } = useParams();
  const [newRecord, setNewRecord] = useState({
    namaFile: "",
  });
  const [editRecordId, setEditRecordId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const getDataById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/data/${id}`);
      setArsips(response.data.arsips);
      setDataNamaPelanggan(response.data.namaPelanggan);
      setIdData(response.data.idData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getArsip = async () => {
    try {
      const response = await axios.get("http://localhost:5000/arsip");
      setDataArsips(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddArsip = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    for (let key in newRecord) {
      formData.append(key, newRecord[key]);
    }

    axios
      .post("http://localhost:5000/arsip", formData)
      .then((response) => {
        console.log("Data added:", response.data);
        getDataById();
        handleClose();
      })
      .catch((error) => {
        console.error("Error adding data:", error);
      });
  };

  const handleEditArsip = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    for (let key in newRecord) {
      formData.append(key, newRecord[key]);
    }

    axios
      .patch(`http://localhost:5000/arsip/${editRecordId}`, formData)
      .then((response) => {
        console.log("Data updated:", response.data);
        getDataById();
        handleClose();
      });
  };

  const handleDeleteArsip = (idArsip) => {
    axios
      .delete(`http://localhost:5000/arsip/${idArsip}`)
      .then((response) => {
        console.log("Data deleted:", response.data);
        getDataById();
      });
  };

  const loadFile = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  useEffect(() => {
    getArsip();
    getDataById();
    if (editRecordId !== null) {
      axios
        .get(`http://localhost:5000/arsip/${editRecordId}`)
        .then((response) => {
          setNewRecord(response.data);
        })
        .catch((error) => {
          console.error("Error fetching record:", error);
        });
    }
  }, [editRecordId]);

  const handleInputChange = (e) => {
    setNewRecord({
      ...newRecord,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setShowEdit(false);
  };

  const handleShow = (isAdding, id = null) => {
    setIsAdding(isAdding);
    setEditRecordId(id);
    setShowEdit(true);

    if (!isAdding && id) {
      const arsipDataToEdit = dataArsips.find(
        (dataArsip) => dataArsip.idArsip === id
      );
      if (arsipDataToEdit) {
        setNewRecord({
          ...newRecord,
          idData: arsipDataToEdit.idData,
          namaFile: arsipDataToEdit.namaFile,
        });
      }
    } else {
      setNewRecord((prevRecord) => ({
        ...prevRecord,
        idData: idData,
        namaFile: "",
        file: selectedFile,
      }));
    }
    console.log(newRecord);
  };

  return (
    <div className="pt-2 min-height-content">
      <div className="container">
        <div className="p-5 mt-5 rounded card section-padding custom-card">
          <div className="row row-cols-2">
            <div className="col mt-2">
              <h2>
                <b style={{ fontFamily: "Dancing Script, cursive" }}>List Arsip Data {dataNamaPelanggan}</b>
              </h2>
            </div>
            <div className="col mt-2 mb-4 d-flex justify-content-end">
              <Button variant="success" onClick={() => handleShow(true)}>Tambah Data</Button>
            </div>
          </div>
          <div className="row">
            <div className="table-responsive text-center">
              <table className="table colors table-bordered">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama File</th>
                    <th>Tipe File</th>
                    <th>File</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {arsips.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        Tidak terdapat data yang tersimpan
                      </td>
                    </tr>
                  ) : (
                    arsips.map((arsip, index) => (
                      <tr key={arsip.id}>
                        <td style={{ textAlign: 'left' }}>{index + 1}</td>
                        <td style={{ textAlign: 'left' }}>{arsip.namaFile}</td>
                        <td>{arsip.tipeFile}</td>
                        <td>
                          <a
                            href={arsip.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Download/View
                          </a>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handleShow(false, arsip.idArsip)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleDeleteArsip(arsip.idArsip)
                            }
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
                <Modal.Title>
                  {isAdding ? "Add Arsip" : "Edit Arsip"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Id Data"
                      name="idData"
                      value={newRecord.idData || ""}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama File"
                      name="namaFile"
                      value={newRecord.namaFile || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <input
                      type="file"
                      className="form-control"
                      onChange={loadFile}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success mt-4"
                    onClick={isAdding ? handleAddArsip : handleEditArsip}
                  >
                    {isAdding ? "Add Arsip" : "Save Changes"}
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

export default DetailData;
