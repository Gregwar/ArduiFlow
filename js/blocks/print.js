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

        env.loop += 'Serial.println("'+message+'");\n';
    }
});
