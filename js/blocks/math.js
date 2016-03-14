blocks.register({
    name: "Integer",
    family: "Math",
    description: "A constant integer",
    size: "small",
    fields: [
        {
            name: "Value",
            attrs: "editable output",
            defaultValue: 1,
            type: "int"
        }
    ],
    generate: function(block, env) {
        var v = env.getFieldVariable(block, 'Value');
        env.loop += v.name + '= ' + block.getValue('Value')+';\n';
    }
});

blocks.register({
    name: "Float",
    family: "Math",
    description: "A constant float",
    size: "small",
    fields: [
        {
            name: "Value",
            attrs: "editable output",
            defaultValue: 1.0,
            type: "number"
        }
    ],
    generate: function(block, env) {
        var v = env.getFieldVariable(block, 'Value');
        env.loop += v.name + '= ' + block.getValue('Value')+';\n';
    }
});


blocks.register({
    name: "Sum",
    family: "Math",
    description: "Sum",
    size: "small",
    fields: [
        {
            name: "Terms",
            attrs: "input",
            type: "bool"
        },
        {
            name: "Sum",
            attrs: "output",
            type: "bool"
        }
    ],
    generate: function(block, env) {
        var v = env.getFieldVariable(block, 'Sum');
        var inputs = env.getInput(block, 'Terms');

        if (inputs.length == 0) {
            env.loop += v.name + '= 0;\n';
        } else {
            env.loop += v.name + '= '+inputs.join(' + ')+';\n';
        }
    }
});

