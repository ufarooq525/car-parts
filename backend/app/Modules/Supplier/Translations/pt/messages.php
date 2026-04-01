<?php

return [
    // Mensagens de fornecedor
    'suppliers_listed'       => 'Fornecedores listados com sucesso.',
    'supplier_found'         => 'Fornecedor encontrado com sucesso.',
    'supplier_not_found'     => 'Fornecedor nao encontrado.',
    'supplier_created'       => 'Fornecedor criado com sucesso.',
    'supplier_updated'       => 'Fornecedor atualizado com sucesso.',
    'supplier_deleted'       => 'Fornecedor excluido com sucesso.',
    'supplier_has_products'  => 'Nao e possivel excluir o fornecedor porque possui produtos vinculados.',
    'sync_triggered'         => 'Sincronizacao do fornecedor iniciada com sucesso.',

    // Mensagens de regra de margem
    'margin_rules_listed'    => 'Regras de margem listadas com sucesso.',
    'margin_rule_created'    => 'Regra de margem criada com sucesso.',
    'margin_rule_updated'    => 'Regra de margem atualizada com sucesso.',
    'margin_rule_deleted'    => 'Regra de margem excluida com sucesso.',

    // Mensagens de validacao
    'validation_name_required'          => 'O nome do fornecedor e obrigatorio.',
    'validation_name_max'               => 'O nome do fornecedor nao pode exceder 255 caracteres.',
    'validation_code_required'          => 'O codigo do fornecedor e obrigatorio.',
    'validation_code_unique'            => 'O codigo do fornecedor ja esta em uso.',
    'validation_type_required'          => 'O tipo do fornecedor e obrigatorio.',
    'validation_type_in'                => 'O tipo do fornecedor deve ser: api, xml ou csv.',
    'validation_api_endpoint_url'       => 'O endpoint da API deve ser uma URL valida.',
    'validation_feed_url_url'           => 'A URL do feed deve ser uma URL valida.',
    'validation_sync_interval_min'      => 'O intervalo de sincronizacao deve ser de pelo menos 15 minutos.',
    'validation_supplier_id_exists'     => 'O fornecedor selecionado nao existe.',
    'validation_category_id_exists'     => 'A categoria selecionada nao existe.',
    'validation_margin_type_required'   => 'O tipo de margem e obrigatorio.',
    'validation_margin_type_in'         => 'O tipo de margem deve ser percentual ou fixo.',
    'validation_margin_value_required'  => 'O valor da margem e obrigatorio.',
    'validation_margin_value_min'       => 'O valor da margem deve ser pelo menos 0.',
];
