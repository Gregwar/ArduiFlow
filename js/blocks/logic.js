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
            env.loop += v.name + '= '+inputs.join(' && ').to('bool')+';\n';
        }
    }
});

