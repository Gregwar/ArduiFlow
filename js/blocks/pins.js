blocks.register({
    name: "Digital input",
    family: "Pins",
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
        var v = env.getOutput(block, 'Output');

        env.setup += 'digitalWrite(' + pin + ', ';
        env.setup += (block.getValue('Pull-up') ? 'HIGH' : 'LOW') + ');\n';
        env.setup += 'pinMode(' + pin + ', INPUT);\n';

        env.loop += v.name + ' = digitalRead('+pin+')\n';
    }
});

blocks.register({
    name: "Digital output",
    family: "Pins",
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
            card: "1",
            attrs: "input",
            type: "bool"
        }
    ],
    generate: function(block, env) {
        var pin = block.getValue("Pin");

        env.setup += 'pinMode(' + pin + ', OUTPUT);\n';

        if (env.hasInput(block, 'Input')) {
            env.loop += 'digitalWrite(' + pin + ', ' + env.getInput(block, 'Input').name + ');\n';
        }
    }
});

blocks.register({
    name: "Analog input",
    family: "Pins",
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
        var v = env.getOutput(block, 'Output');

        env.setup += 'pinMode(' + pin + ', INPUT);\n';

        env.loop += v.name + ' = analogRead('+pin+');\n';
    }
});

blocks.register({
    name: "PWM output",
    family: "Pins",
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
            card: "1",
            type: "int"
        }
    ],
    generate: function(block, env) {
        var pin = block.getValue("Pin");

        env.setup += 'pinMode(' + pin + ', PWM);\n';

        if (env.hasInput(block, 'Duty')) {
            env.loop += 'analogWrite(' + pin + ', ' + env.getInput(block, 'Duty').name + ');\n';
        }
    }
});
