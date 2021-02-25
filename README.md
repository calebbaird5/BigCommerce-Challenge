# Codeing Challenge

## Link to the Store

## Sign up for a trial with BigCommerce and setup a test store.
This very simple. Not much to explain:

## Setup Stencil CLI
There was a very helpfule walk through for how to do this
[here](https://developer.bigcommerce.com/stencil-docs/installing-stencil-cli/installing-stencil).
The only challenge I had was in getting my version of node back to the supported version.
I also needed to clone the cornerstone theme and create credentials in the store to use for stencil.

## Create "Special Product" and assign to new category "Special Items"
This was very simple. The BigCommerce admin portal was intuitive and was easy to figure out.

## Display the second image when the product is hovered over.
The hardest part here was just becoming familiar with the code base, and with handlebars (which I had not seen before).<br>
The approach I took was to use handlebars to load the second image src into a data attribute of the image container. Then I could use jQuery to add the second image as a background image of the container and scss to hide the normal image and display the background image on hover.

## Create an "Add All Items" button at the top of the category page.
To accomplish this task I used handlebars to create the button and jQuery attach an event listener to make the API requests to add the items to the cart. After adding the items I used a simple alert to notify the customer.

## Create a "Remove All Items" button at the top of the category page when items are in the cart.
To accomplish this task I used handlebars to create the button, then used jQuery to determine if the cart had items in it and hide the button if there were none.
Then I created a jQuery event listener similar to the one for the "Add All Items" button to make the API requests to remove items from the cart.

## The Last part of the challange was a bonus portion to display information about the customer if they are logged in.

This was surprisingly easy and I accomplished it using only handlebars and scss.
