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
        for (var k in parts) {
            var part = parts[k];
            if (part.length && part[0]=='%') {
                var arg = parseInt(part.substr(1))-1;

                if (arg in args) {
                    env.loop += 'Serial.println('+args[arg].name+');\n';
                } else {
                    env.loop += 'Serial.println("?");\n';
                }
            } else {
                if (part != "") {
                    env.loop += 'Serial.println("'+part+'");\n';
                }
            }
        }
    }
});
