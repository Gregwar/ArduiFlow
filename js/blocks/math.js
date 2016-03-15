blocks.register({
    name: "Constant",
    family: "Math",
    description: "A constant value",
    size: "small",
    fields: [
        {
            name: "Value",
            attrs: "editable output",
            defaultValue: 1,
            type: "all"
        }
    ],
    generate: function(block, env) {
        env.setOutput(block, 'Value', env.getConstant(block.getValue('Value')));
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
            type: "number"
        },
        {
            name: "Sum",
            attrs: "output",
            type: "number"
        }
    ],
    generate: function(block, env) {
        var v = env.getFieldVariable(block, 'Sum');
        v.type = env.guessType(block);
        var inputs = env.getInput(block, 'Terms');

        if (inputs.length == 0) {
            env.loop += v.name + '= 0;\n';
        } else {
            env.loop += v.name + '= '+inputs.join(' + ')+';\n';
        }
    }
});


blocks.register({
    name: "Min",
    family: "Math",
    description: "Minimum",
    size: "small",
    fields: [
        {
            name: "Values",
            attrs: "input",
            type: "number"
        },
        {
            name: "Min",
            attrs: "output",
            type: "number"
        }
    ],
    generate: function(block, env) {
        var v = env.getFieldVariable(block, 'Min');
        v.type = env.guessType(block);
        var inputs = env.getInput(block, 'Values');
        var first = true;

        for (var k in inputs) {
            if (!first) env.loop += 'if ('+inputs[k].name+' < '+v.name+')\n';
            env.loop += v.name + '= '+inputs[k].name+';\n';
            first = false;
        }   
    }
});

blocks.register({
    name: "Max",
    family: "Math",
    description: "Maximum",
    size: "small",
    fields: [
        {
            name: "Values",
            attrs: "input",
            type: "number"
        },
        {
            name: "Max",
            attrs: "output",
            type: "number"
        }
    ],
    generate: function(block, env) {
        var v = env.getFieldVariable(block, 'Max');
        v.type = env.guessType(block);
        var inputs = env.getInput(block, 'Values');
        var first = true;

        for (var k in inputs) {
            if (!first) env.loop += 'if ('+inputs[k].name+' > '+v.name+')\n';
            env.loop += v.name + '= '+inputs[k].name+';\n';
            first = false;
        }   
    }
});
