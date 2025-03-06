package com.exemplo.repository;

import com.exemplo.model.Produto;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;

@ApplicationScoped
public class ProdutoRepository implements PanacheRepository<Produto> {
    
    @PersistenceContext
    EntityManager em;

    public List<Produto> findByCodigoContainingIgnoreCase(String term) {
        return em.createQuery("SELECT p FROM Produto p WHERE LOWER(p.codigo) LIKE :term", Produto.class)
                 .setParameter("term", "%" + term.toLowerCase() + "%")
                 .getResultList();
    }

    public List<Produto> searchByDescricaoOuCodigo(String term) {
        return find("lower(descricao) LIKE ?1 OR lower(codigo) LIKE ?2", 
                    "%" + term.toLowerCase() + "%", 
                    "%" + term.toLowerCase() + "%").list();
    }
}