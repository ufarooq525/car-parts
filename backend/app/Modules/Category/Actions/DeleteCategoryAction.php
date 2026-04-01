<?php

namespace App\Modules\Category\Actions;

use App\Core\Exceptions\BusinessException;
use App\Modules\Category\Models\Category;

class DeleteCategoryAction
{
    /**
     * Soft-delete a category after checking constraints.
     */
    public function execute(Category $category): bool
    {
        if ($category->children()->exists()) {
            throw new BusinessException('category::messages.category_has_children');
        }

        if ($category->products()->exists()) {
            throw new BusinessException('category::messages.category_has_products');
        }

        return $category->delete();
    }
}
