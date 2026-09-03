<?php
// Modules/Procurement/app/Repositories/SupplierRepository.php

namespace Modules\Procurement\app\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Procurement\App\Models\Supplier;
use Modules\Procurement\App\Repositories\Contracts\SupplierRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class SupplierRepository implements SupplierRepositoryInterface
{
  public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = Supplier::query()
      ->when($filters['search'] ?? null, function ($q, $search) {
        return $q->where(function ($query) use ($search) {
          $query->where('name', 'like', "%{$search}%")
            ->orWhere('code', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%")
            ->orWhere('contact_person', 'like', "%{$search}%");
        });
      })
      ->when($filters['status'] ?? null, function ($q, $status) {
        return $q->where('is_active', $status === 'active');
      })
      ->latest();

    return $query->paginate($perPage);
  }

  public function find(int $id): ?Supplier
  {
    return Cache::remember("supplier:{$id}", 3600, function () use ($id) {
      return Supplier::find($id);
    });
  }

  public function create(array $data): Supplier
  {
    $supplier = Supplier::create($data);
    Cache::forget("supplier:{$supplier->id}");
    return $supplier;
  }

  public function update(int $id, array $data): Supplier
  {
    $supplier = Supplier::findOrFail($id);
    $supplier->update($data);
    Cache::forget("supplier:{$id}");
    return $supplier->fresh();
  }

  public function delete(int $id): void
  {
    $supplier = Supplier::findOrFail($id);
    $supplier->delete();
    Cache::forget("supplier:{$id}");
  }

  public function findByCode(string $code): ?Supplier
  {
    return Supplier::where('code', $code)->first();
  }
}
