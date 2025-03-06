package com.exemplo.resource;

import com.exemplo.model.NotaFiscal;
import com.exemplo.model.NotaFiscalItem;
import com.exemplo.service.NotaFiscalService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;

@Path("/notas-fiscais")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class NotaFiscalResource {

    @Inject
    NotaFiscalService notaFiscalService;

    @GET
    public List<NotaFiscal> listarNotasFiscais() {
        return notaFiscalService.listarNotasFiscais();
    }

    @POST
public Response criarNotaFiscal(NotaFiscal notaFiscal) {
    try {
        List<NotaFiscalItem> itens = notaFiscal.getItens();
        notaFiscalService.salvarNotaFiscal(notaFiscal, itens);
        return Response.status(Response.Status.CREATED).build();
    } catch (IllegalArgumentException e) {
        return Response.status(Response.Status.BAD_REQUEST)
                       .entity(e.getMessage())  // Retorna a mensagem de erro
                       .build();
    } catch (Exception e) {
        return Response.serverError().entity(e.getMessage()).build();
    }
}

@PUT
@Path("/{id}")
public Response atualizarNotaFiscal(@PathParam("id") Long id, NotaFiscal notaFiscal) {
    try {
        notaFiscalService.atualizarNotaFiscal(notaFiscal);
        return Response.ok().build();
    } catch (IllegalArgumentException e) {
        return Response.status(Response.Status.BAD_REQUEST)
                       .entity(e.getMessage())  // Retorna a mensagem de erro
                       .build();
    } catch (Exception e) {
        return Response.serverError().entity(e.getMessage()).build();
    }
}


    @GET
@Path("/{id}")
public Response buscarNotaFiscalPorId(@PathParam("id") Long id) {
    Optional<NotaFiscal> notaFiscal = notaFiscalService.buscarNotaFiscalPorId(id);
    
    if (notaFiscal.isEmpty()) {
        return Response.status(Response.Status.NOT_FOUND)
                       .entity("Nota Fiscal não encontrada")
                       .build();
    }
    
    return Response.ok(notaFiscal.get()).build();
}


    @DELETE
    @Path("/{id}")
    public Response excluirNotaFiscal(@PathParam("id") Long id) {
        notaFiscalService.excluirNotaFiscal(id);
        return Response.noContent().build();
    }
    
}