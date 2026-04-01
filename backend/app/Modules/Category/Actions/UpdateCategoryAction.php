<?php

namespace App\Modules\Category\Actions;

use App\Modules\Category\Models\Category;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdateCategoryAction
{
    /**
     * Update an existing category.
     */
    public function execute(Category $category, array $data): Category
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }

            $data['image'] = $data['image']->store('categories', 'public');
        }

        $category->update($data);

        return $category->fresh();
    }
}
