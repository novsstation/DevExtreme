import { WrapperBase } from './wrapperBase.js';

const FOCUS_OVERLAY_POSTFIX_CLASS = "focus-overlay";
const COMMAND_ADAPTIVE_CLASS = "dx-command-adaptive";
const COMMAND_ADAPTIVE_HIDDEN_CLASS = "dx-command-adaptive-hidden";
const FILTER_BUILDER_CLASS = "dx-filterbuilder";
const FILTER_BUILDER_GROUP_CLASS = "dx-filterbuilder-group";
const FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = "dx-filterbuilder-item-value-text";
const FILTER_BUILDER_TEXT_PART_CLASS = "dx-filterbuilder-text-part";
const HEADER_FILTER_MENU_CLASS = "dx-header-filter-menu";
const LIST_ITEM_CLASS = "dx-list-item";
const BUTTON_CLASS = "dx-button";
const FOCUSED_ROW_CLASS = "dx-row-focused";
const DATA_GRID_PREFIX = "dx-datagrid";
const TREELIST_PREFIX = "dx-treelist";

class GridWrapper {
    constructor(containerSelector, widgetPrefix) {
        this.pager = new PagerWrapper(containerSelector, widgetPrefix);
        this.filterPanel = new FilterPanelWrapper(containerSelector, widgetPrefix);
        this.headerPanel = new HeaderPanelWrapper(containerSelector, widgetPrefix);
        this.headers = new HeadersWrapper(containerSelector, widgetPrefix);
        this.filterRow = new FilterRowWrapper(containerSelector, widgetPrefix);
        this.rowsView = new RowsViewWrapper(containerSelector, widgetPrefix);
        this.filterBuilder = new FilterBuilderWrapper("BODY", widgetPrefix);
        this.columns = new ColumnWrapper(containerSelector, widgetPrefix);
    }

    isEditorCell($cell) {
        return $cell.hasClass('dx-editor-cell');
    }
}

export class DataGridWrapper extends GridWrapper {
    constructor(containerSelector) {
        super(containerSelector, DATA_GRID_PREFIX);
    }
}

export class TreeListWrapper extends GridWrapper {
    constructor(containerSelector) {
        super(containerSelector, TREELIST_PREFIX);
    }
}

class GridElement extends WrapperBase {
    constructor(containerSelector, widgetPrefix = "dx-datagrid") {
        super(containerSelector);
        this.widgetPrefix = widgetPrefix;
    }
}

export class ColumnWrapper extends GridElement {
    getCommandButtons() {
        return this.getContainer().find("td[class*='dx-command'] .dx-link");
    }
}

export class RowsViewWrapper extends GridElement {
    constructor(containerSelector, widgetPrefix) {
        super(containerSelector);
        this.widgetPrefix = widgetPrefix;
    }

    getElement() {
        return this.getContainer().find(`.${this.widgetPrefix}-rowsview`);
    }

    getVirtualRowElement() {
        return this.getContainer().find(":not(.dx-datagrid-table-fixed) .dx-virtual-row");
    }

    getVirtualCell(columnIndex) {
        return this.getVirtualRowElement().find("td").eq(columnIndex);
    }

    getRowElement(rowIndex) {
        return this.getElement().find(":not(.dx-datagrid-table-fixed) .dx-row").eq(rowIndex);
    }

    getFixedDataRowElement(rowIndex) {
        return this.getElement().find(".dx-datagrid-table-fixed .dx-data-row").eq(rowIndex);
    }

    getCellElement(rowIndex, columnIndex) {
        return this.getElement().find(".dx-data-row").eq(rowIndex).find("td").eq(columnIndex);
    }

    getDataRowElement(rowIndex) {
        return this.getElement().find(":not(.dx-datagrid-table-fixed) .dx-data-row").eq(rowIndex);
    }

    getDataCellElement(rowIndex, columnIndex) {
        return this.getDataRowElement(rowIndex).find("td").eq(columnIndex);
    }

    getFixedDataCellElement(rowIndex, columnIndex) {
        return this.getFixedDataRowElement(rowIndex).find("td").eq(columnIndex);
    }

    getDataRowElementCount() {
        return this.getElement().find(":not(.dx-datagrid-table-fixed) .dx-data-row").length;
    }

    getRowAdaptiveElement(rowIndex) {
        return this.getDataRowElement(rowIndex).find(`.${COMMAND_ADAPTIVE_CLASS}`);
    }

    isRowAdaptiveVisible(rowIndex) {
        return !this.getRowAdaptiveElement(rowIndex).hasClass(COMMAND_ADAPTIVE_HIDDEN_CLASS);
    }

    getEditorInputElement(rowIndex, columnIndex) {
        return this.getCellElement(rowIndex, columnIndex).find(".dx-texteditor-input");
    }

    hasEditorInputElement(rowIndex, columnIndex) {
        return this.getEditorInputElement(rowIndex, columnIndex).length > 0;
    }

    getSelectionCheckBoxElement(rowIndex) {
        return this.getDataRowElement(rowIndex).find(".dx-select-checkbox");
    }

    isRowVisible(rowIndex, precision) {
        const $row = this.getRowElement(rowIndex);
        return this._isInnerElementVisible($row, precision);
    }

    isRowFocused(rowIndex) {
        return this.getDataRowElement(rowIndex).hasClass(FOCUSED_ROW_CLASS);
    }

    _isInnerElementVisible($element, precision = 0) {
        const rowsViewRect = this.getElement()[0].getBoundingClientRect();
        const elementRect = $element[0].getBoundingClientRect();
        const diffTop = Math.floor(elementRect.top - rowsViewRect.top) + precision;
        const diffBottom = Math.floor(rowsViewRect.bottom - elementRect.bottom) + precision;

        return diffTop >= 0 && diffBottom >= 0;
    }

