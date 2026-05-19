<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_name',
        'price',
        'unit',
    ];

    public function transactions()
    {
        return $this->hasMany(Transactions::class);
    }
}
