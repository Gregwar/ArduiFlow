blocks.register({
    name: "Digital input",
    family: "IO",
    description: "Digital input pin",
    size: "small",
    fields: [
        {
            name: "Pin",
            type: "string",
            defaultValue: "1",
            attrs: "editable"
        },
        {
            name: "Pull-up",
            type: "bool",
            defaultValue: false,
            attrs: "editable"
        },
        {
            name: "Output",
            attrs: "output",
            type: "bool"
        }
    ],
    generate: function(block, env) {
        var pin = block.getValue("Pin");
        var v = env.getFieldVariable(block, 'Output');

        env.setup += 'digitalWrite(' + pin + ', ';
        env.setup += (block.getValue('Pull-up') ? 'HIGH' : 'LOW') + ');\n';
        env.setup += 'pinMode(' + pin + ', INPUT);\n';

        env.loop += v.name + ' = digitalRead('+pin+')\n';
    }
});

blocks.register({
    name: "Digital output",
    family: "IO",
    description: "Digital output pin",
    size: "small",
    fields: [
        {
            name: "Pin",
            type: "string",
            defaultValue: "1",
            attrs: "editable"
        },
        {
            name: "Input",
            attrs: "input",
            type: "bool"
        }
    ],
    generate: function(block, env) {
        var pin = block.getValue("Pin");

        env.setup += 'pinMode(' + pin + ', OUTPUT);\n';

        env.loop += 'digitalWrite(' + pin + ', ' + env.getInput(block, 'Input') + ');\n';
    }
});

blocks.register({
    name: "Analog input",
    family: "IO",
    description: "Analog input",
    size: "small",
    fields: [
        {
            name: "Pin",
            type: "string",
            defaultValue: "1",
            attrs: "editable"
        },
        {
            name: "Output",
            attrs: "output",
            type: "int"
        }
    ],
    generate: function(block, env) {
        var pin = block.getValue("Pin");
        var v = env.getFieldVariable(block, 'Output');

        env.setup += 'pinMode(' + pin + ', INPUT_ANALOG);\n';

        env.loop += v.name + ' = analogRead('+pin+')\n';
    }
});

blocks.register({
    name: "PWM output",
    family: "IO",
    description: "Analog output pin",
    fields: [
        {
            name: "Pin",
            type: "string",
            defaultValue: "1",
            attrs: "editable"
        },
        {
            name: "Duty",
            attrs: "input",
            type: "int"
        }
    ],
    generate: function(block, env) {
        var pin = block.getValue("Pin");

        env.setup += 'pinMode(' + pin + ', PWM);\n';

        env.loop += 'analogWrite(' + pin + ', ' + env.getInput(block, 'Duty') + ');\n';
    }
});
