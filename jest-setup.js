// jest-setup.js

// Mock document.head.appendChild as it's used by the component's loadScript/loadStyle
// Even though we mock loadScript/loadStyle on the prototype, 
// this ensures the environment is prepared if any underlying LWC mechanisms 
// or other parts of the test setup interact with it.
document.head.appendChild = jest.fn();

// You can add other global mocks here if needed in the future.
