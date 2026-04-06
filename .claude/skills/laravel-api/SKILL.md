---
name: laravel-api
description: Laravel backend conventions for the car-parts store. Module-based architecture, repository pattern, form requests, API resources. Use when creating or modifying backend code, API endpoints, controllers, models, or migrations.
---

# Car Parts Store - Laravel Backend Conventions

## Module Architecture
All features live in `backend/app/Modules/{ModuleName}/`:
```
Modules/
  Product/
    Controllers/ProductController.php
    Models/Product.php
    Repositories/ProductRepository.php
    Requests/StoreProductRequest.php, UpdateProductRequest.php
    Resources/ProductResource.php, ProductListResource.php
    Routes/api.php
    Actions/  (optional, for complex business logic)
  Auth/, Cart/, Category/, Order/, Supplier/, Vehicle/
```

## Route Patterns
- **Admin routes**: `Route::prefix('admin/{resource}')->middleware(['auth:sanctum'])->group(...)`
- **Public routes**: No auth middleware
- **Customer routes**: `middleware(['auth:sanctum'])`
- Register module routes in `backend/routes/api.php` via `require`

## Controller Pattern
```php
class ResourceController extends Controller {
    public function __construct(private ResourceRepository $repository) {}

    public function index(Request $request) {
        $data = $this->repository->getFiltered($request->all(), $request->get('per_page', 15));
        return ResourceListResource::collection($data);
    }

    public function store(StoreResourceRequest $request) {
        $item = $this->repository->create($request->validated());
        return new ResourceResource($item);
    }

    public function show($id) {
        $item = $this->repository->findOrFail($id);
        return new ResourceResource($item);
    }

    public function update(UpdateResourceRequest $request, $id) {
        $item = $this->repository->update($id, $request->validated());
        return new ResourceResource($item);
    }

    public function destroy($id) {
        $this->repository->delete($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
```

## Repository Pattern
- All database queries go through repositories, NOT controllers
- Use `withCount()` instead of eager loading for counts (avoids N+1)
- Use `with()` for relations that will be accessed
- Use `when()` for conditional filters:
```php
$query->when($filters['search'] ?? null, fn($q, $s) => $q->where('name', 'like', "%{$s}%"));
```

## Model Conventions
- Use `SoftDeletes` trait on all main models
- Use `HasScopes` trait for reusable query scopes
- Define `$fillable` array (never use `$guarded = []`)
- Relations: `belongsTo`, `hasMany`, `belongsToMany` with proper foreign keys
- Cast JSON columns: `protected $casts = ['config' => 'array']`

## Database Migrations
- Filename: `YYYY_MM_DD_NNNNNN_create_{table}_table.php` or `_add_{feature}_to_{table}_table.php`
- Always add indexes on: foreign keys, frequently filtered columns, compound queries
- Use `$table->softDeletes()` on main entity tables
- Use `$table->timestamps()` on all tables

## API Response Format
- Lists: `return ResourceCollection::collection($paginated)` (auto-wraps with `data`, `meta`, `links`)
- Single: `return new ResourceResource($item)` (wraps with `data`)
- Errors: `return response()->json(['message' => '...'], 4xx)`

## Authentication
- Laravel Sanctum for API tokens
- `auth:sanctum` middleware for protected routes
- User roles: `admin`, `staff`, `customer` (enum on users table)
- Will use Spatie Laravel Permission package for role/permission management
