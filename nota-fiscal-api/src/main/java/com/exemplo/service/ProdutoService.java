package com.exemplo.service;

import com.exemplo.model.Produto;
import com.exemplo.repository.NotaFiscalRepository;
import com.exemplo.repository.ProdutoRepository;
import jakarta.persistence.EntityManager;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ProdutoService {

    @Inject
    ProdutoRepository produtoRepository;

    @Inject
    NotaFiscalRepository notaFiscalRepository;

    @Inject
    EntityManager entityManager;

    public List<Produto> listarProdutos() {
        return produtoRepository.listAll();
    }

    @Transactional
    public void criarProduto(Produto produto) {
        produtoRepository.persist(produto);
    }

    public Produto buscarProdutoPorId(Long id) {
        Optional<Produto> produto = produtoRepository.findByIdOptional(id);
        return produto.orElse(null);
    }

    @Transactional
    public void atualizarProduto(Produto produto) {
        produtoRepository.getEntityManager().merge(produto);
    }

    public boolean produtoTemItensNotaFiscal(Long produtoId) {
        String hql = "SELECT COUNT(n) FROM NotaFiscalItem n WHERE n.produto.id = :produtoId";
        long count = notaFiscalRepository.getEntityManager()
                                         .createQuery(hql, Long.class)
                                         .setParameter("produtoId", produtoId)
                                         .getSingleResult();
        return count > 0;
    }

    @Transactional
    public void excluirProduto(Long produtoId) {
        if (produtoTemItensNotaFiscal(produtoId)) {
            throw new IllegalStateException("Não é possível excluir um produto que já foi utilizado em uma nota fiscal.");
        }

        Produto produto = produtoRepository.findById(produtoId);
        if (produto != null) {
            produtoRepository.delete(produto);
        } else {
            throw new EntityNotFoundException("Produto não encontrado.");
        }
    }

    public List<Produto> searchByDescricaoOuCodigo(String term) {
        return produtoRepository.searchByDescricaoOuCodigo(term);
    }
    
    public boolean produtoAtivo(Long produtoId) {
        Produto produto = produtoRepository.findById(produtoId);
        return produto != null && produto.getSituacao() == Produto.Situacao.ATIVO;
    }
}