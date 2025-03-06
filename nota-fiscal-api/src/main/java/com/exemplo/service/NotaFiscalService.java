package com.exemplo.service;

import com.exemplo.model.NotaFiscal;
import com.exemplo.model.NotaFiscalItem;
import com.exemplo.repository.NotaFiscalRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class NotaFiscalService {

    @Inject
    NotaFiscalRepository notaFiscalRepository;
    @Inject
    FornecedorService fornecedorService;  // Agora chama o serviço de fornecedor

    @Inject
    ProdutoService produtoService;

    public List<NotaFiscal> listarNotasFiscais() {
        return notaFiscalRepository.listAll();
    }

    @Transactional
    public void salvarNotaFiscal(NotaFiscal notaFiscal, List<NotaFiscalItem> itens) {
        // Verificar se o fornecedor está ativo
        if (!fornecedorService.fornecedorAtivo(notaFiscal.getFornecedorId().longValue())) {
            throw new IllegalArgumentException("Fornecedor não ativo");
        }

        // Verificar se todos os itens têm produtos ativos
        for (NotaFiscalItem item : itens) {
            if (!produtoService.produtoAtivo(item.getProdutoId().longValue())) {
                throw new IllegalArgumentException("Produto " + item.getProdutoId() + " não ativo");
            }
        }

        // Associa os itens à nota fiscal
        notaFiscal.setItens(itens);
        
        // Persistindo a Nota Fiscal primeiro
        notaFiscalRepository.persist(notaFiscal);
        
        // Garante que o ID foi gerado antes de salvar os itens
        notaFiscalRepository.getEntityManager().flush();

        // Agora associamos os itens à nota fiscal e persistimos cada um
        for (NotaFiscalItem item : itens) {
            item.setNotaFiscal(notaFiscal);
            notaFiscalRepository.getEntityManager().persist(item);
        }
    }

    @Transactional
public void atualizarNotaFiscal(NotaFiscal notaFiscal) {
    // Verificar se o fornecedor está ativo
    if (!fornecedorService.fornecedorAtivo(notaFiscal.getFornecedorId().longValue())) {
        throw new IllegalArgumentException("Fornecedor não ativo");
    }

    // Verificar se todos os itens têm produtos ativos
    for (NotaFiscalItem item : notaFiscal.getItens()) {
        if (!produtoService.produtoAtivo(item.getProdutoId().longValue())) {
            throw new IllegalArgumentException("Produto " + item.getProdutoId() + " não ativo");
        }
    }

    notaFiscalRepository.getEntityManager().merge(notaFiscal);
}



    public Optional<NotaFiscal> buscarNotaFiscalPorId(Long id) {
        return notaFiscalRepository.findByIdOptional(id);
    }

    @Transactional
    public void excluirNotaFiscal(Long id) {
        notaFiscalRepository.deleteById(id);
    }
}