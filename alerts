// alerts.js

function createAlert(message, type = 'success', duration = 3000) {
    // Create alert container if it doesn't exist
    let alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.classList.add('alert-container');
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '50px';
        alertContainer.style.right = '20px';
        alertContainer.style.zIndex = '1050';
        alertContainer.style.width = 'auto';
        document.body.appendChild(alertContainer);
    }

    // Create alert element
    const alert = document.createElement('div');
    alert.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show', 'mt-2');
    alert.setAttribute('role', 'alert');
    alert.style.minWidth = '200px';

    // Create alert content
    const alertContent = document.createElement('div');
    alertContent.classList.add('d-flex');

    const alertIcon = document.createElement('div');
    alertIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon alert-icon">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M5 12l5 5l10 -10"/>
        </svg>
    `;

    const alertText = document.createElement('div');
    alertText.innerText = message;

    alertContent.appendChild(alertIcon);
    alertContent.appendChild(alertText);
    alert.appendChild(alertContent);

    // Create close button
    const closeButton = document.createElement('a');
    closeButton.classList.add('btn-close');
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'close');

    alert.appendChild(closeButton);

    // Append alert to container
    alertContainer.appendChild(alert);

    // Remove alert after specified duration
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alert.remove();
        }, 150); // Wait for fade out transition
    }, duration);
}

// Example usage:
// createAlert('This is a success message!', 'success', 5000);
// createAlert('This is a warning message!', 'warning');
// createAlert('This is an info message!', 'info', 4000);
