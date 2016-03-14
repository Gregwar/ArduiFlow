blocks.register({
    name: "Print",
    family: "Print",
    description: "Prints message",
    fields: [
        {
            name: "Message",
            attrs: "editable",
            type: "string",
            defaultValue: "i=%1"
        },
        {
            name: "Args",
            attrs: "input",
            extensible: true,
            type: "all[]"
        }
    ],
    generate: function(block, env) {
        var message = block.getValue('Message');
        var parts = message.split(/(%[0-9])/);
        var args = env.getInput(block, 'Args');
        if (!args) {
            args = {};
        }

        var n = 0;
        var arg = 1;
        for (var k in parts) {
            var part = parts[k];
            if (part == '%'+arg) {
                if ((arg-1) in args) {
                    env.loop += 'Serial.println('+args[arg-1].name+');\n';
                } else {
                    env.loop += 'Serial.println("?");\n';
                }
                arg++;
            } else {
                if (part != "") {
                    env.loop += 'Serial.println("'+part+'");\n';
                }
            }
        }
    }
});
