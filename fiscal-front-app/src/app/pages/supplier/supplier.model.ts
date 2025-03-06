export interface Supplier {
    id?: number;
    codigo: string;
    razaoSocial: string;
    email: string;
    telefone: string;
    cnpj: string;
    situacao: string;
    dataBaixa?: string | null;
}