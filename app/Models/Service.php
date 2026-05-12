<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
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
