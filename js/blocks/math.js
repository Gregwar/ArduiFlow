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
        var v = env.getOutput(block, 'Sum');
        v.type = env.guessType(block);

        if (!env.hasInput(block, 'Terms')) {
            env.loop += v.name + '= 0;\n';
        } else {
            var inputs = env.getInput(block, 'Terms');
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
        var v = env.getOutput(block, 'Min');
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
        var v = env.getOutput(block, 'Max');
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

blocks.register({
    name: "Bound",
    family: "Math",
    description: "Maximum",
    size: "small",
    fields: [
        {
            name: "Input",
            attrs: "input",
            type: "number",
            card: "1"
        },
        {
            name: "Output",
            attrs: "output",
            type: "number"
        },
        {

            name: "Min",
            attrs: "editable input",
            type: "number",
            defaultValue: 0
        },
        {
            name: "Max",
            attrs: "editable input",
            type: "number",
            defaultValue: 1
        }
    ],
    generate: function(block, env) {
        var min = env.getInput(block, 'Min');
        var max = env.getInput(block, 'Max');
        var output = env.getOutput(block, 'Output');

        output = env.guessType(block);

        if (env.hasInput(block, 'Input')) {
            var input = env.getInput(block, 'Input');
            env.loop += output + ' = ' + input + ';\n';
            env.loop += 'if ('+output+' > '+max+') { '+output+' = '+max+';\n';
            env.loop += 'if ('+output+' < '+min+') { '+output+' = '+min+';\n';
        }
    }
});
