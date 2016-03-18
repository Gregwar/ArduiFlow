blocks.register({
    name: "Pulse",
    family: "Signal",
    description: "Send pulses",
    size: "small",
    fields: [
        {
            name: "Frequency",
            card: "1",
            unit: "Hz",
            attrs: "input editable",
            defaultValue: 1,
            type: "number"
        },
        {
            name: "Pulse",
            type: "bool",
            attrs: "output"
        }
    ],
    generate: function(block, env) {
        var d = env.getVariable(block, 'divider', 'int', 0);
        var f = env.getInput(block, 'Frequency');
        var p = env.getOutput(block, 'Pulse');

        env.loop += p.name + '= ('+d.name+' > ('+env.frequency+'/'+f.name+'));\n';
        env.loop += d.name + '++;\n'
        env.loop += 'if ('+p.name+') '+d.name+'=0;\n';
    }
});

blocks.register({
    name: "Square",
    family: "Signal",
    description: "A square signal",
    size: "small",
    fields: [
        {
            name: "Duty",
            card: "1",
            unit: "%",
            attrs: "input editable",
            defaultValue: 50,
            type: "number"
        },
        {
            name: "Frequency",
            card: "1",
            unit: "Hz",
            attrs: "input editable",
            defaultValue: 1,
            type: "number"
        },
        {
            name: "Signal",
            type: "bool",
            attrs: "output"
        }
    ],
    generate: function(block, env) {
        var d = env.getVariable(block, 'divider', 'int', 0);
        var f = env.getInput(block, 'Frequency');
        var duty = env.getOutput(block, 'Duty');
        var s = env.getOutput(block, 'Signal');

        // Reseting the counter when it overflowed
        env.loop += 'if ('+d.name+' > ('+env.frequency+'/'+f.name+')) '+d.name+'=0;\n';

        // Setting the output
        env.loop += s.name + ' = ('+d.name+' < (('+duty+'*'+env.frequency+')/('+f.name+'*100)));\n';

        // Incrementing the divider
        env.loop += d.name + '++;\n';
    }
});
