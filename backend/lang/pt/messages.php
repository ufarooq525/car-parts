<?php

return [
    // Generico
    'success'              => 'Operacao concluida com sucesso.',
    'error_occurred'       => 'Ocorreu um erro.',
    'resource_created'     => 'Recurso criado com sucesso.',
    'resource_updated'     => 'Recurso atualizado com sucesso.',
    'resource_deleted'     => 'Recurso eliminado com sucesso.',
    'resource_not_found'   => 'Recurso nao encontrado.',
    'validation_failed'    => 'Os dados fornecidos sao invalidos.',
    'unauthorized'         => 'Nao autorizado.',
    'unauthenticated'      => 'Nao esta autenticado.',
    'forbidden'            => 'Nao tem permissao para realizar esta acao.',
    'server_error'         => 'Erro interno do servidor. Por favor, tente novamente mais tarde.',
    'route_not_found'      => 'O URL solicitado nao foi encontrado.',
    'method_not_allowed'   => 'O metodo HTTP nao e permitido para esta rota.',
    'model_not_found'      => 'O registo solicitado nao foi encontrado.',
    'business_error'       => 'Ocorreu um erro de logica de negocio.',
    'too_many_requests'    => 'Demasiados pedidos. Por favor, tente novamente mais tarde.',

    // Autenticacao
    'login_success'        => 'Sessao iniciada com sucesso.',
    'login_failed'         => 'Credenciais invalidas.',
    'logout_success'       => 'Sessao terminada com sucesso.',
    'register_success'     => 'Conta criada com sucesso.',
    'password_reset_sent'  => 'O link de recuperacao de palavra-passe foi enviado para o seu email.',
    'password_reset_success' => 'Palavra-passe redefinida com sucesso.',
    'email_verified'       => 'Email verificado com sucesso.',
    'token_refreshed'      => 'Token atualizado com sucesso.',

    // Produtos
    'product_created'      => 'Produto criado com sucesso.',
    'product_updated'      => 'Produto atualizado com sucesso.',
    'product_deleted'      => 'Produto eliminado com sucesso.',
    'product_not_found'    => 'Produto nao encontrado.',
    'product_out_of_stock' => 'Produto sem stock.',
    'product_hidden'       => 'Produto foi ocultado.',
    'product_visible'      => 'Produto esta agora visivel.',

    // Categorias
    'category_created'     => 'Categoria criada com sucesso.',
    'category_updated'     => 'Categoria atualizada com sucesso.',
    'category_deleted'     => 'Categoria eliminada com sucesso.',
    'category_not_found'   => 'Categoria nao encontrada.',
    'category_has_children' => 'Nao e possivel eliminar uma categoria que tem subcategorias.',
    'category_has_products' => 'Nao e possivel eliminar uma categoria que tem produtos.',

    // Fornecedores
    'supplier_created'     => 'Fornecedor criado com sucesso.',
    'supplier_updated'     => 'Fornecedor atualizado com sucesso.',
    'supplier_deleted'     => 'Fornecedor eliminado com sucesso.',
    'supplier_not_found'   => 'Fornecedor nao encontrado.',
    'supplier_sync_started' => 'A sincronizacao do fornecedor foi iniciada.',
    'supplier_sync_completed' => 'Sincronizacao do fornecedor concluida com sucesso.',
    'supplier_sync_failed' => 'A sincronizacao do fornecedor falhou.',

    // Encomendas
    'order_created'        => 'Encomenda efetuada com sucesso.',
    'order_updated'        => 'Encomenda atualizada com sucesso.',
    'order_cancelled'      => 'Encomenda cancelada com sucesso.',
    'order_not_found'      => 'Encomenda nao encontrada.',
    'order_status_updated' => 'Estado da encomenda atualizado com sucesso.',
    'order_cannot_cancel'  => 'Esta encomenda nao pode ser cancelada.',

    // Veiculos
    'vehicle_created'      => 'Veiculo criado com sucesso.',
    'vehicle_updated'      => 'Veiculo atualizado com sucesso.',
    'vehicle_deleted'      => 'Veiculo eliminado com sucesso.',
    'vehicle_not_found'    => 'Veiculo nao encontrado.',

    // Carrinho
    'cart_item_added'      => 'Artigo adicionado ao carrinho.',
    'cart_item_updated'    => 'Artigo do carrinho atualizado.',
    'cart_item_removed'    => 'Artigo removido do carrinho.',
    'cart_cleared'         => 'Carrinho limpo.',
    'cart_empty'           => 'O seu carrinho esta vazio.',

    // Regras de Margem
    'margin_rule_created'  => 'Regra de margem criada com sucesso.',
    'margin_rule_updated'  => 'Regra de margem atualizada com sucesso.',
    'margin_rule_deleted'  => 'Regra de margem eliminada com sucesso.',

    // Stock
    'stock_updated'        => 'Stock atualizado com sucesso.',
    'low_stock_alert'      => 'Alerta de stock baixo para :product.',

    // Sincronizacao
    'sync_in_progress'     => 'A sincronizacao ja esta em curso.',
    'sync_queued'          => 'A sincronizacao foi colocada em fila.',
];
