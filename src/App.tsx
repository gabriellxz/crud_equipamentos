import Fab from "@mui/material/Fab";
import { useState } from "react";
import Form from "./components/Form";
import styled from "styled-components";
import Table from "./components/Table";
import { Toaster } from "sonner";

const Container = styled.div({
  display: "flex",
  justifyContent: "center",
  width: "100%"
})

function App() {

  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container>
      <Table />
      {/*MODAL DE ADICIONAR EQUIPAMENTO!!!!!!!!! */}
      <Form
        openModal={open}
        closeModal={handleClose}
      />
      <Fab color="primary" style={{ fontSize: "20px", position: "fixed", bottom: "20px", right: "20px" }} onClick={handleOpen}>
        +
      </Fab>
      <Toaster richColors/>
    </Container>
  )
}

export default App
