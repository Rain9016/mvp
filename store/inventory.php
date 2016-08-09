<?php

namespace Store;

require_once __DIR__ . '/../backend/store/cart.php';

$cart = get_cart();

$i = $_GET['id'] ?? $_POST['id'] ?? false;
$v = $_GET['variant'] ?? $_POST['variant'] ?? false;
$m = $_GET['math'] ?? $_POST['math'] ?? 'add';
$q = $_GET['quantity'] ?? $_POST['quantity'] ?? 1;
$s = $_GET['simple'] ?? $_POST['simple'] ?? false;

if ($m === 'show') {
   echo json_encode($cart);
   return;
}

if ($i === false) {
    echo 'Missing product id';
    return;
}

if ($v === false) {
    echo 'Missing variant id';
    return;
}

if ($m === 'add') {
    try {
        set_add($i, $v, $q);
    } catch (Exception $e) {
        echo 'Unable to add to cart';
        return;
    }
}

if ($s) {
    echo 'OK';
} else {
    header("Location: https://$_SERVER[HTTP_HOST]/store/");
}
