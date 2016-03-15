blocks.register({
    name: "Smaller",
    family: "Logic",
    description: "Is A smaller than B?",
    size: "small",
    fields: [
        {
            name: "A",
            card: "1",
            attrs: "input",
            type: "number"
        },
        {
            name: "B",
            card: "1",
            attrs: "input",
            type: "number"
        },
        {
            name: "Smaller",
            label: "A < B",
            type: "bool",
            attrs: "output"
        }
    ],
    generate: function(block, env) {
        var v = env.getFieldVariable(block, 'Smaller');

        if (env.hasInput(block, 'A', 'B')) {
            env.loop += v.name + '= ' + env.getInput(block, 'A').name + '<' + env.getInput(block, 'B').name+';\n';
        }
    }
});

blocks.register({
    name: "And",
    family: "Logic",
    description: "Logic and",
    size: "small",
    fields: [
        {
            name: "Terms",
            attrs: "input",
            type: "bool"
        },
        {
            name: "And",
            attrs: "output",
            type: "bool"
        }
    ],
    generate: function(block, env) {
        var v = env.getFieldVariable(block, 'And');
        var inputs = env.getInput(block, 'Terms');

        if (inputs.length == 0) {
            env.loop += v.name + '= false;\n';
        } else {
            env.loop += v.name + '= '+inputs.join(' && ')+';\n';
        }
    }
});

blocks.register({
    name: "Or",
    family: "Logic",
    description: "Logic or",
    size: "small",
    fields: [
        {
            name: "Terms",
            attrs: "input",
            type: "bool"
        },
        {
            name: "Or",
            attrs: "output",
            type: "bool"
        }
    ],
    generate: function(block, env) {
        var v = env.getFieldVariable(block, 'Or');
        var inputs = env.getInput(block, 'Terms');

        if (inputs.length == 0) {
            env.loop += v.name + '= false;\n';
        } else {
            env.loop += v.name + '= '+inputs.join(' || ')+';\n';
        }
    }
});

blocks.register({
    name: "Not",
    family: "Logic",
    description: "Logic or",
    size: "small",
    fields: [
        {
            name: "A",
            attrs: "input",
            type: "bool"
        },
        {
            name: "NA",
            label: "Not A",
            attrs: "output",
            type: "bool"
        }
    ],
    generate: function(block, env) {
        var v = env.getFieldVariable(block, 'NA');

        if (env.hasInput(block, 'A')) {
            env.loop += v.name + '= !' + env.getInput(block, 'A')+';\n';
        }
    }
});

blocks.register({
    name: "Counter",
    family: "Logic",
    description: "Incremental counter, if overflow is >0, the counter will reach its default value again",
    size: "small",
    fields: [
        {
            name: "Default",
            defaultValue: 0,
            attrs: "editable",
            type: "int"
        },
        {
            name: "Increment",
            defaultValue: 1,
            attrs: "editable input",
            type: "int"
        },
        {
            name: "Overflow",
            defaultValue: 0,
            attrs: "editable",
            type: "int"
        },
        {
            name: "Trigger",
            card: "1",
            label: "Trigger",
            attrs: "input",
            type: "bool"
        },
        {
            name: "Value",
            label: "Value",
            attrs: "output",
            type: "int"
        }
    ],
    generate: function(block, env) {
        var v = env.getStateVariable(block, 'counter', 'int', block.getValue('Default'));
        var i = env.getFieldVariable(block, 'Increment');
        env.setOutput(block, 'Value', v);

        if (env.hasInput(block, 'Trigger')) {
            env.loop += 'if ('+env.getInput(block, 'Trigger')+') {\n';
            env.loop += v.name + '+= '+i+';\n';
            if (block.getValue('Overflow')) {
                env.loop += 'if ('+v.name+' > '+block.getValue('Overflow')+') {\n';
                env.loop += v.name + '= '+block.getValue('Default')+';\n';
                env.loop += '}\n';
            }
            env.loop += '}\n';
        }
    }
});
