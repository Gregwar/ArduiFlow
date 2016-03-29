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

blocks.register({
    name: "Sinus",
    family: "Signal",
    description: "Sinus output",
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
            name: "Amplitude",
            card: "1",
            attrs: "input editable",
            defaultValue: 1,
            type: "number"
        },
        {
            name: "T",
            type: "float",
            attrs: "input"
        },
        {
            name: "Sinus",
            type: "float",
            attrs: "output"
        }
    ],
    generate: function(block, env) {
        if (env.hasInput(block, 'T')) {
            var t = env.getInput(block, 'T');
        } else {
            var t = env.getVariable(block, 't', 'float', 0);
            env.loop += t + ' += '+(1.0/env.frequency)+';\n';
        }

        var sinus = env.getOutput(block, 'Sinus');
        var amplitude = env.getInput(block, 'Amplitude');
        var freq = env.getInput(block, 'Frequency');
        env.loop += sinus + ' = sin('+t+'*2*M_PI*'+freq+')*'+amplitude+';\n';
    }
});

blocks.register({
    name: "EdgeDetector",
    family: "Signal",
    description: "Detects rising/falling edges",
    fields: [
        {
            name: "Rising",
            attrs: "input editable",
            defaultValue: true,
            type: "bool"
        },
        {
            name: "Falling",
            attrs: "input editable",
            defaultValue: false,
            type: "bool"
        },
        {
            name: "Input",
            type: "int",
            attrs: "input"
        },
        {
            name: "Output",
            type: "bool",
            attrs: "output"
        }
    ],
    generate: function(block, env) {
        if (env.hasInput(block, 'Input')) {
            var rising = env.getInput(block, 'Rising');
            var falling = env.getInput(block, 'Falling');
            var last = env.getVariable(block, 'last', 'int', 0);
            var input = env.getInput(block, 'Input');        
            var output = env.getOutput(block, 'Output');

            env.loop += output + ' = ';
            env.loop += ' ('+rising+' && ('+input+' > '+last+'))';
            env.loop += '|| ('+falling+' && ('+input+' < '+last+'))';
            env.loop += ';\n';
            env.loop += last + ' = ' + input + ';\n';
        }
    }
});

blocks.register({
    name: "Gains",
    family: "Signal",
    description: "Gains",
    size: "small",
    fields: [
        {
            name: "Gains",
            attrs: "editable",
            type: "number[]",
            defaultValue: [10],
            hide: true
        },
        {
            name: "Input",
            label: "X#",
            dimension: "Gains",
            type: "number[]",
            attrs: "input"
        },
        {
            name: "Output",
            dynamicLabel: function(block, x) {
                return block.getValue('Gains')[x]+'*X'+(x+1);
            },
            dimension: "Gains",
            type: "number[]",
            attrs: "output"
        },
    ],
    generate: function(block, env) {
        if (env.hasInput(block, 'Input')) {
            var input = env.getInput(block, 'Input');
            var output = env.getOutput(block, 'Output');
            var gains = block.getValue('Gains');

            for (k in output) {
                if (k in input) {
                    env.loop += output[k] + ' = '+gains[k]+'*'+input[k]+';\n';
                }
            }
        }
    }
});
