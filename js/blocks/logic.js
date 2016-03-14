blocks.register({
    name: "Smaller",
    family: "Logic",
    description: "Is A smaller than B?",
    size: "small",
    fields: [
        {
            name: "A",
            attrs: "input",
            type: "number"
        },
        {
            name: "B",
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

        env.loop += v.name + '= ' + env.getInput(block, 'A') + '<' + env.getInput(block, 'B')+';\n';
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

