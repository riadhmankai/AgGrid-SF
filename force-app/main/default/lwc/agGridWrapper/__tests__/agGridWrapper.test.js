import { createElement } from 'lwc';
import AgGridWrapper from 'c/agGridWrapper';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getGridData from '@salesforce/apex/AgGridDataController.getGridData';

// Register the Apex wire adapter
const getGridDataAdapter = registerApexTestWireAdapter(getGridData);

// Create a mock for the AG Grid API
const mockGridApi = {
    setRowData: jest.fn(),
    sizeColumnsToFit: jest.fn()
};

// Mock AG Grid library loading
global.window.agGrid = {
    createGrid: jest.fn().mockImplementation((div, options) => {
        // Simulate successful grid creation and call onGridReady if it exists
        if (options && typeof options.onGridReady === 'function') {
            options.onGridReady({ api: mockGridApi, columnApi: {} });
        }
        return { api: mockGridApi };
    })
};

// Create more sophisticated mocks for document methods
const origAppendChild = document.head.appendChild;
document.head.appendChild = jest.fn(element => {
    // For script and link elements, immediately fire their load event
    if (element && (element.tagName === 'SCRIPT' || element.tagName === 'LINK')) {
        setTimeout(() => {
            if (typeof element.onload === 'function') {
                element.onload();
            }
        }, 0);
    }
    return origAppendChild.call(document.head, element);
});

// Helper function to wait for async operations
async function flushPromises() {
    return new Promise(resolve => setTimeout(resolve, 0));
}

describe('c-ag-grid-wrapper', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Reset mocks
        jest.clearAllMocks();
    });

    it('renders the grid container div', () => {
        // Arrange
        const element = createElement('c-ag-grid-wrapper', {
            is: AgGridWrapper
        });

        // Act
        document.body.appendChild(element);

        // Assert
        const div = element.shadowRoot.querySelector('.ag-grid-container');
        expect(div).not.toBeNull();
    });

    it('loads AG Grid scripts and styles on render', async () => {
        // Arrange
        const element = createElement('c-ag-grid-wrapper', {
            is: AgGridWrapper
        });
        
        // Act
        document.body.appendChild(element);
        
        // Need to wait for all promises in the component to resolve
        await flushPromises(); // Wait for renderedCallback
        await flushPromises(); // Wait for loadStyle/loadScript promises
        await flushPromises(); // Wait for script/style load events to trigger
        
        // Assert
        expect(document.head.appendChild).toHaveBeenCalled();
        expect(window.agGrid.createGrid).toHaveBeenCalled();
    });

    it('displays error message if Apex call fails', async () => {
        // Arrange
        const APEX_ERROR = { body: { message: 'An error occurred' } };
        
        const consoleErrorSpy = jest.spyOn(console, 'error');
        
        const element = createElement('c-ag-grid-wrapper', {
            is: AgGridWrapper
        });

        // Act
        document.body.appendChild(element);
        
        // Emit the error from the mock wire adapter
        getGridDataAdapter.error(APEX_ERROR);
        await flushPromises(); // Wait for wire handler to process

        // Assert
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(element.error).not.toBeUndefined();
        
        // Clean up
        consoleErrorSpy.mockRestore();
    });

    it('sets row data when Apex returns data', async () => {
        // Arrange
        const MOCK_DATA = [
            {
                Id: '001xx000003DGgPAAW',
                Name: 'Test Account 1',
                AccountNumber: 'ACC123',
                Owner: { Name: 'Test Owner' },
                AnnualRevenue: 1000000,
                BillingStreet: '123 Main St',
                BillingCity: 'Testville',
                BillingState: 'TS',
                BillingPostalCode: '12345',
                BillingCountry: 'Testland',
                Phone: '123-456-7890'
            }
        ];
        
        const element = createElement('c-ag-grid-wrapper', {
            is: AgGridWrapper
        });

        // Act
        document.body.appendChild(element);
        
        // Simulate loading and initialization of the grid
        await flushPromises();
        await flushPromises();
        await flushPromises();
        
        // Clear previous calls to mockGridApi to isolate our test
        mockGridApi.setRowData.mockClear();
        
        // Emit data from the mock wire adapter after initialization
        getGridDataAdapter.emit(MOCK_DATA);
        await flushPromises(); // Wait for wire handler to process

        // Assert
        // Check that the mock API's setRowData was called with the mock data
        expect(mockGridApi.setRowData).toHaveBeenCalledWith(MOCK_DATA);
    });
});