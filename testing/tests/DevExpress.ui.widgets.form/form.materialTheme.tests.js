import $ from 'jquery';
import 'ui/form/ui.form';

import 'common.css!';
import 'material_blue_light.css!';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';
    $('#qunit-fixture').html(markup);
});

QUnit.module('Form scenarios');
function createForm(colCount, items) {
    return $('#form').dxForm({
        width: 1000,
        screenByWidth: () => {
            return 'xs';
        },
        colCountByScreen: {
            xs: colCount
        },
        items
    });
}

const QUNIT_FIXTURE_OFFSET = -10000;
function checkPosition($element, expected) {
    const elementRect = $element.get(0).getBoundingClientRect();

    let epsilon = 0.01;
    QUnit.assert.roughEqual(elementRect.top, expected.top + QUNIT_FIXTURE_OFFSET, epsilon, 'top element offset');
    QUnit.assert.roughEqual(elementRect.left, expected.left + QUNIT_FIXTURE_OFFSET, epsilon, 'left element offset');
    QUnit.assert.roughEqual(elementRect.width, expected.width, epsilon, 'element width');
    QUnit.assert.roughEqual(elementRect.height, expected.height, epsilon, 'element height');
}

QUnit.test('1 column -> [item1]', function(assert) {
    // if(browser.chrome) {
    //     assert.ok('skip for single');
    // }
    const $form = createForm(1, ['item1']);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 76 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 32 });
});

QUnit.test('1 column -> [item1, item2]', function(assert) {
    const $form = createForm(1, ['item1', 'item2']);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 162 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 86, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 120, left: 0, width: 1000, height: 32 });
});

QUnit.test('1 column -> [item1, { group [{ item2 }] ]', function(assert) {
    const $form = createForm(1, [
        'item1',
        {
            itemType: 'group',
            items: ['item2']
        }]);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 162 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 86, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 120, left: 0, width: 1000, height: 32 });
});

QUnit.test('1 column -> [item1, { group [{ group [{ item2 }] }] ]', function(assert) {
    const $form = createForm(1, [
        'item1',
        {
            itemType: 'group',
            items: [{
                itemType: 'group',
                items: ['item2']
            }]
        }
    ]);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 162 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 86, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 120, left: 0, width: 1000, height: 32 });
});

QUnit.test('1 column -> [item1, item2, item3]', function(assert) {
    const $form = createForm(1, ['item1', 'item2', 'item3']);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 248 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 86, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 120, left: 0, width: 1000, height: 32 });
    checkPosition($form.find('[for$="item3"]'), { top: 172, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item3"]'), { top: 206, left: 0, width: 1000, height: 32 });
});

QUnit.test('1 column -> [item1, { group [{ group [{ item2 }] }], item3]', function(assert) {
    const $form = createForm(1, [
        'item1',
        {
            itemType: 'group',
            items: [{
                itemType: 'group',
                items: ['item2']
            }]
        },
        'item3'
    ]);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 248 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 86, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 120, left: 0, width: 1000, height: 32 });
    checkPosition($form.find('[for$="item3"]'), { top: 172, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item3"]'), { top: 206, left: 0, width: 1000, height: 32 });
});

QUnit.test('1 column -> [item1, { group [{ group [{ group [{item2 }] }] }], item3]', function(assert) {
    const $form = createForm(1, [
        'item1',
        {
            itemType: 'group',
            items: [
                {
                    itemType: 'group',
                    items: [
                        {
                            itemType: 'group',
                            items: ['item2']
                        }]
                }]
        },
        'item3'
    ]);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 248 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 86, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 120, left: 0, width: 1000, height: 32 });
    checkPosition($form.find('[for$="item3"]'), { top: 172, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item3"]'), { top: 206, left: 0, width: 1000, height: 32 });
});

