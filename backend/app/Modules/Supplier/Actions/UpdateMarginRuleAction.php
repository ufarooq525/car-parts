<?php

namespace App\Modules\Supplier\Actions;

use App\Modules\Supplier\Models\MarginRule;

class UpdateMarginRuleAction
{
    /**
     * Update an existing margin rule.
     */
    public function execute(MarginRule $rule, array $data): MarginRule
    {
        $rule->update($data);

        return $rule->fresh();
    }
}
