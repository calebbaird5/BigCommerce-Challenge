import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import { createTranslationDictionary } from '../theme/common/utils/translations-utils';

export default class Category extends CatalogPage {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
    }

    setLiveRegionAttributes($element, roleType, ariaLiveStatus) {
        $element.attr({
            role: roleType,
            'aria-live': ariaLiveStatus,
        });
    }

    makeShopByPriceFilterAccessible() {
        if (!$('[data-shop-by-price]').length) return;

        if ($('.navList-action').hasClass('is-active')) {
            $('a.navList-action.is-active').focus();
        }

        $('a.navList-action').on('click', () => this.setLiveRegionAttributes($('span.price-filter-message'), 'status', 'assertive'));
    }

    onReady() {

      fetch('/api/storefront/cart', {
        credentials: 'include'
      }).then(response =>  {
        return response.json();
      }).then(cartItems => {
        if (cartItems.length === 0) {
          $('#remove-all-items').parent().parent().hide();
        }
      });
        this.arrangeFocusOnSortBy();

        $('[data-button-type="add-cart"]').on('click', (e) => this.setLiveRegionAttributes($(e.currentTarget).next(), 'status', 'polite'));

        this.makeShopByPriceFilterAccessible();

        compareProducts(this.context.urls);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        $('a.reset-btn').on('click', () => this.setLiveRegionsAttributes($('span.reset-message'), 'status', 'polite'));

        this.ariaNotifyNoProducts();

      let productImgContainer = $('.card-img-container');
      productImgContainer.each((i, el) => {
        el.style.backgroundImage = "url(" + el.dataset.secondImageSrc + ")";
      });

      // Add all to cart
      $('#add-all-to-cart').click(event => {
        let productIds = JSON.parse(event.target.dataset.products);

        if (productIds && productIds.length > 0) {
          Promise.all(
            productIds.map(productId => {
              return fetch('/cart.php?action=add&product_id=' + productId);
            })

          ).then((values) => {
            alert(`The product${values.length > 1 ? 's were': ' was'} successfully added to your cart.`);

            // Reload the page to get the cart number icon to refresh
            // There is probably a better way but this will suffice for now.
            location.reload();

          }).catch((error) => {
            console.error(error);
          });
        }
      });

      $('#remove-all-items').click(event => {
        fetch('/api/storefront/cart', {
          credentials: 'include'
        }).then(response =>  {
          return response.json();
        }).then(cartItems => {

          Promise.all(
            cartItems.map(item => {
              return fetch('/api/storefront/carts/' + item.id, {
                credentials: 'include',
                method: 'DELETE',
              });
            })
          ).then(values => {
            alert('All items in cart have been removed.');

            // Reload page to get the cart number icon to update.
            // There is probably a better way but this will suffice for now.
            location.reload();

          }) .catch(error => {
            console.error(error);
          });
        });
      });
    }

    ariaNotifyNoProducts() {
        const $noProductsMessage = $('[data-no-products-notification]');
        if ($noProductsMessage.length) {
            $noProductsMessage.focus();
        }
    }

    initFacetedSearch() {
        const {
            price_min_evaluation: onMinPriceError,
            price_max_evaluation: onMaxPriceError,
            price_min_not_entered: minPriceNotEntered,
            price_max_not_entered: maxPriceNotEntered,
            price_invalid_value: onInvalidPrice,
        } = this.validationDictionary;
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        }, {
            validationErrorMessages: {
                onMinPriceError,
                onMaxPriceError,
                minPriceNotEntered,
                maxPriceNotEntered,
                onInvalidPrice,
            },
        });
    }
}
