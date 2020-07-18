//name of suite
context('loveverySampleSuite', () => {

  //this is a cypress hook. before each test, redirect to https://lovevery-kits.myshopify.com/. This can be saved as a custom command to use in all tests
  beforeEach(() => {
    cy.visit('https://lovevery-kits.myshopify.com/')
    //assertion to verify landing page
    .get('.template-index').should('be.visible')
  })

// This function is a for loop that randomizes characters to generate a string set to the limit sepcified in the test when 'randomString' is called. There are multiple ways to handle randomizing emails or strings, cypress has a lot of add-on tools that will generate randomized data but I wanted write something of my own for this. This function can also be stored as a custom command to be used over all tests/suites.
function generateRandom(string_length) {
    let randomString = "";
    let random_ascii;

    for(let i = 0; i < string_length; i++) {
      random_ascii = Math.floor((Math.random() * 25) + 97);
      randomString += String.fromCharCode(random_ascii)
    }
    return randomString
  }
// Depending on whether or not we use the page object model, stuff like this would be stored in each page object to help keep the tests clean.
  var domain = '@gmail.com'
  var fname = 'lydia'
  var lname = 'graves'
  var randomString = generateRandom(10)
  var vemail = 'veroalucard@gmail.com'
  var vpassword = 'Hiruka#646'

  // 'it' is a cypress command, which is the start of each test. There are a variety of these commands that do the same thing, like: "describe", "it", "context", and "specify". there are multiple 'it' calls in each suite, one for each new test. each one is entitled with a short description of what the test does.

  it('create a new user account', () => {

    cy.get('.nav-item.menu-sign-in').click()
      .get('.template-login').should('be.visible')
      .get('a[href*="/account/register"]').click()
      .get('.template-register').should('be.visible')

      .get('#FirstName').type(fname)

      .get('#LastName').type(lname)

      .get('#Email').type(randomString).type(domain).then(($useremail) => {
        const email = $useremail.text()
      })

      .get('#CreatePassword').type(randomString).then(($userpw) => {
        const password = $userpw.text()
      })

      .get('.btn.btn-default.btn-fullwidth').should('contain', 'Join Us').click()
      .get('.nav-item').should('contain', fname)
  })
    // when you see .eq(1-4), that means there are multiple instances of the selector that is called. .eq specifies which one on the page should be selected. This is easier than creating a specific id for each duplicated element within a webpage.

    it('shop play gym', () => {
      cy.get('a[href*="/products/the-play-gym"]').eq(2).click()
      .get('body#the-play-gym-a-baby-activity-playmat-by-lovevery').should('be.visible')
      .get('.input-quantity-btn.add').click()
      .get('#Quantity').should('have.value', '2')

      .get('button.btn.btn.btn-default.js-add-to-cart-button.btn-product-add').click()

      .get('.input-default.input-quantity.no-margin.js-quantity').should('have.value', '2')

      .get('.btn.btn-default.btn-fullwidth.btn-lg.cart-checkout-btn').click()

      .get('#CustomerEmail').type(vemail)
      .get('#CustomerPassword').type(vpassword)
      .get('input.btn.btn-default.btn-fullwidth').eq(0).click()

      .get('.order-summary-toggle_inner').should('be.visible')
      .get('#checkout_shipping_address_first_name').should('have.value', 'vero')
      .get('#checkout_shipping_address_last_name').should('have.value', 'hager')

      .get('#checkout_shipping_address_address1').type('1234 waldo st.')
      .get('#checkout_shipping_address_city').type('boise')
      .get('#checkout_shipping_address_country').should('have.value', 'United States')
      .get('#checkout_shipping_address_province').should('have.value', 'Idaho')
      .get('checkout_shipping_address_zip').type('83702')
      .get('#continue_button').click()

      .get('.order-summary-toggle__text.order-summary-toggle__text--show').should('be.visible')

      .get('.review-block__content').should('have.value', 'veroalucard@gmail.com')

      .get('.address.address--tight').should('have.value', '123 waldo st., boise ID 83702, United States')

      .get('.radio__label').should('eq', 'true')

      .get('#continue_button').click()

      .get('.order-summary__sections').click()

      .get('#checkout_shipping_address_address1').type('123 waldo st.')

      // There's an uncaught exception error here, the test fails and I am unable to continue. There is a way around this but it requires access to the API. Cypress is in the middle of providing an API that will ignore all uncaught exceptions for a local API test. But until then, we'll have to find a workaround

      // For the shopify authentication in checkouts and purchases, we can research options like stubbing the server to grab the mobile authentication before it hits the server, store in something like a json file and use that number to authenticate without having an actual device to pull the auth code from. This needs research.
    })

    it('subscribe to playkits', () => {

        // {force:true} this forces cypress to select hidden elements, which is handy for selecting dropdowns, which is always a pain.

      cy.get('a[href*="/products/the-play-kits"]').eq(0).click({force:true})

      .get('#play-kits-subscription-program').should('be.visible')

      // baby persona would be stored as a custom command so that this block wouldn't have to be repeated in every test.
      .get('#baby-name').type('jane doe')
      .get('.input-date.input-default').eq(0).select('September')
      .get('.input-date.input-default').eq(1).select('9')
      .get('.input-date.input-default').eq(2).select('2019')
      .get('a[href*="/pages/subscription"]').click()

      .get('.btn.btn-default.subscription-next.wizard-button').click()
      .get('.tick-icon-table').eq(1).click()
      .get('.inline').eq(1).click()
      .get('.subscription-next.btn.btn-default.wizard-button').click()

      // There is another uncaught exception here and I can't continue. I think it has something to do with authentication, but I'll include a stack trace in the email.
    })
})
