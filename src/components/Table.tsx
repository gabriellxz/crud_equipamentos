import { ChangeEvent, useEffect, useState } from "react";
import { EquipamentoType } from "../type/equipamento";
import { api } from "../config/api";
import styled from "styled-components";
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, MenuItem, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormData {
    id: number
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

export default function Table() {

    const [equipamento, setEquipamento] = useState<EquipamentoType[]>([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [selectedEquipamento, setSelectedEquipamento] = useState<EquipamentoType | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    async function getEquipamentos() {
        try {
            const response = await api.get("equipamento")

            console.log(response);
            setEquipamento(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getEquipamentos();
    }, [equipamento]);

    function handleChangePage(event: unknown, newPage: number) {
        setPage(newPage);
    }

    function handleChangeRowsPerPage(event: ChangeEvent<HTMLInputElement>) {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    async function deleteEquipamento(id: number) {
        try {
            await api.delete(`equipamento/${id}`)

            toast.success("Equipamento deletado com sucesso!");
            setEquipamento(equipamento.filter(e => e.id != id));
            setOpen(false);
        } catch (error) {
            toast.error("Não foi possível deletar este equipamento.");
            console.log(error);
        }
    }

    function handleOpen(equipamento: EquipamentoType) {
        // console.log(equipamento)
        setSelectedEquipamento(equipamento);
        setOpen(true);
    }

    function handleClose() {
        setSelectedEquipamento(null);
        setOpen(false);
    }

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(equipamentosSchema)
    });

    async function editEquipamento(data: FormData) {

        // console.log(data);

        try {
            if (selectedEquipamento) {
                const response = await api.put(`equipamento/${selectedEquipamento.id}`, data)

                console.log(response);
                toast.success("Equipamento atualizado com sucesso!")
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <>
            <TableContainer>
                <StyledTable>
                    <TableHead>
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {equipamento.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((e: EquipamentoType) => (
                            <TableRow key={e.id} onClick={() => handleOpen(e)} sx={{ cursor: "pointer" }}>
                                <TableCell>{e.id}</TableCell>
                                <TableCell>{e.nome}</TableCell>
                                <TableCell>{e.tipo}</TableCell>
                                <TableCell>{e.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={equipamento.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </StyledTable>
            </TableContainer>

            {/* MODAL DO EQUIPAMENTO!!!!!! */}
            {
                selectedEquipamento &&
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>Detalhes do equipamento</DialogTitle>
                    <DialogContent sx={{ display: "" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            {
                                selectedEquipamento.img_url && (
                                    <img src={selectedEquipamento.img_url} alt={selectedEquipamento.img_url} style={{ maxWidth: "300px", width: "100%", borderRadius: "5px" }} />
                                )
                            }
                        </div>
                        <form onSubmit={handleSubmit(editEquipamento)} style={{ marginTop: "10px", maxWidth: "600px", width: "100%" }}>
                            <Box sx={{ marginTop: "20px" }}>
                                <TextField defaultValue={selectedEquipamento.nome} variant="outlined" label="Nome" {...register("nome")} error={!!errors.nome}
                                    helperText={errors.nome?.message} fullWidth />
                            </Box>
                            <Box sx={{ display: "flex", gap: "5px", marginTop: "20px" }}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        label="Tipo"
                                        error={!!errors.tipo}
                                        helperText={errors.tipo?.message}
                                        {...register("tipo")}
                                        defaultValue={selectedEquipamento.tipo}
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
                                        error={!!errors.status}
                                        helperText={errors.status?.message}
                                        {...register("status")}
                                        defaultValue={selectedEquipamento.status}
                                    >
                                        <MenuItem value="Ativo">Ativo</MenuItem>
                                        <MenuItem value="Quebrado">Quebrado</MenuItem>
                                        <MenuItem value="Manutenção">Manutenção</MenuItem>
                                        <MenuItem value="Parado na oficina">Parado na oficina</MenuItem>
                                    </TextField>
                                </FormControl>
                            </Box>
                            <Box sx={{ marginTop: "20px" }}>
                                <TextField defaultValue={selectedEquipamento.img_url} variant="outlined" label="URL da imagem" {...register("img_url")} fullWidth
                                    error={!!errors.img_url} helperText={errors.img_url?.message} />
                            </Box>
                            <Box style={{ display: "flex", justifyContent: "flex-end", gap: "5px", marginTop: "20px" }}>
                                <Button variant="contained" sx={{ backgroundColor: "red" }} onClick={() => deleteEquipamento(selectedEquipamento.id)}>Deletar</Button>
                                <Button variant="contained" type="submit">Salvar</Button>
                            </Box>
                        </form>
                    </DialogContent>
                </Dialog>
            }
        </>
    );
}

const TableContainer = styled.div`
    max-width: 700px;
    width: 100%;
    background-color: #f4f4f2;
    padding: 10px;
    border-radius: 10px;
    margin-top: 20px;
    overflow: hidden;
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    
    th, td {
        border: 1px solid #ddd; 
        padding: 8px;
    }

    th {
        background-color: #f2f2f2;
        font-weight: bold;
        text-align: left;
    }
`;

