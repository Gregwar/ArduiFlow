blocks.register({
    name: "Chrono",
    family: "Time",
    description: "Outputs time",
    size: "small",
    fields: [
        {
            name: "Pause",
            attrs: "input",
            type: "bool"
        },
        {
            name: "Restart",
            attrs: "input",
            type: "bool"
        },
        {
            name: "T",
            attrs: "output",
            type: "number"
        }
    ],
    generate: function(block, env) {
        var t = env.getVariable(block, 'T', 'number', 0);
        env.setOutput(block, 'T', t);

        if (env.hasInput(block, 'Pause')) {
            env.loop += 'if (!('+env.getInput(block, 'Pause')+')) {\n';
        }
        env.loop += t + ' += '+(1.0/env.frequency)+';\n';
        if (env.hasInput(block, 'Pause')) {
            env.loop += '}\n';
        }
        if (env.hasInput(block, 'Restart')) {
            env.loop += 'if ('+env.getInput(block, 'Restart')+') {\n';
            env.loop += t +' = 0;\n';
            env.loop += '}\n';
        }
    }
});
