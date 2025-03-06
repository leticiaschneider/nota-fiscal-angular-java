export interface Invoice {
    id?: number;
    numeroNota: string;
    dataEmissao: string;
    fornecedorId: number;
    endereco?: string;
    valorTotal: number;
    itens: InvoiceItem[];
}

export interface InvoiceItem {
    id?: number;
    produtoId: number;
    valorUnitario: number;
    quantidade: number;
    valorTotal: number;
}