    cellHasFocusedClass(rowIndex, columnIndex) {
        return this.getCellElement(rowIndex, columnIndex).hasClass("dx-focused");
    }

    findFocusOverlay() {
        return this.getElement().find(`.${this.widgetPrefix}-${FOCUS_OVERLAY_POSTFIX_CLASS}`);
    }

    isFocusOverlayVisible() {
        const $focusOverlay = this.findFocusOverlay();
        return $focusOverlay.length && !this.findFocusOverlay().hasClass("dx-hidden");
    }

    getFocusedRow() {
        return this.getElement().find(`.${FOCUSED_ROW_CLASS}`);
    }

    hasFocusedRow() {
        return this.getFocusedRow().length > 0;
    }
}

export class PagerWrapper extends GridElement {
    constructor(containerSelector, widgetPrefix) {
        super(containerSelector, widgetPrefix);
        this.PAGE_SIZES_SELECTOR = `.${this.widgetPrefix}-pager .dx-page-sizes`;
        this.PAGES_SELECTOR = `.${this.widgetPrefix}-pager .dx-pages`;
    }

    getElement() {
        return this.getContainer().find(`.${this.widgetPrefix}-pager`);
    }

    getPagerPageSizeElements() {
        return this.getContainer().find(`${this.PAGE_SIZES_SELECTOR} > .dx-page-size`);
    }

    getPagerPageSizeElement(index) {
        return this.getPagerPageSizeElements().eq(index);
    }

    getPagerPageChooserElement() {
        return this.getContainer().find(`${this.PAGES_SELECTOR}`);
    }
    getPagerPagesElements() {
        return this.getPagerPageChooserElement().find(".dx-page");
    }
    getPagerPageElement(index) {
        return this.getPagerPagesElements().eq(index);
    }
    getPagerButtonsElements() {
        return this.getPagerPageChooserElement().find(".dx-navigate-button");
    }
    getNextButtonsElement() {
        return this.getPagerPageChooserElement().find(".dx-next-button");
    }
    getPrevButtonsElement() {
        return this.getPagerPageChooserElement().find(".dx-prev-button");
    }

    isFocusedState() {
        return this.getElement().hasClass("dx-state-focused");
    }
}

export class FilterPanelWrapper extends GridElement {
    getElement() {
        return this.getContainer().find(`.${this.widgetPrefix}-filter-panel`);
    }

    getIconFilter() {
        return this.getElement().find(".dx-icon-filter");
    }

    getPanelText() {
        return this.getElement().find(`.${this.widgetPrefix}-filter-panel-text`);
    }

    getClearFilterButton() {
        return this.getElement().find(`.${this.widgetPrefix}-filter-panel-clear-filter`);
    }
}

export class FilterRowWrapper extends GridElement {
    getElement() {
        return this.getContainer().find(`.${this.widgetPrefix}-filter-row`).eq(0);
    }

    getTextEditorInput(index) {
        return this.getElement().find(".dx-texteditor-input").eq(index);
    }

    getEditorCell(index) {
        return this.getElement().find(".dx-editor-cell").eq(index);
    }

    getMenuElement(index) {
        return this.getEditorCell(index).find(".dx-menu");
    }
}

export class HeaderPanelWrapper extends GridElement {
    getElement() {
        return this.getContainer().find(`.${this.widgetPrefix}-header-panel`);
    }

    getGroupPanelElement() {
        return this.getElement().find(`.${this.widgetPrefix}-group-panel`);
    }

    getGroupPanelItem(index) {
        return this.getGroupPanelElement().find(".dx-group-panel-item").eq(index);
    }
}

export class HeadersWrapper extends GridElement {
    getElement() {
        return this.getContainer().find(`.${this.widgetPrefix}-headers`);
    }

    getHeaderItem(rowIndex, columnIndex) {
        return this.getElement().find(".dx-header-row").eq(rowIndex).find("td").eq(columnIndex);
    }

    getHeaderItemTextContent(rowIndex, columnIndex) {
        return this.getHeaderItem(rowIndex, columnIndex).find(`.${this.widgetPrefix}-text-content`).eq(0).text();
    }

    getHeaderFilterItem(rowIndex, columnIndex) {
        return this.getHeaderItem(rowIndex, columnIndex).find(".dx-header-filter");
    }
}

export class FilterBuilderWrapper extends GridElement {
    constructor(containerSelector) {
        super(containerSelector);
        this.headerFilterMenu = new HeaderFilterMenu(containerSelector);
    }

    getElement() {
        return this.getContainer().find(`.${FILTER_BUILDER_CLASS}.dx-widget`);
    }

    getItemValueTextElement(index = 0) {
        return this.getElement().find(`.${FILTER_BUILDER_GROUP_CLASS}:nth-child(${index + 1})`).find(`.${FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS}`);
    }

    getItemValueTextParts(index = 0) {
        return this.getItemValueTextElement(index).find(`.${FILTER_BUILDER_TEXT_PART_CLASS}`);
    }
}

export class HeaderFilterMenu extends GridElement {
    getElement() {
        return this.getContainer().find(`.${HEADER_FILTER_MENU_CLASS}`);
    }

    getDropDownListItem(index) {
        return this.getElement().find(`.${LIST_ITEM_CLASS}:nth-child(${index + 1})`);
    }

    getButtonOK() {
        return this.getElement().find(`.${BUTTON_CLASS}[aria-label='OK']`);
    }
}
