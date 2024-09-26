import { Button, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField } from "@mui/material";
import { FormContainer } from "../style/FormContainer";
import styled from "styled-components";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { api } from "../config/api";
import { toast, Toaster } from "sonner";

interface PropsModal {
    openModal: boolean;
    closeModal: () => void;
}

const BoxInput = styled.div({
    display: "flex",
    gap: "10px",
    marginTop: "20px"
})

const BoxButton = styled.div({
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px"
})

export default function Form({ openModal, closeModal }: PropsModal) {

    //ESTADOS E FUNÇÕES PARA MANIPULAR OS INPUTS!!!!!!
    const [nome, setNome] = useState<string>("");
    const [tipo, setTipo] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [imagem, setImagem] = useState<string>("");

    function changeNome(e: ChangeEvent<HTMLInputElement>) {
        setNome(e.target.value);
    }

    function changeTipo(e: SelectChangeEvent) {
        setTipo(e.target.value);
    }

    function changeStatus(e: SelectChangeEvent) {
        setStatus(e.target.value);
    }

    function changeImagem(e: ChangeEvent<HTMLInputElement>) {
        setImagem(e.target.value);
    }

    //----------------------------------------------------------------

    //FUNÇÃO DE POST!!!!!!
    async function addEquipamento(e: SyntheticEvent) {
        e.preventDefault();

        const data = {
            nome: nome,
            tipo: tipo,
            status: status,
            img_url: imagem
        }

        // console.log(data);

        try {
            if (nome && tipo && status && imagem) {
                const response = await api.post("equipamento", data, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                toast.success("Equipamento adicionado!");
                setNome("");
                setTipo("");
                setStatus("");
                setImagem("");

                console.log(response);
                closeModal();
            } else {
                toast.error("Preencha os campos corretamente.");
            }
        } catch (error) {
            console.log(error);
        }
    }
    //-----------------------------------------------------------------------

    return (
        <>
            <Modal
                open={openModal}
                onClose={closeModal}
            >
                <FormContainer onSubmit={addEquipamento}>
                    <p>Adicionar novo equipamento</p>
                    <BoxInput>
                        <TextField fullWidth type="text" variant="outlined" label="Nome" value={nome} onChange={changeNome} name="nome" />
                    </BoxInput>
                    <BoxInput>
                        <FormControl fullWidth>
                            <InputLabel id="id-equipamento-label">Tipo</InputLabel>
                            <Select
                                labelId="id-equipamento-label"
                                id="id-equipamento"
                                label="Tipo"
                                value={tipo}
                                onChange={changeTipo}
                                name="tipo"
                            >
                                <MenuItem value="Caminhão">Caminhão</MenuItem>
                                <MenuItem value="Escavadeira">Escavadeira</MenuItem>
                                <MenuItem value="Guindaste">Guindaste</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="id-status-label">Status</InputLabel>
                            <Select
                                labelId="id-status-label"
                                id="id-status"
                                label="Status"
                                value={status}
                                onChange={changeStatus}
                                name="status"
                            >
                                <MenuItem value="Ativo">Ativo</MenuItem>
                                <MenuItem value="Quebrado">Quebrado</MenuItem>
                                <MenuItem value="Manutenção">Manutenção</MenuItem>
                                <MenuItem value="Parado na oficina">Parado na oficina</MenuItem>
                            </Select>
                        </FormControl>
                    </BoxInput>
                    <BoxInput>
                        <TextField fullWidth label="URL da imagem" variant="outlined" value={imagem} onChange={changeImagem} name="img_url" />
                    </BoxInput>
                    <BoxButton>
                        <Button variant="contained" type="submit">Adicionar equipamento</Button>
                    </BoxButton>
                </FormContainer>
            </Modal>
            <Toaster richColors/>
        </>
    );
}
