/* global DATA, data2, internals, initTree */
import TreeViewTestWrapper from "../../../helpers/TreeViewTestHelper.js";
import $ from "jquery";

QUnit.module("Checkboxes", () => {
    function createWrapper(config, options, items) {
        const result = $.extend({}, config, options, { dataStructure: "plain", rootValue: ROOT_ID, showCheckBoxesMode: "normal" });
        if(result.dataSourceOption === 'createChildren') {
            const createChildFunction = (parent) => {
                const parentId = (parent !== null)
                    ? parent.itemData.id
                    : result.rootValue;
                return items.filter(function(item) { return parentId === item.parentId; });
            };
            result.createChildren = createChildFunction;
        } else {
            result[config.dataSourceOption] = items;
        }
        return new TreeViewTestWrapper(result);
    }

    function isLazyDataSourceMode(wrapper) {
        const options = wrapper.instance.option();
        return options.dataSource && options.virtualModeEnabled || options.createChildren;
    }

    QUnit.test("Set intermediate state for parent if at least a one child is selected", function(assert) {
        var data = $.extend(true, [], DATA[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;
        var $treeView = initTree({
            items: data,
            showCheckBoxesMode: "normal"
        });

        var checkboxes = $treeView.find(".dx-checkbox");
        $(checkboxes[4]).trigger("dxclick");

        assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), true);
        assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), undefined);
        assert.equal($(checkboxes[1]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);
    });

    QUnit.test("selectNodesRecursive = false", function(assert) {
        var data = $.extend(true, [], DATA[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;

        var $treeView = initTree({
            items: data,
            selectNodesRecursive: false,
            showCheckBoxesMode: "normal"
        });

        var checkboxes = $treeView.find(".dx-checkbox");
        $(checkboxes[4]).trigger("dxclick");

        assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), true);
        assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[1]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[0]).dxCheckBox("instance").option("value"), false);
    });

    QUnit.test("Remove intermediate state from parent if all children are unselected", function(assert) {
        var data = $.extend(true, [], DATA[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;

        var $treeView = initTree({
            items: data,
            showCheckBoxesMode: "normal"
        });

        var checkboxes = $treeView.find(".dx-checkbox");
        $(checkboxes[4]).trigger("dxclick");
        $(checkboxes[3]).trigger("dxclick");
        $(checkboxes[4]).trigger("dxclick");

        assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), true);
        assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), undefined);
        assert.equal($(checkboxes[1]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);

        $(checkboxes[3]).trigger("dxclick");
        assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[1]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[0]).dxCheckBox("instance").option("value"), false);
    });

    QUnit.test("Parent node should be selected if all children are selected", function(assert) {
        var data = $.extend(true, [], DATA[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;
        var $treeView = initTree({
            items: data,
            showCheckBoxesMode: "normal"
        });

        var checkboxes = $treeView.find(".dx-checkbox");
        $(checkboxes[4]).trigger("dxclick");
        $(checkboxes[3]).trigger("dxclick");

        assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), true);
        assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), true);
        assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), true);
        assert.equal($(checkboxes[1]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);
    });

    QUnit.test("All children should be selected/unselected after click on parent node", function(assert) {
        var data = $.extend(true, [], DATA[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;
        var $treeView = initTree({
            items: data,
            showCheckBoxesMode: "normal"
        });

        var checkboxes = $treeView.find(".dx-checkbox");

        $(checkboxes[2]).trigger("dxclick");

        assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), true);
        assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), true);
        assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), true);

        $(checkboxes[2]).trigger("dxclick");

        assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), false);
        assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), false);
    });

    QUnit.test("Regression: incorrect parent state", function(assert) {
        var data = $.extend(true, [], data2);
        data[2].expanded = true;

        var $treeView = initTree({
            dataSource: data,
            dataStructure: "plain",
            showCheckBoxesMode: "normal"
        });

        var checkboxes = $treeView.find(".dx-checkbox");

        $(checkboxes[3]).trigger("dxclick");
        $(checkboxes[4]).trigger("dxclick");
        $(checkboxes[5]).trigger("dxclick");
        $(checkboxes[6]).trigger("dxclick");

        assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), true);
        assert.equal($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);

    });

    QUnit.test("T173381", function(assert) {
        var $treeView = initTree({
                items: [
                    {
                        id: 777, text: 'root', items: [
                            {
                                id: 1, text: 'a', items:
                                    [
                                        {
                                            id: 11, text: 'a.1', expanded: true,
                                            items: [
                                                { id: 111, text: 'a.1.1' },
                                                { id: 112, text: 'a.1.2' }
                                            ]
                                        },
                                        { id: 12, text: 'a.2' }]
                            },
                            {
                                id: 2, text: 'b', expanded: true,
                                items: [
                                    { id: 21, text: 'b.1' },
                                    { id: 22, text: 'b.2' }
                                ]
                            }
                        ]
                    }
                ],
                showCheckBoxesMode: "normal"
            }),
            checkboxes = $treeView.find(".dx-checkbox");

        $(checkboxes[2]).trigger("dxclick");
        assert.strictEqual($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);

        $(checkboxes[6]).trigger("dxclick");
        assert.strictEqual($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);

        $(checkboxes[6]).trigger("dxclick");
        assert.strictEqual($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);
    });

    QUnit.test("T195986", function(assert) {
        var $treeView = initTree({
                items: [
                    {
                        id: 777, text: 'root', expanded: true, selected: true,
                        items: [
                            {
                                id: 1, text: 'a', expanded: true, selected: true, items:
                                    [
                                        {
                                            id: 11, text: 'a.1', expanded: true, selected: true,
                                            items: [
                                                { id: 111, text: 'a.1.1', selected: true },
                                                { id: 112, text: 'a.1.2', selected: true }
                                            ]
                                        }
                                    ]
                            }
                        ]
                    }
                ],
                showCheckBoxesMode: "normal"
            }),
            checkboxes = $treeView.find(".dx-checkbox");
        $(checkboxes[3]).trigger("dxclick");
        assert.strictEqual($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);

        $(checkboxes[3]).trigger("dxclick");
        assert.strictEqual($(checkboxes[0]).dxCheckBox("instance").option("value"), true);
    });

    QUnit.test("Selection works correct with custom rootValue", function(assert) {
        var data = [
                { id: 0, parentId: "none", text: "Animals" },
                { id: 1, parentId: 0, text: "Cat" },
                { id: 2, parentId: 0, text: "Dog" },
                { id: 3, parentId: 0, text: "Cow" },
                { id: 4, parentId: "none", text: "Birds" }
            ],
            treeView = initTree({
                dataSource: data,
                dataStructure: "plain",
                showCheckBoxesMode: "normal",
                rootValue: "none"
            }).dxTreeView("instance"),
            $icon = $(treeView.$element()).find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(0),
            $checkbox,
            nodes;

        $icon.trigger("dxclick");
        assert.equal(treeView.option("items").length, 5);

        $checkbox = treeView.$element().find(".dx-checkbox");
        $($checkbox.eq(1)).trigger("dxclick");
        nodes = treeView.getNodes();
        assert.ok(nodes[0].items[0].selected, "item was selected");
        assert.strictEqual(nodes[0].selected, undefined, "item selection has undefined state");
    });


    const configs = [];
    ['items', 'dataSource', 'createChildren'].forEach((dataSourceOption) => {
        [false, true].forEach((virtualModeEnabled) => {
            [false, true].forEach((expanded) => {
                configs.push({ dataSourceOption, virtualModeEnabled, expanded });
            });
        });
    });

    const ROOT_ID = 0;
    configs.forEach(config => {
        QUnit.module(`DataSource: ${config.dataSourceOption}. VirtualModeEnabled: ${config.virtualModeEnabled}. Expanded: ${config.expanded}`, () => {
            QUnit.test(`all.selected: false, selectionMode: multiple, selectNodesRecursive: true`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: true }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded }]);

                wrapper.checkSelectedKeys([]);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`all.selected: false, selectionMode: multiple, selectNodesRecursive: false`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: false }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded }]);

                wrapper.checkSelectedKeys([]);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`all.selected: true, SelectionMode: multiple, selectNodesRecursive: true`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: true }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded }]);

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? [1]
                    : [1, 2];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`all.selected: true, SelectionMode: multiple, selectNodesRecursive: false`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: false }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded }]);

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? [1]
                    : [1, 2];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1.selected: true, selectionMode: multiple, selectNodesRecursive: true - invalid config`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: true }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? [1]
                    : [1, 2, 3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1.selected: true, selectionMode: multiple, selectNodesRecursive: false`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: false }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                wrapper.checkSelectedKeys([1]);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1.selected: true, selectionMode: multiple, selectNodesRecursive: true -> expandAll`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: true }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                wrapper.instance.expandAll();

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? [1, 2]
                    : [1, 2, 3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1.selected: true, selectionMode: multiple, selectNodesRecursive: true -> selectAll -> expandAll`, function(assert) {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: true }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                wrapper.instance.selectAll();
                wrapper.instance.expandAll();

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? [1, 2]
                    : [1, 2, 3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
            });

            QUnit.test(`item1.selected: true, selectionMode: multiple, selectNodesRecursive: false -> expandAll`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: false }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                wrapper.instance.expandAll();

                wrapper.checkSelectedKeys([1]);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1.selected: true, selectionMode: multiple, selectNodesRecursive: false -> selectAll -> expandAll`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: false }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                wrapper.instance.selectAll();
                wrapper.instance.expandAll();

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? [1]
                    : [1, 2, 3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
            });

            QUnit.test(`item1_1.selected: true, selectionMode: multiple, selectNodesRecursive: true   - invalid config`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: true }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? []
                    : [1, 2, 3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1_1.selected: true, selectionMode: multiple, selectNodesRecursive: false`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: false }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? []
                    : [2];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1_1.selected: true, selectionMode: multiple, selectNodesRecursive: true -> expandAll   - invalid config`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: true }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                wrapper.instance.expandAll();
                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? [1, 2]
                    : [1, 2, 3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1_1.selected: true, selectionMode: multiple, selectNodesRecursive: true -> selectAll -> expandAll`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: true }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                wrapper.instance.selectAll();
                wrapper.instance.expandAll();
                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? [1, 2]
                    : [1, 2, 3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
            });

            QUnit.test(`item1_1.selected: true, selectionMode: multiple, selectNodesRecursive: false -> expandAll   - invalid config`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: false }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                wrapper.instance.expandAll();

                wrapper.checkSelectedKeys([2]);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1_1_1.selected: true, selectionMode: multiple, selectNodesRecursive: true   - invalid config`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: true }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: true, expanded: config.expanded }]);

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? []
                    : [1, 2, 3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1_1_1.selected: true, selectionMode: multiple, selectNodesRecursive: false`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: false }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: true, expanded: config.expanded }]);

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? []
                    : [3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1_1_1.selected: true, selectionMode: multiple, selectNodesRecursive: true -> expandAll   - invalid config`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: true }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: true, expanded: config.expanded }]);

                wrapper.instance.expandAll();

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? []
                    : [1, 2, 3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1_1_1.selected: true, selectionMode: multiple, selectNodesRecursive: true -> selectAll -> expandAll   - invalid config`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: true }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: true, expanded: config.expanded }]);

                wrapper.instance.selectAll();
                wrapper.instance.expandAll();

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? [1, 2]
                    : [1, 2, 3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
            });

            QUnit.test(`item1_1_1.selected: true, selectionMode: multiple, selectNodesRecursive: false -> expandAll`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: false }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: true, expanded: config.expanded }]);

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? []
                    : [3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`all.selected: false, selectionMode: single`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'single' }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded }]);

                wrapper.checkSelectedKeys([]);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`all.selected: true, SelectionMode: single`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'single' }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded }]);

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? [1]
                    : [2];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1.selected: true, selectionMode: single`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'single' }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                wrapper.checkSelectedKeys([1]);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1.selected: true, selectionMode: single -> expandAll`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'single' }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                wrapper.instance.expandAll();

                wrapper.checkSelectedKeys([1]);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1.selected: true, selectionMode: single -> selectAll -> expandAll`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'single' }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                wrapper.instance.selectAll();
                wrapper.instance.expandAll();

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? [1]
                    : [3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
            });

            QUnit.test(`item1_1.selected: true, selectionMode: single`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: false }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? []
                    : [2];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1_1.selected: true, selectionMode: single -> expandAll`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'single', selectNodesRecursive: false }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                wrapper.instance.expandAll();

                wrapper.checkSelectedKeys([2]);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1_1.selected: true, selectionMode: single -> selectAll -> expandAll`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'single', selectNodesRecursive: false }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

                wrapper.instance.selectAll();
                wrapper.instance.expandAll();

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? [2]
                    : [3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
            });

            QUnit.test(`item1_1_1.selected: true, selectionMode: single`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'single' }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: true, expanded: config.expanded }]);

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? []
                    : [3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1_1_1.selected: true, selectionMode: single -> expandAll`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'single' }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: true, expanded: config.expanded }]);

                wrapper.instance.expandAll();
                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? []
                    : [3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 0);
                wrapper.checkCallbacksCallOrder([]);
            });

            QUnit.test(`item1_1_1.selected: true, selectionMode: single -> selectAll -> expandAll`, function() {
                const wrapper = createWrapper(config, { selectionMode: 'single' }, [
                    { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                    { id: 3, text: "item1_1_1", parentId: 2, selected: true, expanded: config.expanded }]);

                wrapper.instance.selectAll();
                wrapper.instance.expandAll();

                const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                    ? [1]
                    : [3];

                wrapper.checkSelectedKeys(expectedKeys);
                wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
            });

            [true, false].forEach((selected) => {
                QUnit.test(`selectionMode: multiple, selectNodesRecursive: true, selected: ${selected} -> selectItem(item1 key)`, function() {
                    const wrapper = createWrapper(config, { selectNodesRecursive: true }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);

                    wrapper.instance.selectItem(1);
                    const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                        ? [1]
                        : [1, 2];

                    wrapper.checkSelectedKeys(expectedKeys);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', selected ? 0 : 1);
                    wrapper.checkCallbackCallCount('onSelectionChanged', selected ? 0 : 1);
                    wrapper.checkCallbacksCallOrder(selected
                        ? []
                        : ['onItemSelectionChanged', 'onSelectionChanged']);
                });

                QUnit.test(`selectionMode: multiple, selectNodesRecursive: false, selected: ${selected} -> selectItem(item1 key)`, function() {
                    const wrapper = createWrapper(config, { selectNodesRecursive: false }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded }]);

                    wrapper.instance.selectItem(1);

                    wrapper.checkSelectedKeys([1]);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', selected ? 0 : 1);
                    wrapper.checkCallbackCallCount('onSelectionChanged', selected ? 0 : 1);
                    wrapper.checkCallbacksCallOrder(selected
                        ? []
                        : ['onItemSelectionChanged', 'onSelectionChanged']);
                });

                QUnit.test(`selectionMode: multiple, selectNodesRecursive: true, selected: ${selected} -> selectItem(item1_1 key)   - invalid config`, function() {
                    const wrapper = createWrapper(config, { selectNodesRecursive: true }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);
                    wrapper.instance.selectItem(2);

                    const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                        ? []
                        : [1, 2];

                    const expectedCallsCount = !config.expanded && isLazyDataSourceMode(wrapper)
                        ? 0
                        : selected ? 0 : 1;

                    wrapper.checkSelectedKeys(expectedKeys);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', expectedCallsCount);
                    wrapper.checkCallbackCallCount('onSelectionChanged', expectedCallsCount);
                    wrapper.checkCallbacksCallOrder(expectedCallsCount
                        ? ['onItemSelectionChanged', 'onSelectionChanged']
                        : []);
                });

                QUnit.test(`selectionMode: multiple, selectNodesRecursive: false, selected: ${selected} -> selectItem(item1_1 key)`, function() {
                    const wrapper = createWrapper(config, { selectNodesRecursive: false }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);

                    wrapper.instance.selectItem(2);
                    const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                        ? []
                        : [2];

                    const expectedCallsCount = !config.expanded && isLazyDataSourceMode(wrapper)
                        ? 0
                        : selected ? 0 : 1;

                    wrapper.checkSelectedKeys(expectedKeys);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', expectedCallsCount);
                    wrapper.checkCallbackCallCount('onSelectionChanged', expectedCallsCount);
                    wrapper.checkCallbacksCallOrder(expectedCallsCount
                        ? ['onItemSelectionChanged', 'onSelectionChanged']
                        : []);
                });

                QUnit.test(`selectionMode: multiple, selectNodesRecursive: true, selected: ${selected} -> selectAll`, function() {
                    const wrapper = createWrapper(config, { selectNodesRecursive: true, selectionMode: 'multiple' }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);

                    wrapper.instance.selectAll();

                    const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                        ? [1]
                        : [1, 2];

                    wrapper.checkSelectedKeys(expectedKeys);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                    wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                    wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
                });

                QUnit.test(`selectionMode: multiple, selectNodesRecursive: true, selected: ${selected} -> selectAll -> expandAll`, function() {
                    const wrapper = createWrapper(config, { selectNodesRecursive: true, selectionMode: 'multiple' }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);

                    wrapper.instance.selectAll();
                    wrapper.instance.expandAll();

                    wrapper.checkSelectedKeys([1, 2]);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                    wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                    wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
                });

                QUnit.test(`selectionMode: multiple, selectNodesRecursive: false, selected: ${selected} -> selectAll`, function() {
                    const wrapper = createWrapper(config, { selectNodesRecursive: false, selectionMode: 'multiple' }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);

                    wrapper.instance.selectAll();

                    const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                        ? [1]
                        : [1, 2];

                    wrapper.checkSelectedKeys(expectedKeys);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                    wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                    wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
                });

                QUnit.test(`selectionMode: multiple, selectNodesRecursive: false, selected: ${selected} -> selectAll -> expandAll`, function() {
                    const wrapper = createWrapper(config, { selectNodesRecursive: false, selectionMode: 'multiple' }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);

                    wrapper.instance.selectAll();
                    wrapper.instance.expandAll();

                    const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                        ? selected ? [1, 2] : [1]
                        : [1, 2];

                    wrapper.checkSelectedKeys(expectedKeys);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                    wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                    wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
                });

                QUnit.test(`selectionMode: multiple, selectNodesRecursive: true, selected: ${selected} -> unselectItem(item1 key)`, function() {
                    const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: true }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);
                    wrapper.instance.unselectItem(1);

                    wrapper.checkSelectedKeys([]);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', selected ? 1 : 0);
                    wrapper.checkCallbackCallCount('onSelectionChanged', selected ? 1 : 0);
                    wrapper.checkCallbacksCallOrder(selected
                        ? ['onItemSelectionChanged', 'onSelectionChanged']
                        : []);
                });

                QUnit.test(`selectionMode: multiple, selectNodesRecursive: false, selected: ${selected} -> unselectItem(item1 key)`, function() {
                    const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: false }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded }]);

                    wrapper.instance.unselectItem(1);
                    const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                        ? []
                        : [2];

                    wrapper.checkSelectedKeys(expectedKeys);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', selected ? 1 : 0);
                    wrapper.checkCallbackCallCount('onSelectionChanged', selected ? 1 : 0);
                    wrapper.checkCallbacksCallOrder(selected
                        ? ['onItemSelectionChanged', 'onSelectionChanged']
                        : []);
                });

                QUnit.test(`selectionMode: multiple, selectNodesRecursive: true, selected: ${selected} -> unselectItem(item1_1 key)   - invalid config`, function() {
                    const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: true }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);

                    wrapper.instance.unselectItem(2);

                    const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                        ? [1]
                        : [];
                    const expectedCallsCount = !config.expanded && isLazyDataSourceMode(wrapper)
                        ? 0
                        : 1;

                    wrapper.checkSelectedKeys(expectedKeys);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', expectedCallsCount);
                    wrapper.checkCallbackCallCount('onSelectionChanged', expectedCallsCount);
                    wrapper.checkCallbacksCallOrder(expectedCallsCount
                        ? ['onItemSelectionChanged', 'onSelectionChanged']
                        : []);
                });

                QUnit.test(`selectionMode: multiple, selectNodesRecursive: false, selected: ${selected} -> unselectItem(item1_1 key)`, function() {
                    const wrapper = createWrapper(config, { selectionMode: 'multiple', selectNodesRecursive: false }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);

                    wrapper.instance.unselectItem(2);

                    const expectedCallsCount = !config.expanded && isLazyDataSourceMode(wrapper)
                        ? 0
                        : selected ? 1 : 0;

                    wrapper.checkSelectedKeys([1]);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', expectedCallsCount);
                    wrapper.checkCallbackCallCount('onSelectionChanged', expectedCallsCount);
                    wrapper.checkCallbacksCallOrder(expectedCallsCount
                        ? ['onItemSelectionChanged', 'onSelectionChanged']
                        : []);
                });

                QUnit.test(`selectionMode: multiple, selectNodesRecursive: true, selected: ${selected} -> unselectAll`, function() {
                    const wrapper = createWrapper(config, { selectNodesRecursive: true, selectionMode: 'multiple' }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);

                    wrapper.instance.unselectAll();

                    wrapper.checkSelectedKeys([]);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                    wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                    wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
                });

                QUnit.test(`selectionMode: multiple, selectNodesRecursive: false, selected: ${selected} -> unselectAll`, function() {
                    const wrapper = createWrapper(config, { selectNodesRecursive: false, selectionMode: 'multiple' }, [
                        { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                        { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);

                    wrapper.instance.unselectAll();

                    wrapper.checkSelectedKeys([]);
                    wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                    wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                    wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
                });

                [true, false].forEach((selectNodesRecursive) => {
                    QUnit.test(`selectionMode: single, selectNodesRecursive: ${selectNodesRecursive}, selected: ${selected} -> selectItem(item1 key)`, function() {
                        const wrapper = createWrapper(config, { selectNodesRecursive, selectionMode: 'single' }, [
                            { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                            { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded }]);

                        wrapper.instance.selectItem(1);

                        wrapper.checkSelectedKeys([1]);
                        wrapper.checkCallbackCallCount('onItemSelectionChanged', selected ? 0 : 1);
                        wrapper.checkCallbackCallCount('onSelectionChanged', selected ? 0 : 1);
                        wrapper.checkCallbacksCallOrder(selected
                            ? []
                            : ['onItemSelectionChanged', 'onSelectionChanged']);
                    });

                    QUnit.test(`selectionMode: single, selectNodesRecursive: ${selectNodesRecursive}, selected: ${selected} -> selectItem(item1_1 key)`, function() {
                        const wrapper = createWrapper(config, { selectNodesRecursive, selectionMode: 'single' }, [
                            { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                            { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);
                        wrapper.instance.selectItem(2);

                        const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                            ? []
                            : [2];
                        wrapper.checkSelectedKeys(expectedKeys);
                    });

                    QUnit.test(`selectionMode: single, selectNodesRecursive: ${selectNodesRecursive}, selected: ${selected} -> selectAll`, function() {
                        const wrapper = createWrapper(config, { selectNodesRecursive, selectionMode: 'single' }, [
                            { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                            { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded }]);

                        wrapper.instance.selectAll();
                        const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                            ? [1]
                            : [2];

                        wrapper.checkSelectedKeys(expectedKeys);
                        wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                        wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                        wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
                    });

                    QUnit.test(`selectionMode: single, selectNodesRecursive: ${selectNodesRecursive}, selected: ${selected} -> selectAll -> expandAll`, function() {
                        const wrapper = createWrapper(config, { selectNodesRecursive, selectionMode: 'single' }, [
                            { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                            { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded }]);

                        wrapper.instance.selectAll();
                        wrapper.instance.expandAll();
                        const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                            ? [1]
                            : [2];

                        wrapper.checkSelectedKeys(expectedKeys);
                        wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                        wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                        wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
                    });

                    QUnit.test(`selectionMode: single, selectNodesRecursive: ${selectNodesRecursive}, selected: ${selected} -> unselectItem(item1 key)    - invalid config`, function() {
                        const wrapper = createWrapper(config, { selectionMode: 'single', selectNodesRecursive: selectNodesRecursive }, [
                            { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                            { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded }]);

                        wrapper.instance.unselectItem(1);

                        const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                            ? []
                            : [2];
                        const expectedCallsCount = !config.expanded && isLazyDataSourceMode(wrapper)
                            ? selected ? 1 : 0
                            : 0;

                        wrapper.checkSelectedKeys(expectedKeys);
                        wrapper.checkCallbackCallCount('onItemSelectionChanged', expectedCallsCount);
                        wrapper.checkCallbackCallCount('onSelectionChanged', expectedCallsCount);
                        wrapper.checkCallbacksCallOrder(expectedCallsCount
                            ? ['onItemSelectionChanged', 'onSelectionChanged']
                            : []);
                    });

                    QUnit.test(`selectionMode: single, selectNodesRecursive: ${selectNodesRecursive}, selected: ${selected} -> unselectItem(item1_1 key)   - invalid config`, function() {
                        const wrapper = createWrapper(config, { selectionMode: 'single', selectNodesRecursive: selectNodesRecursive }, [
                            { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                            { id: 2, text: "item1_1", parentId: 1, selected, expanded: config.expanded }]);

                        wrapper.instance.unselectItem(2);

                        const expectedKeys = !config.expanded && isLazyDataSourceMode(wrapper)
                            ? [1]
                            : selected ? [] : [1];
                        const expectedCallsCount = !config.expanded && isLazyDataSourceMode(wrapper)
                            ? 0
                            : selected ? 1 : 0;

                        wrapper.checkSelectedKeys(expectedKeys);
                        wrapper.checkCallbackCallCount('onItemSelectionChanged', expectedCallsCount);
                        wrapper.checkCallbackCallCount('onSelectionChanged', expectedCallsCount);
                        wrapper.checkCallbacksCallOrder(expectedCallsCount
                            ? ['onItemSelectionChanged', 'onSelectionChanged']
                            : []);
                    });

                    QUnit.test(`selectionMode: single, selectNodesRecursive: ${selectNodesRecursive}, selected: ${selected} -> unselectAll`, function() {
                        const wrapper = createWrapper(config, { selectNodesRecursive, selectionMode: 'single' }, [
                            { id: 1, text: "item1", parentId: ROOT_ID, selected, expanded: config.expanded },
                            { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded }]);

                        wrapper.instance.unselectAll();

                        wrapper.checkSelectedKeys([]);
                        wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
                        wrapper.checkCallbackCallCount('onSelectionChanged', 1);
                        wrapper.checkCallbacksCallOrder(['onSelectionChanged']);
                    });
                });
            });
        });
    });


    [{ selectItemArgumentType: '$node', itemGetter: ($item) => $item },
        { selectItemArgumentType: 'DOMElement', itemGetter: ($item) => $item.get(0) }].forEach((config) => {
        QUnit.test(`all.selected: false -> selectItem(item1 ${config.selectItemArgumentType})`, function(assert) {
            const wrapper = createWrapper({ dataSourceOption: 'items', selectionMode: 'multiple' }, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false },
                { id: 2, text: "item1_1", parentId: 1, selected: false }]);

            const $root = wrapper.getElement().find('[aria-level="1"]');
            wrapper.instance.selectItem(config.itemGetter($root));

            wrapper.checkSelectedKeys([1, 2]);
            wrapper.checkCallbackCallCount('onItemSelectionChanged', 1);
            wrapper.checkCallbackCallCount('onSelectionChanged', 1);
            wrapper.checkCallbacksCallOrder(['onItemSelectionChanged', 'onSelectionChanged']);
        });

        QUnit.test(`all.selected: true -> selectItem(item1 ${config.selectItemArgumentType})`, function(assert) {
            const wrapper = createWrapper({ dataSourceOption: 'items', selectionMode: 'multiple' }, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: true },
                { id: 2, text: "item1_1", parentId: 1, selected: true }]);

            const $root = wrapper.getElement().find('[aria-level="1"]');
            wrapper.instance.selectItem(config.itemGetter($root));

            wrapper.checkSelectedKeys([1, 2]);
            wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
            wrapper.checkCallbackCallCount('onSelectionChanged', 0);
            wrapper.checkCallbacksCallOrder([]);
        });

        QUnit.test(`all.selected: false -> selectItem(item1_1 ${config.selectItemArgumentType})`, function(assert) {
            const wrapper = createWrapper({ dataSourceOption: 'items' }, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: true },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: true }]);

            const $root = wrapper.getElement().find('[aria-level="2"]');
            wrapper.instance.selectItem(config.itemGetter($root));

            wrapper.checkSelectedKeys([1, 2]);
            wrapper.checkCallbackCallCount('onItemSelectionChanged', 1);
            wrapper.checkCallbackCallCount('onSelectionChanged', 1);
            wrapper.checkCallbacksCallOrder([]);
        });

        QUnit.test(`all.selected: true -> selectItem(item1_1 ${config.selectItemArgumentType})`, function(assert) {
            const wrapper = createWrapper({ dataSourceOption: 'items' }, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: true },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: true }]);

            const $root = wrapper.getElement().find('[aria-level="2"]');
            wrapper.instance.selectItem(config.itemGetter($root));

            wrapper.checkSelectedKeys([1, 2]);
            wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
            wrapper.checkCallbackCallCount('onSelectionChanged', 0);
            wrapper.checkCallbacksCallOrder([]);
        });

        QUnit.test(`all.selected: false -> unselectItem(item1 ${config.selectItemArgumentType})`, function(assert) {
            const wrapper = createWrapper({ dataSourceOption: 'items' }, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false },
                { id: 2, text: "item1_1", parentId: 1, selected: false }]);

            const $root = wrapper.getElement().find('[aria-level="1"]');
            wrapper.instance.unselectItem(config.itemGetter($root));

            wrapper.checkSelectedKeys([]);
            wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
            wrapper.checkCallbackCallCount('onSelectionChanged', 0);
            wrapper.checkCallbacksCallOrder([]);
        });

        QUnit.test(`all.selected: true -> unselectItem(item1 ${config.selectItemArgumentType})`, function(assert) {
            const wrapper = createWrapper({ dataSourceOption: 'items' }, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: true },
                { id: 2, text: "item1_1", parentId: 1, selected: true }]);

            const $root = wrapper.getElement().find('[aria-level="1"]');
            wrapper.instance.unselectItem(config.itemGetter($root));

            wrapper.checkSelectedKeys([]);
            wrapper.checkCallbackCallCount('onItemSelectionChanged', 1);
            wrapper.checkCallbackCallCount('onSelectionChanged', 1);
            wrapper.checkCallbacksCallOrder(['onItemSelectionChanged', 'onSelectionChanged']);
        });

        QUnit.test(`all.selected: false -> unselectItem(item1_1 ${config.selectItemArgumentType})`, function(assert) {
            const wrapper = createWrapper({ dataSourceOption: 'items', expanded: true }, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false },
                { id: 2, text: "item1_1", parentId: 1, selected: false }]);

            const $root = wrapper.getElement().find('[aria-level="1"]');
            wrapper.instance.unselectItem(config.itemGetter($root));

            wrapper.checkSelectedKeys([]);
            wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
            wrapper.checkCallbackCallCount('onSelectionChanged', 0);
            wrapper.checkCallbacksCallOrder([]);
        });

        QUnit.test(`all.selected: true -> unselectItem(item1_1 ${config.selectItemArgumentType})`, function(assert) {
            const wrapper = createWrapper({ dataSourceOption: 'items' }, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: true },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: true }]);

            const $root = wrapper.getElement().find('[aria-level="2"]');
            wrapper.instance.unselectItem(config.itemGetter($root));

            wrapper.checkSelectedKeys([]);
            wrapper.checkCallbackCallCount('onItemSelectionChanged', 0);
            wrapper.checkCallbackCallCount('onSelectionChanged', 0);
            wrapper.checkCallbacksCallOrder([]);
        });
    });
});
