blocks.register({
    name: "Loop",
    family: "Loop",
    description: "Can be used to create loop",
    size: "small",
    loopable: "true",
    fields: [
        {
            name: "Input",
            card: "1",
            attrs: "input",
            type: "number"
        },
        {
            name: "Output",
            card: "1",
            defaultValue: 1,
            attrs: "output editable",
            type: "number"
        },
    ],
    generate: function(block, env) {
        var input = env.getInput(block, 'Input');
        var save = env.getVariable(block, 'save', input.type);
        env.setOutput(block, 'Output', save);

        env.loop += save.name + ' = ' + input.name + ';\n';
    }
});
