import { Button, FormControl, MenuItem, Modal, TextField } from "@mui/material";
import { FormContainer } from "../style/FormContainer";
import styled from "styled-components";
import { api } from "../config/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const equipamentosSchema = z.object({
    id: z.number(),
    nome: z.string().min(1, "Nome é obrigatório."),
    tipo: z.enum(["Caminhão", "Escavadeira", "Guindaste"], {
        errorMap: () => ({ message: "Tipo iválido." })
    }),
    status: z.enum(["Ativo", "Quebrado", "Manutenção", "Parado na oficina"], {
        errorMap: () => ({ message: "Status inválido." })
    }),
    img_url: z.string().min(1, "URL da imagem é obrigatória.").url("URL de imagem inválida.")
})

export default function Form({ openModal, closeModal }: PropsModal) {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(equipamentosSchema)
    });

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
                    <BoxInput style={{ display: "flex", flexDirection: "column" }}>
                        <TextField fullWidth type="text" variant="outlined" label="Nome" {...register("nome")} error={!!errors.nome} helperText={errors.nome?.message} />
                    </BoxInput>
                    <BoxInput>
                        <FormControl fullWidth>
                            <TextField
                                id="outlined-select-currency"
                                select
                                label="Tipo"
                                error={!!errors.tipo}
                                helperText={errors.tipo?.message}
                                {...register("tipo")}
                            >
                                <MenuItem value="Caminhão">Caminhão</MenuItem>
                                <MenuItem value="Escavadeira">Escavadeira</MenuItem>
                                <MenuItem value="Guindaste">Guindaste</MenuItem>
                            </TextField>
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField
                                id="id-status"
                                label="Status"
                                select
                                error={!!errors.img_url}
                                helperText={errors.status?.message}
                                {...register("status")}
                            >
                                <MenuItem value="Ativo">Ativo</MenuItem>
                                <MenuItem value="Quebrado">Quebrado</MenuItem>
                                <MenuItem value="Manutenção">Manutenção</MenuItem>
                                <MenuItem value="Parado na oficina">Parado na oficina</MenuItem>
                            </TextField>
                        </FormControl>
                    </BoxInput>
                    <BoxInput style={{ display: "flex", flexDirection: "column" }}>
                        <TextField
                            fullWidth
                            label="URL da imagem"
                            variant="outlined"
                            {...register("img_url", { required: "Este campo é obrigatório." })}
                            error={!!errors.img_url}
                            helperText={errors.img_url?.message}
                        />
                    </BoxInput>
                    <BoxButton>
                        <Button variant="contained" type="submit">Adicionar equipamento</Button>
                    </BoxButton>
                </FormContainer>
            </Modal>
        </>
    );
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