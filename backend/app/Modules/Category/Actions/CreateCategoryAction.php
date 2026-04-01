<?php

namespace App\Modules\Category\Actions;

use App\Modules\Category\Models\Category;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CreateCategoryAction
{
    /**
     * Create a new category.
     */
    public function execute(array $data): Category
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $data['image']->store('categories', 'public');
        }

        return Category::create($data);
    }
}
