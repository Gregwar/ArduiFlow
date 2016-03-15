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
            name: "Trigger",
            card: "1",
            attrs: "input",
            type: "bool"
        },
        {
            name: "Args",
            attrs: "input",
            extensible: true,
            type: "all[]"
        }
    ],
    generate: function(block, env) {
        if (env.hasInput(block, 'Trigger')) {
            env.loop += 'if ('+env.getInput(block, 'Trigger')+') {\n';
            var message = block.getValue('Message');
            var parts = message.split(/(%[0-9])/);
            var args = env.getInput(block, 'Args');
            if (!args) {
                args = {};
            }

            var n = 0;
            var prints = [];
            for (var k in parts) {
                var part = parts[k];
                if (part.length && part[0]=='%') {
                    var arg = parseInt(part.substr(1))-1;

                    if (arg in args) {
                        prints.push(args[arg].name);
                    } else {
                        prints.push("?");
                    }
                } else {
                    if (part != "") {
                        prints.push('"'+part+'"');
                    }
                }
            }
            for (var k in prints) {
                var part = prints[k];
                if (k == prints.length-1) {
                    env.loop += 'Serial.println('+part+');\n';
                } else {
                    env.loop += 'Serial.print('+part+');\n';
                }
            }
            env.loop += '}\n';
        }
    }
});
