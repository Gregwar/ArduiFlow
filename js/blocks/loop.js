blocks.register({
    name: "Loop",
    family: "Loop",
    description: "Can be used to create loop",
    size: "small",
    loopable: "true",
    fields: [
        {
            name: "Input",
            card: "1",
            attrs: "input",
            type: "number"
        },
        {
            name: "Output",
            card: "1",
            attrs: "output",
            type: "number"
        },
    ],
    generate: function(block, env) {
    }
});
