// Coffee Menu
const coffeeMenu = [
    { id: 1, name: "Americano", price: 3.50 },
    { id: 2, name: "Caramel Latte", price: 4.75 },
    { id: 3, name: "Iced Caramel Coffee", price: 4.25 },
    { id: 4, name: "Matcha Latte", price: 5.00 },
    { id: 5, name: "Flat White", price: 4.00 },
    { id: 6, name: "Espresso", price: 1.50 },
    { id: 7, name: "Mocha Ice Coffee", price: 2.00 },
    { id: 8, name: "Cappuccino", price: 1.00 },
    { id: 9, name: "Turkish Coffee", price: 1.50 },
    { id: 10, name: "Caramel Coffee", price: 2.50 },
    { id: 11, name: "Caffè Latte", price: 2.00 },
    { id: 12, name: "Ice Coffee", price: 2.50 }
];

document.addEventListener('DOMContentLoaded', function() {
    
    // all elements 
    var coffeeSelect = document.getElementById('coffeeSelect');
    var quantity = document.getElementById('quantity');
    var customerName = document.getElementById('customerName');
    var customerEmail = document.getElementById('customerEmail');
    var customerPhone = document.getElementById('customerPhone');
    var customerAddress = document.getElementById('customerAddress');
    var priceDisplay = document.getElementById('priceDisplay');
    var orderForm = document.getElementById('orderForm');
    var feedbackMessage = document.getElementById('feedbackMessage');
    var orderSummaryBox = document.getElementById('orderSummary');
    var orderConfirmationBox = document.getElementById('orderConfirmation');
    var addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // dropdown menu
    
    if (coffeeSelect) {
        coffeeMenu.forEach(function(coffee) {
            var newOption = document.createElement('option');
            newOption.value = coffee.id;
            newOption.textContent = coffee.name + ' - $' + coffee.price.toFixed(2);
            coffeeSelect.appendChild(newOption);
        });
    }

    function updatePrice() {
        if (!coffeeSelect || !quantity || !priceDisplay) {
            return;
        }

        var selectedId = parseInt(coffeeSelect.value, 10);
        var qty = parseInt(quantity.value, 10);
        var selectedCoffee = coffeeMenu.find(function(coffee) {
            return coffee.id === selectedId;
        });

        if (selectedCoffee && qty > 0) {
            var total = selectedCoffee.price * qty;
            priceDisplay.textContent = '$' + total.toFixed(2);
        } else {
            priceDisplay.textContent = '$0.00';
        }
    }

    
    
    // Update price when coffee selection changes
    if (coffeeSelect) {
        coffeeSelect.addEventListener('change', updatePrice);
    }

    // Update price when quantity changes
    if (quantity) {
        quantity.addEventListener('input', updatePrice);
    }

    // Initialize price display on page load
    updatePrice();

    
    if (!orderForm || !feedbackMessage || !orderSummaryBox || !orderConfirmationBox) {
        return;
    }

    // Helper function to show feedback messages
    
    function showFeedback(message, isError) {
        feedbackMessage.style.display = 'block';
        
        // Create the message with icon
        var icon = isError ? '✕' : '✓';
        var iconColor = isError ? 'text-red-500' : 'text-green-500';
        
        // Build the HTML with icon and left border accent
        feedbackMessage.innerHTML = 
            '<div class="flex items-center relative">' +
            '<div class="absolute left-0 top-0 bottom-0 w-1 rounded-l ' + (isError ? 'bg-red-500' : 'bg-green-500') + ' opacity-50"></div>' +
            '<div class="flex-1 pr-4">' + message + '</div>' +
            '<div class="' + iconColor + ' text-2xl font-bold flex-shrink-0">' + icon + '</div>' +
            '</div>';

        // Style it as error (red) or success (green) using Tailwind CSS classes
        if (isError) {
            // Error feedback box with Tailwind classes
            feedbackMessage.className = 'mb-6 py-5 pr-6 pl-8 rounded-2xl border-2 border-red-500 ' +
                'bg-gradient-to-r from-red-50 to-red-100 text-red-900 font-semibold ' +
                'shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 ' +
                'hover:-translate-y-0.5 transition-all duration-300 animate-slide-down ' +
                'text-sm sm:text-base relative overflow-hidden';
        } else {
            // Success feedback box with Tailwind classes
            feedbackMessage.className = 'mb-6 py-5 pr-6 pl-8 rounded-2xl border-2 border-green-500 ' +
                'bg-gradient-to-r from-green-50 to-green-100 text-green-900 font-semibold ' +
                'shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 ' +
                'hover:-translate-y-0.5 transition-all duration-300 animate-slide-down ' +
                'text-sm sm:text-base relative overflow-hidden';
        }
    }

    // Add to Cart button clicks
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var coffeeIdText = button.getAttribute('data-coffee-id');
            var coffeeId = parseInt(coffeeIdText, 10);
            var selectedCoffee = coffeeMenu.find(function(coffee) {
                return coffee.id === coffeeId;
            });

            if (selectedCoffee && coffeeSelect) {
                coffeeSelect.value = String(selectedCoffee.id);

                updatePrice();
                showFeedback(
                    selectedCoffee.name + ' was added to your order. Scroll down to finish the form.',
                    false
                );
                // Scroll smoothly to the order form
                orderForm.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3) Form submission
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var errors = [];

        // Validate coffee selection
        if (!coffeeSelect || coffeeSelect.value === '0' || coffeeSelect.value === '') {
            errors.push('Please select a coffee.');
        }

        // Validate quantity
        var qtyText = quantity.value.trim();
        var qtyNumber = parseInt(qtyText, 10);

        if (isNaN(qtyNumber) || qtyNumber < 1 || qtyNumber > 50) {
            errors.push('Quantity must be a number between 1 and 50.');
        }

        // Validate Customer Name 
        if (!customerName || customerName.value.trim() === '') {
            errors.push('Full name is required.');
        } else {
            var nameValue = customerName.value.trim();
            
            if (nameValue.length < 2) {
                errors.push('Name must be at least 2 characters long.');
            }
            
            if (nameValue.length > 50) {
                errors.push('Name must be no more than 50 characters.');
            }
            
            var namePattern = /^[a-zA-Z\s]+$/;
            if (!namePattern.test(nameValue)) {
                errors.push('Name can only contain letters and spaces. No numbers or special characters allowed.');
            }
        }

        // Validate email
        if (!customerEmail || customerEmail.value.trim() === '') {
            errors.push('Email address is required.');
        } else {
            var emailValue = customerEmail.value.trim();
            if (emailValue.indexOf('@') === -1 || emailValue.indexOf('.') === -1) {
                errors.push('Please enter a valid email address.');
            }
        }

        // Validate Phone Number 

        if (!customerPhone || customerPhone.value.trim() === '') {
            errors.push('Phone number is required.');
        } else {
            var phoneValue = customerPhone.value.trim();
            
            
            var phoneDigitsOnly = phoneValue.replace(/[\s\-\(\)\+]/g, '');
            
            if (phoneDigitsOnly.length < 10) {
                errors.push('Phone number must have at least 10 digits.');
            }
            
            if (phoneDigitsOnly.length > 15) {
                errors.push('Phone number must have no more than 15 digits.');
            }
            
           
            var phonePattern = /^\d+$/;
            if (!phonePattern.test(phoneDigitsOnly)) {
                errors.push('Phone number can only contain numbers and formatting characters (spaces, dashes, parentheses, +).');
            }
        }

        // Validate address
        if (!customerAddress || customerAddress.value.trim() === '') {
            errors.push('Delivery address is required.');
        }

       
        if (errors.length > 0) {
            var errorHtml = errors.join('<br>');
            showFeedback(errorHtml, true);

            orderSummaryBox.style.display = 'none';
            orderConfirmationBox.style.display = 'none';
            return;
        }

        
        // Find the selected coffee
        var selectedCoffeeId = parseInt(coffeeSelect.value, 10);
        var coffeeForSummary = coffeeMenu.find(function(coffee) {
            return coffee.id === selectedCoffeeId;
        });

        var totalPrice = 0;
        var coffeeNameForSummary = '';

        if (coffeeForSummary) {
            totalPrice = coffeeForSummary.price * qtyNumber;
            coffeeNameForSummary = coffeeForSummary.name;
        }

        // Build and show order summary
        orderSummaryBox.innerHTML =
            '<h3 class="text-xl font-bold mb-2">Order Summary</h3>' +
            '<p><strong>Coffee:</strong> ' + coffeeNameForSummary + '</p>' +
            '<p><strong>Quantity:</strong> ' + qtyNumber + '</p>' +
            '<p><strong>Total Price:</strong> $' + totalPrice.toFixed(2) + '</p>';
        orderSummaryBox.style.display = 'block';

        // Build and show confirmation message
        orderConfirmationBox.innerHTML =
            '<h3 class="text-xl font-bold mb-2">Order Confirmation</h3>' +
            '<p>Thank you, ' + customerName.value.trim() + '!</p>' +
            '<p>Your order is being prepared and will be delivered to:</p>' +
            '<p>' + customerAddress.value.trim() + '</p>';
        orderConfirmationBox.style.display = 'block';

        // Show success feedback message
        showFeedback('Your order looks good! Please review the summary below. Form will reset in 7 seconds...', false);

        setTimeout(function() {
            // Reset all form fields
            if (orderForm) {
                orderForm.reset();
            }
            
            // Reset coffee select to default
            if (coffeeSelect) {
                coffeeSelect.value = '0';
            }
            
            // Reset quantity to 1
            if (quantity) {
                quantity.value = '1';
            }
            
            // Reset price display
            if (priceDisplay) {
                priceDisplay.textContent = '$0.00';
            }
            
            // Hide summary and confirmation boxes
            orderSummaryBox.style.display = 'none';
            orderConfirmationBox.style.display = 'none';
            
            // Hide feedback message
            feedbackMessage.style.display = 'none';
            
            // Show a message that form was reset
            showFeedback('Form has been reset. You can place a new order!', false);
            
            // Hide the reset message after 3 seconds
            setTimeout(function() {
                feedbackMessage.style.display = 'none';
            }, 3000);
        }, 7000); 
    });

});
