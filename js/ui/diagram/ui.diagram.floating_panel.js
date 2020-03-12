import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { hasWindow } from '../../core/utils/window';
import Popup from '../popup';

import DiagramPanel from './ui.diagram.panel';

const DIAGRAM_MOBILE_POPUP_CLASS = 'dx-diagram-mobile-popup';

class DiagramFloatingPanel extends DiagramPanel {
    _init() {
        super._init();

        this._createOnVisibilityChangingAction();
        this._createOnVisibilityChangedAction();
    }
    isVisible() {
        return this.option('isVisible');
    }
    isMobileView() {
        return this.option('isMobileView');
    }
    _initMarkup() {
        super._initMarkup();

        const $parent = this.$element();

        const $popupElement = $('<div>')
            .addClass(this._getPopupClass())
            .addClass(this.isMobileView() && DIAGRAM_MOBILE_POPUP_CLASS)
            .appendTo($parent);

        this._popup = this._createComponent($popupElement, Popup, this._getPopupOptions());
        this._updatePopupVisible();
    }
    show() {
        this.option('isVisible', true);
    }
    hide() {
        this.option('isVisible', false);
    }
    toggle() {
        this.option('isVisible', !this.isVisible());
    }

    _getPopupContent() {
        return this._popup.content();
    }
    _getPointerUpElement() {
        return this._getPopupContent();
    }
    _getVerticalPaddingsAndBorders() {
        const $content = $(this._getPopupContent());
        return $content.outerHeight() - $content.height();
    }
    _getHorizontalPaddingsAndBorders() {
        const $content = $(this._getPopupContent());
        return $content.outerWidth() - $content.width();
    }
    _getPopupClass() {
        return '';
    }
    _getPopupWidth() {
        return Math.max(this.option('width'), this._getPopupMinWidth()) || 'auto';
    }
    _getPopupWidthOption() {
        return this._getPopupWidth() || 'auto';
    }
    _getPopupMinWidth() {
        return 0;
    }
    _getPopupHeightOption() {
        return this._getPopupHeight() || 'auto';
    }
    _getPopupHeight() {
        return Math.max(this.option('height'), this._getPopupMinHeight()) || 'auto';
    }
    _getPopupMinHeight() {
        return 0;
    }
    _getPopupPosition() {
        return {};
    }
    _getPopupSlideAnimationObject(properties) {
        return extend({
            type: 'slide',
            start: () => { $('body').css('overflow', 'hidden'); },
            complete: () => { $('body').css('overflow', ''); },
        }, properties);
    }
    _getPopupAnimation() {
        return {
            hide: { type: 'fadeOut' },
            show: { type: 'fadeIn' },
        };
    }
    _getPopupOptions() {
        const that = this;
        return {
            animation: hasWindow() ? this._getPopupAnimation() : null,
            shading: false,
            showTitle: false,
            focusStateEnabled: false,
            width: this._getPopupWidthOption(),
            height: this._getPopupHeightOption(),
            position: this._getPopupPosition(),
            onContentReady: function() {
                that._renderPopupContent(that._popup.content());
            },
            onShowing: () => {
                this._onVisibilityChangingAction({ visible: true, component: this });
            },
            onShown: () => {
                this.option('isVisible', true);
                this._onVisibilityChangedAction({ visible: true, component: this });
            },
            onHiding: () => {
                this._onVisibilityChangingAction({ visible: false, component: this });
            },
            onHidden: () => {
                this.option('isVisible', false);
                this._onVisibilityChangedAction({ visible: false, component: this });
            }
        };
    }
    _renderPopupContent($parent) {
    }
    _updatePopupVisible() {
        this._popup.option('visible', this.isVisible());
    }
    _createOnVisibilityChangingAction() {
        this._onVisibilityChangingAction = this._createActionByOption('onVisibilityChanging');
    }
    _createOnVisibilityChangedAction() {
        this._onVisibilityChangedAction = this._createActionByOption('onVisibilityChanged');
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'onVisibilityChanging':
                this._createOnVisibilityChangingAction();
                break;
            case 'onVisibilityChanged':
                this._createOnVisibilityChangedAction();
                break;
            case 'width':
                this._popup.option('width', this._getPopupWidthOption());
                break;
            case 'height':
                this._popup.option('height', this._getPopupHeightOption());
                break;
            case 'isMobileView':
                this._invalidate();
                break;
            case 'isVisible':
                this._updatePopupVisible();
                break;
            default:
                super._optionChanged(args);
        }
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            isVisible: true,
            isMobileView: false,
            offsetX: 0,
            offsetY: 0
        });
    }
}
module.exports = DiagramFloatingPanel;
