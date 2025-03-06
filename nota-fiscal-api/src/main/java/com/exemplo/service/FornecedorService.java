package com.exemplo.service;

import com.exemplo.model.Fornecedor;
import com.exemplo.repository.FornecedorRepository;
import com.exemplo.repository.NotaFiscalRepository;
import com.exemplo.utils.CNPJUtil;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class FornecedorService {

    @Inject
    FornecedorRepository fornecedorRepository;

    @Inject
    NotaFiscalRepository notaFiscalRepository;

    public List<Fornecedor> listarFornecedores() {
        return fornecedorRepository.listAll();
    }

    @Transactional
    public void criarFornecedor(Fornecedor fornecedor) {
        if (!CNPJUtil.validarCNPJ(fornecedor.getCnpj())) {
            throw new IllegalArgumentException("CNPJ inválido");
        }
        
        boolean cnpjExistente = fornecedorRepository.find("cnpj", fornecedor.getCnpj()).firstResultOptional().isPresent();

        if (cnpjExistente) {
            throw new IllegalStateException("Já existe um fornecedor cadastrado com esse CNPJ.");
        }

        if (fornecedor.getId() == null) {
            fornecedorRepository.persist(fornecedor);
        } else {
            fornecedorRepository.getEntityManager().merge(fornecedor);
        }
    }

    public Fornecedor buscarFornecedorPorId(Long id) {
        Optional<Fornecedor> fornecedor = fornecedorRepository.findByIdOptional(id);
        return fornecedor.orElse(null);
    }

    @Transactional
    public void atualizarFornecedor(Long id, Fornecedor fornecedor) {
        Fornecedor fornecedorExistente = fornecedorRepository.findById(id);
        
        if (fornecedorExistente == null) {
            throw new NotFoundException("Fornecedor não encontrado.");
        }
        
        fornecedorExistente.setCodigo(fornecedor.getCodigo());
        fornecedorExistente.setRazaoSocial(fornecedor.getRazaoSocial());
        fornecedorExistente.setEmail(fornecedor.getEmail());
        fornecedorExistente.setTelefone(fornecedor.getTelefone());
        fornecedorExistente.setSituacao(fornecedor.getSituacao());
        fornecedorExistente.setDataBaixa(fornecedor.getDataBaixa());

        fornecedorRepository.persist(fornecedorExistente);
    }
    
    public boolean fornecedorTemMovimentacao(Long fornecedorId) {
        String hql = "SELECT COUNT(n) FROM NotaFiscal n WHERE n.fornecedor.id = :fornecedorId";
        long count = notaFiscalRepository.getEntityManager()
                                        .createQuery(hql, Long.class)
                                        .setParameter("fornecedorId", fornecedorId)
                                        .getSingleResult();
        return count > 0;
    }

    @Transactional
    public void excluirFornecedor(Long fornecedorId) {
        if (fornecedorTemMovimentacao(fornecedorId)) {
            throw new IllegalStateException("Não é possível excluir um fornecedor que já teve movimentação.");
        }

        Fornecedor fornecedor = fornecedorRepository.findById(fornecedorId);
        if (fornecedor != null) {
            fornecedorRepository.delete(fornecedor);
        } else {
            throw new EntityNotFoundException("Fornecedor não encontrado.");
        }
    }

    public List<Fornecedor> buscarPorCodigoOuRazaoSocial(String codigo, String razaoSocial) {
        return fornecedorRepository.buscarPorCodigoOuRazaoSocial(codigo, razaoSocial);
    }    

    public boolean fornecedorAtivo(Long fornecedorId) {
        Fornecedor fornecedor = fornecedorRepository.findById(fornecedorId);
        return fornecedor != null && fornecedor.getSituacao() == Fornecedor.Situacao.ATIVO;
    }
    
    
}