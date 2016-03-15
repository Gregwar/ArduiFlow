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
        var d = env.getStateVariable(block, 'divider', 'int', 0);
        var f = env.getFieldVariable(block, 'Frequency');
        var p = env.getFieldVariable(block, 'Pulse');

        env.loop += d.name + '++;\n'
        env.loop += p.name + '= ('+d.name+' > ('+env.frequency+'/'+f.name+'));\n';
        env.loop += 'if ('+p.name+') '+d.name+'=0;\n';
    }
});