QUnit.test('1 column -> [item1, { group [{ tabbed [{ item2 }] }] }]', function(assert) {
    const $form = createForm(1, [
        'item1',
        {
            itemType: 'group',
            caption: 'Contact Information',
            items: [
                {
                    itemType: 'tabbed',
                    tabPanelOptions: { deferRendering: false },
                    tabs: [
                        {
                            title: 'item2',
                            items: ['item2']
                        }]
                }]
        }]);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 321 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 205, left: 20, width: 960, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 239, left: 20, width: 960, height: 32 });
});

QUnit.test('1 column -> [item1, { group [{ tabbed [{ item2 }] }] }, item3]', function(assert) {
    const $form = createForm(1, [
        'item1',
        {
            itemType: 'group',
            caption: 'Contact Information',
            items: [
                {
                    itemType: 'tabbed',
                    tabPanelOptions: { deferRendering: false },
                    tabs: [
                        {
                            title: 'item2',
                            items: ['item2']
                        }]
                }]
        },
        'item3']);

    checkPosition($form, { top: 0, left: 0, width: 1000, height: 407 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 1000, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 205, left: 20, width: 960, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 239, left: 20, width: 960, height: 32 });
    checkPosition($form.find('[for$="item3"]'), { top: 331, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item3"]'), { top: 365, left: 0, width: 1000, height: 32 });
});

QUnit.test('2 columns -> [item1, item2]', function(assert) {
    const $form = createForm(2, ['item1', 'item2']);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 76 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 0, left: 520, width: 480, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 34, left: 520, width: 480, height: 32 });
});

QUnit.test('2 columns -> [item1, { group [{ item2 }] }]', function(assert) {
    const $form = createForm(2, [
        'item1',
        {
            itemType: 'group',
            items: ['item2']
        }
    ]);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 76 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 0, left: 520, width: 480, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 34, left: 520, width: 480, height: 32 });
});

QUnit.test('2 columns -> [item1, { group [{ group [{ item2 }] }] }]', function(assert) {
    const $form = createForm(2, [
        'item1',
        {
            itemType: 'group',
            items: [{
                itemType: 'group',
                items: ['item2']
            }]
        }
    ]);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 76 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 0, left: 520, width: 480, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 34, left: 520, width: 480, height: 32 });
});

QUnit.test('2 columns -> [{ group [{ item1 }], { group [{ item2 }]]', function(assert) {
    const $form = createForm(2, [
        {
            itemType: 'group',
            items: ['item1']
        },
        {
            itemType: 'group',
            items: ['item2']
        }
    ]);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 76 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 0, left: 520, width: 480, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 34, left: 520, width: 480, height: 32 });
});

QUnit.test('2 columns -> [{ group [{ { group [{ item1 }] }], { group [{ { group [{ item2 }] }]]', function(assert) {
    const $form = createForm(2, [
        {
            itemType: 'group',
            items: [{
                itemType: 'group',
                items: ['item1']
            }]
        },
        {
            itemType: 'group',
            items: [{
                itemType: 'group',
                items: ['item2']
            }]
        }
    ]);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 76 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 0, left: 520, width: 480, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 34, left: 520, width: 480, height: 32 });
});

QUnit.test('2 columns -> [item1, { group [{ group [{ item2 }] }], item3]', function(assert) {
    const $form = createForm(2, [
        'item1',
        {
            itemType: 'group',
            items: [{
                itemType: 'group',
                items: ['item2']
            }]
        },
        'item3'
    ]);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 162 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 0, left: 520, width: 480, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 34, left: 520, width: 480, height: 32 });
    checkPosition($form.find('[for$="item3"]'), { top: 86, left: 0, width: 480, height: 34 });
    checkPosition($form.find('[id$="item3"]'), { top: 120, left: 0, width: 480, height: 32 });
});

