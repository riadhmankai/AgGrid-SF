import { createElement } from 'lwc';
import AgGridWrapper from 'c/agGridWrapper';
import getGridData from '@salesforce/apex/AgGridDataController.getGridData';

// Mock the Apex wire adapter
jest.mock(
    '@salesforce/apex/AgGridDataController.getGridData',
    () => {
        const {
            createApexTestWireAdapter
        } = require('@salesforce/wire-service-jest-util');
        return {
            default: createApexTestWireAdapter(jest.fn())
        };
    },
    { virtual: true }
);

// Mock the component's specific load methods BEFORE the describe block
AgGridWrapper.prototype.loadScript = jest.fn(() => Promise.resolve());
AgGridWrapper.prototype.loadStyle = jest.fn(() => Promise.resolve());

// Mock the AG Grid library and its methods globally for Jest
let gridOptionsPassedToCreateGrid;
const mockGridApi = {
    setRowData: jest.fn(),
    sizeColumnsToFit: jest.fn(),
};
const mockColumnApi = {};

global.agGrid = {
    createGrid: jest.fn((container, options) => {
        gridOptionsPassedToCreateGrid = options;
        // Simulate async grid ready callback using microtasks
        Promise.resolve().then(() => {
            if (gridOptionsPassedToCreateGrid && gridOptionsPassedToCreateGrid.onGridReady) {
                gridOptionsPassedToCreateGrid.onGridReady({
                    api: mockGridApi,
                    columnApi: mockColumnApi,
                });
            }
        });
        return { api: mockGridApi, columnApi: mockColumnApi };
    }),
    Grid: jest.fn().mockImplementation(() => ({
        api: mockGridApi,
        columnApi: mockColumnApi
    }))
};

describe('c-ag-grid-wrapper', () => {
    // Use Jest timers
    jest.useFakeTimers();

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
        gridOptionsPassedToCreateGrid = undefined;
        // Reset timers after each test
        jest.clearAllTimers();
    });

    // Helper function to wait for promises and timers
    async function advanceTimersAndFlushPromises() {
        // Run pending timers (like setTimeout, setInterval)
        jest.runOnlyPendingTimers();
        // Yield to allow microtasks (Promise resolutions) to process
        // eslint-disable-next-line no-undef
        await Promise.resolve();
        // Run timers again in case promises scheduled more timers
        jest.runOnlyPendingTimers();
        // Yield again for safety
        // eslint-disable-next-line no-undef
        await Promise.resolve();
    }

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
        expect(div.classList.contains('ag-theme-alpine')).toBe(true);
    });

    it('loads AG Grid scripts and styles on render via component methods', async () => {
        // Arrange
        const element = createElement('c-ag-grid-wrapper', {
            is: AgGridWrapper
        });

        // Act
        document.body.appendChild(element);

        // Wait for renderedCallback, mocked loadScript/loadStyle, and grid init
        await advanceTimersAndFlushPromises();

        // Assert
        // Check that the component's methods were called
        expect(AgGridWrapper.prototype.loadStyle).toHaveBeenCalledTimes(2); // Called for base and theme CSS
        expect(AgGridWrapper.prototype.loadScript).toHaveBeenCalledTimes(1);

        // Check that grid initialization was attempted after scripts loaded
        expect(global.agGrid.createGrid).toHaveBeenCalled();
        const gridContainer = element.shadowRoot.querySelector('.ag-grid-container');
        expect(global.agGrid.createGrid).toHaveBeenCalledWith(gridContainer, expect.any(Object));
    });

    it('displays error message if Apex call fails', async () => {
        // Arrange
        const element = createElement('c-ag-grid-wrapper', {
            is: AgGridWrapper
        });
        document.body.appendChild(element);

        // Wait for initial render and script loading
        await advanceTimersAndFlushPromises();

        // Simulate error from Apex wire adapter
        const errorPayload = { message: 'Apex Error', status: 500 };
        getGridData.error(errorPayload);

        // Wait for component update
        await advanceTimersAndFlushPromises();

        // Assert
        const errorDiv = element.shadowRoot.querySelector('.slds-notify_alert');
        expect(errorDiv).not.toBeNull();
        const errorMsg = element.shadowRoot.querySelector('h2');
        expect(errorMsg).not.toBeNull(); // Check if the h2 tag exists
        // Check if the *body* of the error property matches the payload
        expect(element.error.body).toEqual(errorPayload);
    });

    it('sets row data when Apex returns data', async () => {
        // Arrange
        const mockData = [{ Id: '1', Name: 'Test Account' }];
        let element = createElement('c-ag-grid-wrapper', {
            is: AgGridWrapper
        });
        document.body.appendChild(element);

        // Wait for initial render, script loading, and grid initialization (onGridReady)
        await advanceTimersAndFlushPromises();

        // Simulate data from Apex wire adapter AFTER grid is ready
        getGridData.emit(mockData);

        // Wait for component update triggered by wire adapter
        await advanceTimersAndFlushPromises();

        // Assert
        expect(mockGridApi.setRowData).toHaveBeenCalledWith(mockData);
        expect(mockGridApi.sizeColumnsToFit).toHaveBeenCalled();
    });
});
