package com.exemplo.resource;

import com.exemplo.model.Produto;
import com.exemplo.service.ProdutoService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/produtos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProdutoResource {

    @Inject
    ProdutoService produtoService;

    @GET
    public List<Produto> listarProdutos() {
        return produtoService.listarProdutos();
    }

    @GET
    @Path("/{id}")
    public Response buscarProdutoPorId(@PathParam("id") Long id) {
        Produto produto = produtoService.buscarProdutoPorId(id);
        
        if (produto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                        .entity("Produto não encontrado")
                        .build();
        }
         return Response.ok(produto).build();
    }

    @POST
    public Response criarProduto(Produto produto) {
        produtoService.criarProduto(produto);
        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/{id}")
    public Response atualizarProduto(@PathParam("id") Long id, Produto produto) {
        produtoService.atualizarProduto(produto);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    public Response excluirProduto(@PathParam("id") Long id) {
        try {
            produtoService.excluirProduto(id);
            return Response.ok().build();
        } catch (IllegalStateException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(e.getMessage())
                .build();
        }
    }

    @GET
    @Path("/search")
    public List<Produto> searchProducts(@QueryParam("term") String term) {
        return produtoService.searchByDescricaoOuCodigo(term);
    }

}