QUnit.test('2 columns -> [{ group [{ { group [{ item1 }] }], { group [{ { group [{ item2 }] }], { group [{ item3 }] }]', function(assert) {
    const $form = createForm(2, [
        {
            itemType: 'group',
            items: [{
                itemType: 'group',
                items: ['item1']
            }]
        },
        {
            itemType: 'group',
            items: [{
                itemType: 'group',
                items: ['item2']
            }]
        },
        {
            itemType: 'group',
            colCount: 1,
            items: ['item3']
        }
    ]);

    checkPosition($form, { top: 0, left: 0, width: 1000, height: 162 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 0, left: 520, width: 480, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 34, left: 520, width: 480, height: 32 });
    checkPosition($form.find('[for$="item3"]'), { top: 86, left: 0, width: 480, height: 34 });
    checkPosition($form.find('[id$="item3"]'), { top: 120, left: 0, width: 480, height: 32 });
});

QUnit.test('2 columns -> [{ group [{ item1 }], { group [{ item2 }], { group colspan:3 [{ item3 }] ]', function(assert) {
    const $form = createForm(2, [
        {
            itemType: 'group',
            colSpan: 1,
            items: ['item1']
        },
        {
            itemType: 'group',
            colSpan: 1,
            items: ['item2']
        },
        {
            itemType: 'group',
            colSpan: 2,
            items: ['item3']
        }
    ]);
    checkPosition($form, { top: 0, left: 0, width: 1000, height: 162 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 0, left: 520, width: 480, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 34, left: 520, width: 480, height: 32 });
    checkPosition($form.find('[for$="item3"]'), { top: 86, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item3"]'), { top: 120, left: 0, width: 1000, height: 32 });
});

QUnit.test('2 column -> [item1, { group [{ tabbed [{ item2 }] }] }]', function(assert) {
    const $form = createForm(2, [
        'item1',
        {
            itemType: 'group',
            caption: 'Contact Information',
            items: [
                {
                    itemType: 'tabbed',
                    tabPanelOptions: { deferRendering: false },
                    tabs: [{
                        title: 'item2',
                        items: ['item2']
                    }]
                }]
        }
    ]);

    checkPosition($form, { top: 0, left: 0, width: 1000, height: 235 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 119, left: 540, width: 440, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 153, left: 540, width: 440, height: 32 });
});

QUnit.test('2 column -> [item1, { group [{ tabbed [{ item2 }] }] }, item3]', function(assert) {
    const $form = createForm(2, [
        'item1',
        {
            itemType: 'group',
            caption: 'Contact Information',
            items: [
                {
                    itemType: 'tabbed',
                    tabPanelOptions: { deferRendering: false },
                    tabs: [
                        {
                            title: 'item2',
                            items: ['item2']
                        }]
                }]
        },
        'item3']);

    checkPosition($form, { top: 0, left: 0, width: 1000, height: 321 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 480, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 480, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 119, left: 540, width: 440, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 153, left: 540, width: 440, height: 32 });
    checkPosition($form.find('[for$="item3"]'), { top: 245, left: 0, width: 480, height: 34 });
    checkPosition($form.find('[id$="item3"]'), { top: 279, left: 0, width: 480, height: 32 });
});

QUnit.test('4 columns -> [{ group colSpan:3 [{ item1 }], { group colSpan:1 [{ item2 }], { group colspan:4 [{ item3 }] ]', function(assert) {
    const $form = createForm(4, [
        {
            itemType: 'group',
            colSpan: 3,
            items: ['item1']
        },
        {
            itemType: 'group',
            colSpan: 1,
            items: ['item2']
        },
        {
            itemType: 'group',
            colSpan: 4,
            items: ['item3']
        }
    ]);

    checkPosition($form, { top: 0, left: 0, width: 1000, height: 162 });
    checkPosition($form.find('[for$="item1"]'), { top: 0, left: 0, width: 730, height: 34 });
    checkPosition($form.find('[id$="item1"]'), { top: 34, left: 0, width: 730, height: 32 });
    checkPosition($form.find('[for$="item2"]'), { top: 0, left: 770, width: 230, height: 34 });
    checkPosition($form.find('[id$="item2"]'), { top: 34, left: 770, width: 230, height: 32 });
    checkPosition($form.find('[for$="item3"]'), { top: 86, left: 0, width: 1000, height: 34 });
    checkPosition($form.find('[id$="item3"]'), { top: 120, left: 0, width: 1000, height: 32 });
});
