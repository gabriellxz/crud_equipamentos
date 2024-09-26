import { ChangeEvent, useEffect, useState } from "react";
import { EquipamentoType } from "../type/equipamento";
import { api } from "../config/api";
import styled from "styled-components";
import { Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { toast } from "sonner";

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

    function handleChangePage(page: number) {
        setPage(page);
    }

    function handleChangeRowsPerPage(event: ChangeEvent<HTMLInputElement>) {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    async function deleteEquipamento(id: number) {
        try {
            await api.delete(`equipamento/${id}`)

            setEquipamento(equipamento.filter(e => e.id != id));
            setOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    function handleOpen(equipamento: EquipamentoType) {
        setSelectedEquipamento(equipamento);
        setNome(equipamento.nome);
        setTipo(equipamento.tipo);
        setStatus(equipamento.status);
        setImagem(equipamento.img_url);
        setOpen(true);
    }

    function handleClose() {
        setSelectedEquipamento(null);
        setOpen(false);
    }

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
    async function editEquipamento(id: number) {
        const data = {
            nome: nome,
            tipo: tipo,
            status: status,
            img_url: imagem
        }

        // console.log(data);

        try {
            if (nome && tipo && status && imagem) {
                const response = await api.put(`equipamento/${id}`, data, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                toast.success("Equipamento atualizado!");
                setNome("");
                setTipo("");
                setStatus("");
                setImagem("");

                console.log(response);
                setOpen(false);
            } else {
                toast.error("Preencha os campos corretamente.");
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
                        {equipamento.map((e: EquipamentoType) => (
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
                                rowsPerPageOptions={[5, 10, 25]} // Opções para mudar o número de linhas por página
                                count={equipamento.length} // Total de equipamentos
                                rowsPerPage={rowsPerPage} // Número de linhas por página atual
                                page={page} // Página atual
                                onPageChange={() => handleChangePage(10)} // Função para mudar de página
                                onRowsPerPageChange={handleChangeRowsPerPage} // Função para mudar o número de linhas por página
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
                        <FormDetails onSubmit={() => editEquipamento(selectedEquipamento.id)}>
                            <BoxInput>
                                <TextField variant="outlined" label="Nome" value={nome} fullWidth onChange={changeNome} name="nome"/>
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
                                <TextField variant="outlined" label="URL da imagem" value={imagem} fullWidth onChange={changeImagem}  name="img_url"/>
                            </BoxInput>
                            <BoxInput style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button variant="contained" sx={{ backgroundColor: "red" }} onClick={() => deleteEquipamento(selectedEquipamento.id)}>Deletar</Button>
                                <Button variant="contained" type="submit">Salvar</Button>
                            </BoxInput>
                        </FormDetails>
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

const FormDetails = styled.form({
    width: "100%",
    padding: "10px",
    display: "flex",
    gap: "15px",
    flexDirection: "column",
});

const BoxInput = styled.div({
    display: "flex",
    gap: "10px"
})