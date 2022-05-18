import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function App() {
  const baseUrl="http://localhost:8080/transportadora/";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [frameworkSeleccionado, setFrameworkSeleccionado]= useState({
    id: '',
    placa: '',
    modelo: '',
    potencia: '',
    color: '',
    foto: ''
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    setFrameworkSeleccionado((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(frameworkSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);      
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    var f = new FormData();
    f.append("placa", frameworkSeleccionado.placa);
    f.append("modelo", frameworkSeleccionado.modelo);
    f.append("potencia", frameworkSeleccionado.potencia);
    f.append("color", frameworkSeleccionado.color);
    f.append("foto", frameworkSeleccionado.foto);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    var f = new FormData();
    f.append("placa", frameworkSeleccionado.placa);
    f.append("modelo", frameworkSeleccionado.modelo);
    f.append("potencia", frameworkSeleccionado.potencia);
    f.append("color", frameworkSeleccionado.color);
    f.append("foto", frameworkSeleccionado.foto);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(response=>{
      var dataNueva= data;
      
      // eslint-disable-next-line array-callback-return
      dataNueva.map(framework=>{
        if(framework.id===frameworkSeleccionado.id){
          framework.placa=frameworkSeleccionado.placa;
          framework.modelo=frameworkSeleccionado.modelo;
          framework.potencia=frameworkSeleccionado.potencia;         
          framework.color=frameworkSeleccionado.color;
          framework.foto=frameworkSeleccionado.foto; 
        }
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(response=>{
      setData(data.filter(framework=>framework.id!==frameworkSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarFramework=(framework, caso)=>{
    setFrameworkSeleccionado(framework);

    (caso==="Editar")?
    abrirCerrarModalEditar():
    abrirCerrarModalEliminar()
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div style={{textAlign: 'center'}}>
      <br/>
          <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar Camion</button>
          <br/><br/>
        <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Potencia</th>
            <th>Color</th>
            <th>Foto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(framework=>(
            <tr key={framework.id}>
              <td>{framework.id}</td>
              <td>{framework.placa}</td>
              <td>{framework.modelo}</td>
              <td>{framework.potencia}</td>
              <td>{framework.color}</td>              
              <td>{framework.foto}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>seleccionarFramework(framework, "Editar")}>Editar</button> {"  "}
                <button className="btn btn-danger" onClick={()=>seleccionarFramework(framework, "Eliminar")}>Eliminar</button>
              </td>
            </tr>
          ))}

        </tbody>

        </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar framework</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Placa: </label>
            <br />
            <input type="text" className="form-control" name="placa" onChange={handleChange}/>
            <br />
            <label>Modelo: </label>
            <br />
            <input type="text" className="form-control" name="modelo" onChange={handleChange}/>
            <br />
            <label>Potencia: </label>
            <br />
            <input type="text" className="form-control" name="potencia" onChange={handleChange}/>
            <br />
            <label>Color: </label>
            <br />
            <input type="text" className="form-control" name="color" onChange={handleChange}/>
            <br />
            <label>Imagen: </label>
            <br />
            <input type="text" className="form-control" name="foto" onChange={handleChange}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"  "}
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
        </Modal>  

        <Modal isOpen={modalEditar}>
          <ModalHeader>Editar framework</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Placa: </label>
              <br />
              <input type="text" className="form-control" name="placa" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.placa}/>
              <br />
              <label>Modelo: </label>
              <br />
              <input type="text" className="form-control" name="modelo" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.modelo}/>
              <br />
              <label>Potencia: </label>
              <br />
              <input type="text" className="form-control" name="potencia" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.potencia}/>
              <br />
              <label>Color: </label>
              <br />
              <input type="text" className="form-control" name="color" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.color}/>
              <br />
              <label>Imagen: </label>
              <br />
              <input type="text" className="form-control" name="foto" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.foto}/>
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=>peticionPut()}>Guardar</button>{"   "}
            <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
          </ModalFooter>
          </Modal>   

          <Modal isOpen={modalEliminar}>
            <ModalBody>
              ¿Estás seguro que deas eliminar el Camion con Placa {frameworkSeleccionado && frameworkSeleccionado.placa}?
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>peticionDelete()}>
                Si
              </button>
              <button
                className="btn btn-secondary"
                onClick={()=>abrirCerrarModalEliminar()}
                >
                  No
                </button>
            </ModalFooter>
            </Modal>       
        
    </div>
  );
}

export default App;
