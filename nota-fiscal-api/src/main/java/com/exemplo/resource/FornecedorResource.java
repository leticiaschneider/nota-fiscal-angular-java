package com.exemplo.resource;

import com.exemplo.model.Fornecedor;
import com.exemplo.service.FornecedorService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/fornecedor")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FornecedorResource {

    @Inject
    FornecedorService fornecedorService;

    @GET
    public List<Fornecedor> listarFornecedores() {
        return fornecedorService.listarFornecedores();
    }

    @POST
    public Response criarFornecedor(Fornecedor fornecedor) {
        fornecedorService.criarFornecedor(fornecedor);
        return Response.status(Response.Status.CREATED).build();
    }

    @GET
    @Path("/{id}")
    public Response buscarFornecedorPorId(@PathParam("id") Long id) {
        Fornecedor fornecedor = fornecedorService.buscarFornecedorPorId(id);
        
        if (fornecedor == null) {
            return Response.status(Response.Status.NOT_FOUND)
                        .entity("Fornecedor não encontrado")
                        .build();
        }
         return Response.ok(fornecedor).build();
    }

    @PUT
    @Path("/{id}")
    public Response atualizarFornecedor(@PathParam("id") Long id, Fornecedor fornecedor) {
        fornecedorService.atualizarFornecedor(id, fornecedor);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    public Response excluirFornecedor(@PathParam("id") Long id) {
        fornecedorService.excluirFornecedor(id);
        return Response.noContent().build();
    }

    @GET
    @Path("/search")
    public Response buscarFornecedor(@QueryParam("codigo") String codigo, @QueryParam("razaoSocial") String razaoSocial) {
        List<Fornecedor> fornecedores = fornecedorService.buscarPorCodigoOuRazaoSocial(codigo, razaoSocial);
        
        if (fornecedores.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                        .entity("Nenhum fornecedor encontrado.")
                        .build();
        }

        return Response.ok(fornecedores).build();
    }

}