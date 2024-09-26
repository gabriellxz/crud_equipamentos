import { Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import { FormContainer } from "../style/FormContainer";
import styled from "styled-components";
import { api } from "../config/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface PropsModal {
    openModal: boolean;
    closeModal: () => void;
}

interface FormData {
    nome: string
    tipo: string
    status: string
    img_url: string
}

const BoxInput = styled.div({
    display: "flex",
    gap: "5px",
    marginTop: "20px"
})

const BoxButton = styled.div({
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px"
})

export default function Form({ openModal, closeModal }: PropsModal) {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    async function postEquipamento(data: FormData) {
        try {
            const response = await api.post("equipamento", data)

            console.log(response.data);
            closeModal();
            toast.success("Equipamento criado com sucesso!");
        } catch (error) {
            toast.error("Erro")
        }
    }

    return (
        <>
            <Modal
                open={openModal}
                onClose={closeModal}
            >
                <FormContainer onSubmit={handleSubmit(postEquipamento)}>
                    <p>Adicionar novo equipamento</p>
                    <BoxInput style={{display: "flex", flexDirection: "column"}}>
                        <TextField fullWidth type="text" variant="outlined" label="Nome" {...register("nome", {required: "Este campo é obrigatório."})} />
                        <p style={{color: "red"}}>{errors.nome?.message}</p>
                    </BoxInput>
                    <BoxInput>
                        <FormControl fullWidth>
                            <InputLabel id="id-equipamento-label">Tipo</InputLabel>
                            <Select
                                labelId="id-equipamento-label"
                                id="id-equipamento"
                                label="Tipo"
                                {...register("tipo", { required: "Este campo é obrigatório." })}
                            >
                                <MenuItem value="Caminhão">Caminhão</MenuItem>
                                <MenuItem value="Escavadeira">Escavadeira</MenuItem>
                                <MenuItem value="Guindaste">Guindaste</MenuItem>
                            </Select>
                            <p style={{color: "red"}}>{errors.tipo?.message}</p>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="id-status-label">Status</InputLabel>
                            <Select
                                labelId="id-status-label"
                                id="id-status"
                                label="Status"
                                {...register("status", { required: "Este campo é obrigatório." })}
                            >
                                <MenuItem value="Ativo">Ativo</MenuItem>
                                <MenuItem value="Quebrado">Quebrado</MenuItem>
                                <MenuItem value="Manutenção">Manutenção</MenuItem>
                                <MenuItem value="Parado na oficina">Parado na oficina</MenuItem>
                            </Select>
                            <p style={{color: "red"}}>{errors.status?.message}</p>
                        </FormControl>
                    </BoxInput>
                    <BoxInput style={{display: "flex", flexDirection: "column"}}>
                        <TextField fullWidth label="URL da imagem" variant="outlined" {...register("img_url", { required: "Este campo é obrigatório." })} />
                        <p style={{color: "red"}}>{errors.img_url?.message}</p>
                    </BoxInput>
                    <BoxButton>
                        <Button variant="contained" type="submit">Adicionar equipamento</Button>
                    </BoxButton>
                </FormContainer>
            </Modal>
        </>
    );
}
