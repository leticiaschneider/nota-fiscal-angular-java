package com.exemplo.repository;

import java.util.List;

import com.exemplo.model.Fornecedor;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@ApplicationScoped
public class FornecedorRepository implements PanacheRepository<Fornecedor> {

    @PersistenceContext
    EntityManager em;

    public List<Fornecedor> findByCodigoContainingIgnoreCase(String term) {
        return em.createQuery("SELECT p FROM Fornecedor p WHERE LOWER(p.codigo) LIKE :term", Fornecedor.class)
                 .setParameter("term", "%" + term.toLowerCase() + "%")
                 .getResultList();
    }
    
    public List<Fornecedor> buscarPorCodigoOuRazaoSocial(String codigo, String razaoSocial) {
        String hql = "SELECT f FROM Fornecedor f WHERE f.codigo = :codigo OR f.razaoSocial LIKE :razaoSocial";
        return getEntityManager()
                .createQuery(hql, Fornecedor.class)
                .setParameter("codigo", codigo)
                .setParameter("razaoSocial", "%" + razaoSocial + "%") // Busca parcial
                .getResultList();
    }

}