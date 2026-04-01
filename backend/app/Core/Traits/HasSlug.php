<?php

namespace App\Core\Traits;

use Illuminate\Support\Str;

trait HasSlug
{
    /**
     * Boot the trait - auto-generate slug on creating
     */
    protected static function bootHasSlug(): void
    {
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = $model->generateUniqueSlug($model->getSlugSource());
            }
        });
    }

    /**
     * Get the source field for slug generation
     */
    protected function getSlugSource(): string
    {
        return $this->{$this->slugFrom ?? 'name'};
    }

    /**
     * Generate a unique slug
     */
    protected function generateUniqueSlug(string $source): string
    {
        $slug = Str::slug($source);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
