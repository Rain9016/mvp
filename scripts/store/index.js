/**
 * scripts/store/index.js
 * Does logic for picking product variants and adding to cart
 */

if (typeof products === 'undefined' || products.length === 0) {
    console.error('Unable to find store data')

    var products = null
    $.getJSON('data/store.json', function (data) {
        console.log('Was able to fetch store data manually')

        products = data
    })
}

/**
 * Opens product modal on image click
 */
$('.grid--product .grid__item img').on('click', function (e) {
    if (e.target !== this) return
    e.preventDefault()

    var $trigger = $(this).closest('.grid__item').find('.open-modal')

    $trigger.leanModal({
        top: '5vh',
        overlayOpacity: 0.5,
        closeButton: '.close-modal'
    })
    $trigger.click()
})

/**
 * Updates product variance based on user input (size, color, etc)
 */
$('.modal--product form[action$="inventory"] select').on('change', function (e) {
    var $f = $(this).closest('form')
    var $m = $f.closest('.modal')

    var i = $f.find('input[name="id"]').val()
    var s = $f.find('select[name="size"]').val()
    var c = $f.find('select[name="color"]').val()

    var p = products[i]

    if (p == null) {
        $('.alert--error', $f).text('Unable to find product')
        $('input[type="submit"]', $f).prop('disabled', true)
        return
    }

    for (var v in p['variants']) {
        var variant = p['variants'][v]

        if (s != null && variant['size'] !== s) continue
        if (c != null && variant['color'] !== c) continue

        $f.find('input[name="variant"]').val(variant['id'])
        $m.find('.modal__price').text('$' + parseFloat(variant['price']).toFixed(2))

        if (variant['image'] != null) {
            $m.find('img').prop('src', variant['image'])
        } else {
            $m.find('img').prop('src', p['image'])
        }

        $('.alert--error', $f).text('')
        $('input[type="submit"]', $f).prop('disabled', false)

        return
    }

    $('.alert--error', $f).text('Unable to find variant')
    $('input[type="submit"]', $f).prop('disabled', true)
})

/**
 * Intercepts product form so we don't refresh the page every addition to cart
 */

$('.modal--product form[action$="inventory"]').on('submit', function (e) {
    e.preventDefault()

    var $f = $(this)
    var $m = $f.closest('.modal')

    $.post($f.attr('action'), $f.serialize() + '&simple=true')
    .done(function (data, status) {
        if (data !== 'OK') {
            $('.alert--error', $f).text('Unable to add to cart')
            console.error('Error while adding item to cart')
            console.error(data)
            return
        }

        $('.alert--error', $f).text('')
        console.log('Added item to cart')

        $f.find('input[name="quantity"]').val('1')
        $m.find('.close-modal').click()
    })
    .fail(function (err) {
        $('.alert--error', $f).text('Error adding cart')
        console.error('Error adding an item to cart')
        console.error(err.responseText)
        return
    })
})
